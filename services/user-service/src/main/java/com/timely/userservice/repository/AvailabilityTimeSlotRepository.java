package com.timely.userservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import com.timely.userservice.model.AvailabilityTimeSlot;

/**
 * Repository for AvailabilityTimeSlot entity
 */
@Repository
public interface AvailabilityTimeSlotRepository extends JpaRepository<AvailabilityTimeSlot, UUID> {
    
    /**
     * Find all time slots for a specific availability
     */
    List<AvailabilityTimeSlot> findByAvailabilityId(UUID availabilityId);
    
    /**
     * Delete all time slots for a specific availability
     * Used when updating availability to clear old slots
     */
    @Modifying
    void deleteByAvailabilityId(UUID availabilityId);
}
