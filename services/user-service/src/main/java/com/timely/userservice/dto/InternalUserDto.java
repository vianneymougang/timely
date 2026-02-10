package com.timely.userservice.dto;

import com.timely.userservice.model.UserRole;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for internal service-to-service communication
 * Contains sensitive information like password hash
 */
public class InternalUserDto {

    private UUID id;
    private String email;
    private String name;
    private String surname;
    private String password;  // Hashed password
    private UserRole role;
    private Boolean status;
    private LocalDateTime creationDate;

    // Constructeurs
    public InternalUserDto() {
    }

    public InternalUserDto(UUID id, String email, String name, String surname,
                           String password, UserRole role, Boolean status,
                           LocalDateTime creationDate) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.password = password;
        this.role = role;
        this.status = status;
        this.creationDate = creationDate;
    }

    // Getters
    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getSurname() {
        return surname;
    }

    public String getPassword() {
        return password;
    }

    public UserRole getRole() {
        return role;
    }

    public Boolean getStatus() {
        return status;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    // Setters
    public void setId(UUID id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }

    // Méthode utilitaire
    public String getFullName() {
        return name + " " + surname;
    }

}