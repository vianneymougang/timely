package com.timely.authservice.service;

<<<<<<< HEAD
import com.timely.authservice.model.User;
import com.timely.authservice.repository.UserRepository;
=======
import java.util.Collection;
import java.util.Collections;

>>>>>>> 0ea8e076f89dd6ae6a11210df6b146a8af9075d8
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
public class CustomUserDetailsService implements UserDetailsService {

    private final UserServiceClient userServiceClient;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

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
