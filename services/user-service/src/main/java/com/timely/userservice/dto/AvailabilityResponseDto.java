package com.timely.userservice.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class AvailabilityResponseDto {

    private UUID userId;
    private String teacherId;
    private String teacherName;
    private String teacherEmail;
    private List<TimeSlotDto> timeSlots;
    private LocalDateTime lastUpdated;

    // Constructeurs
    public AvailabilityResponseDto() {
    }

    public AvailabilityResponseDto(UUID userId, String teacherId, String teacherName,
                                   String teacherEmail, List<TimeSlotDto> timeSlots,
                                   LocalDateTime lastUpdated) {
        this.userId = userId;
        this.teacherId = teacherId;
        this.teacherName = teacherName;
        this.teacherEmail = teacherEmail;
        this.timeSlots = timeSlots;
        this.lastUpdated = lastUpdated;
    }

    // Getters
    public UUID getUserId() {
        return userId;
    }

    public String getTeacherId() {
        return teacherId;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public String getTeacherEmail() {
        return teacherEmail;
    }

    public List<TimeSlotDto> getTimeSlots() {
        return timeSlots;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    // Setters
    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public void setTeacherEmail(String teacherEmail) {
        this.teacherEmail = teacherEmail;
    }

    public void setTimeSlots(List<TimeSlotDto> timeSlots) {
        this.timeSlots = timeSlots;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}