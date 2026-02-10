package com.timely.userservice.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class TeacherAvailabilitySummaryDto {

    private UUID userId;
    private String teacherName;
    private String teacherEmail;
    private boolean hasAvailability;
    private LocalDateTime lastUpdated;

    // Constructeurs
    public TeacherAvailabilitySummaryDto() {
    }

    public TeacherAvailabilitySummaryDto(UUID userId, String teacherName, String teacherEmail,
                                         boolean hasAvailability, LocalDateTime lastUpdated) {
        this.userId = userId;
        this.teacherName = teacherName;
        this.teacherEmail = teacherEmail;
        this.hasAvailability = hasAvailability;
        this.lastUpdated = lastUpdated;
    }

    // Getters
    public UUID getUserId() {
        return userId;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public String getTeacherEmail() {
        return teacherEmail;
    }

    public boolean isHasAvailability() {
        return hasAvailability;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    // Setters
    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public void setTeacherEmail(String teacherEmail) {
        this.teacherEmail = teacherEmail;
    }

    public void setHasAvailability(boolean hasAvailability) {
        this.hasAvailability = hasAvailability;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}