package com.timely.userservice.repository;

import com.timely.userservice.model.User;
import com.timely.userservice.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    List<User> findByRole(UserRole role);

    List<User> findByIsActive(Boolean isActive);

    boolean existsByEmail(String email);
}