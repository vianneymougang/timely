package com.timely.authservice.service;

import java.util.Collection;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.timely.authservice.client.UserServiceClient;
import com.timely.authservice.dto.InternalUserDto;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserServiceClient userServiceClient;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        try {
            InternalUserDto user = userServiceClient.findByEmail(email);

            // User is enabled if status is true (active)
            boolean enabled = (user.getStatus() != null && user.getStatus());
            boolean accountNonLocked = enabled;

            return new org.springframework.security.core.userdetails.User(
                    user.getEmail(),
                    user.getPassword(),
                    enabled,  // enabled if status is true
                    true,  // accountNonExpired
                    true,  // credentialsNonExpired
                    accountNonLocked,  // accountNonLocked
                    getAuthorities(user)
            );
        } catch (Exception e) {
            throw new UsernameNotFoundException("User not found with email: " + email, e);
        }
    }

    private Collection<? extends GrantedAuthority> getAuthorities(InternalUserDto user) {
        return Collections.singletonList(new SimpleGrantedAuthority(user.getRole()));
    }
}
