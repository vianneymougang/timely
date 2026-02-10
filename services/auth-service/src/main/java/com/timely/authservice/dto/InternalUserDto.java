package com.timely.authservice.dto;

import java.util.UUID;

/**
 * DTO for receiving user data from user-service
 */
public class InternalUserDto {

    private UUID id;
    private String email;
    private String name;
    private String surname;
    private String password;
    private String role;
    private Boolean status;

    // Constructeurs
    public InternalUserDto() {
    }

    public InternalUserDto(UUID id, String email, String name, String surname,
                           String password, String role, Boolean status) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.password = password;
        this.role = role;
        this.status = status;
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

    public String getRole() {
        return role;
    }

    public Boolean getStatus() {
        return status;
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

    public void setRole(String role) {
        this.role = role;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public String getFullName() {
        return name + " " + surname;
    }
}