package com.timely.authservice.service;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.timely.authservice.client.UserServiceClient;
import com.timely.authservice.dto.InternalUserDto;
import com.timely.authservice.model.UserStatus;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserServiceClient userServiceClient;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        try {
            InternalUserDto user = userServiceClient.findByEmail(email);

            // BLOCKED users cannot authenticate
            // ACTIVE users are enabled, SUSPENDED/INACTIVE users are disabled but not locked
            boolean enabled = (user.getStatus() == UserStatus.ACTIVE);
            boolean accountNonLocked = (user.getStatus() != UserStatus.BLOCKED && user.getStatus() != UserStatus.SUSPENDED);

            return new org.springframework.security.core.userdetails.User(
                    user.getEmail(),
                    user.getPassword(),
                    enabled,  // enabled only if ACTIVE
                    true,  // accountNonExpired
                    true,  // credentialsNonExpired
                    accountNonLocked,  // accountNonLocked (false if BLOCKED or SUSPENDED)
                    getAuthorities(user)
            );
        } catch (Exception e) {
            throw new UsernameNotFoundException("User not found with email: " + email, e);
        }
    }

    private Collection<? extends GrantedAuthority> getAuthorities(InternalUserDto user) {
        return Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name()));
    }
}
