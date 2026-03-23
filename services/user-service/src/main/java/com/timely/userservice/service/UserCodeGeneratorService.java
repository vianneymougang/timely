package com.timely.userservice.service;

public interface UserCodeGeneratorService {
    /**
     * Generate a unique teacher code (format: T000001, T000002, etc.)
     */
    String generateTeacherCode();

    /**
     * Generate a unique admin code (format: A000001, A000002, etc.)
     */
    String generateAdminCode();
}
