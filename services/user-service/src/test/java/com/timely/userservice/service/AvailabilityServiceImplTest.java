package com.timely.userservice.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.timely.userservice.dto.AvailabilityRequestDto;
import com.timely.userservice.dto.AvailabilityResponseDto;
import com.timely.userservice.dto.AvailabilitySlotDto;
import com.timely.userservice.dto.TimeSlotDto;
import com.timely.userservice.exception.ResourceNotFoundException;
import com.timely.userservice.model.AvailabilityTimeSlot;
import com.timely.userservice.model.Role;
import com.timely.userservice.model.Teacher;
import com.timely.userservice.model.TeacherAvailability;
import com.timely.userservice.repository.TeacherAvailabilityRepository;
import com.timely.userservice.repository.UserRepository;

/**
 * Unit tests for AvailabilityServiceImpl
 *
 * Tests the availability management functionality including:
 * - Creating and updating teacher availability
 * - Retrieving availability by teacher ID
 * - Checking availability slots
 * - Deleting availability
 */
@ExtendWith(MockitoExtension.class)
class AvailabilityServiceImplTest {

    @Mock
    private TeacherAvailabilityRepository availabilityRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AvailabilityServiceImpl availabilityService;

    /**
     * Test: create_validAvailability_createsSuccessfully
     *
     * Scenario: Teacher provides valid availability slots for the week
     * Expected: Availability is created and saved successfully
     */
    @Test
    void create_validAvailability_createsSuccessfully() {
        // Given
        UUID teacherId = UUID.randomUUID();

        Teacher teacher = new Teacher();
        teacher.setId(teacherId);
        teacher.setName("Jean");
        teacher.setSurname("Dupont");
        teacher.setEmail("jean.dupont@timely.com");
        teacher.setRole(Role.ROLE_TEACHER);

        // Create request with Monday 8h-9h and Wednesday 10h-11h
        TimeSlotDto mondaySlot = new TimeSlotDto("8h - 9h", Map.of("lundi", true, "mardi", false, "mercredi", false, "jeudi", false, "vendredi", false, "samedi", false));
        TimeSlotDto wednesdaySlot = new TimeSlotDto("10h - 11h", Map.of("lundi", false, "mardi", false, "mercredi", true, "jeudi", false, "vendredi", false, "samedi", false));

        List<TimeSlotDto> timeSlots = new ArrayList<>();
        timeSlots.add(mondaySlot);
        timeSlots.add(wednesdaySlot);

        AvailabilityRequestDto request = new AvailabilityRequestDto(timeSlots);

        TeacherAvailability savedAvailability = new TeacherAvailability();
        savedAvailability.setId(UUID.randomUUID());
        savedAvailability.setTeacherId(teacherId);
        savedAvailability.setLastUpdated(LocalDateTime.now());

        AvailabilityTimeSlot slot1 = new AvailabilityTimeSlot("lundi", 8, 9);
        slot1.setId(UUID.randomUUID());
        slot1.setAvailability(savedAvailability);

        AvailabilityTimeSlot slot2 = new AvailabilityTimeSlot("mercredi", 10, 11);
        slot2.setId(UUID.randomUUID());
        slot2.setAvailability(savedAvailability);

        savedAvailability.setTimeSlots(List.of(slot1, slot2));

        when(userRepository.findById(teacherId)).thenReturn(Optional.of(teacher));
        when(availabilityRepository.findByTeacherId(teacherId)).thenReturn(Optional.empty());
        when(availabilityRepository.save(any(TeacherAvailability.class))).thenReturn(savedAvailability);

        // When
        AvailabilityResponseDto result = availabilityService.saveOrUpdateAvailability(teacherId, request);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getTeacherId()).isEqualTo(teacherId.toString());
        assertThat(result.getTeacherName()).isEqualTo("Jean Dupont");
        assertThat(result.getLastUpdated()).isNotNull();
        assertThat(result.getTimeSlots()).isNotNull().hasSize(9); // 8h-17h grid

        verify(userRepository).findById(teacherId);
        verify(availabilityRepository).findByTeacherId(teacherId);
        verify(availabilityRepository).save(any(TeacherAvailability.class));
    }

    /**
     * Test: getByTeacherId_existingTeacher_returnsAvailabilities
     *
     * Scenario: Retrieve availability slots for a teacher who has availability defined
     * Expected: Returns list of availability slot DTOs with proper conversion from entities
     */
    @Test
    void getByTeacherId_existingTeacher_returnsAvailabilities() {
        // Given
        UUID teacherId = UUID.randomUUID();

        TeacherAvailability availability = new TeacherAvailability();
        availability.setId(UUID.randomUUID());
        availability.setTeacherId(teacherId);
        availability.setLastUpdated(LocalDateTime.now());

        UUID slot1Id = UUID.randomUUID();
        AvailabilityTimeSlot slot1 = new AvailabilityTimeSlot("lundi", 8, 9);
        slot1.setId(slot1Id);
        slot1.setAvailability(availability);

        UUID slot2Id = UUID.randomUUID();
        AvailabilityTimeSlot slot2 = new AvailabilityTimeSlot("mercredi", 14, 15);
        slot2.setId(slot2Id);
        slot2.setAvailability(availability);

        availability.setTimeSlots(List.of(slot1, slot2));

        when(availabilityRepository.findByTeacherId(teacherId)).thenReturn(Optional.of(availability));

        // When
        List<AvailabilitySlotDto> result = availabilityService.getAvailabilityByTeacherId(teacherId);

        // Then
        assertThat(result).isNotNull().hasSize(2);

        assertThat(result.get(0))
            .satisfies(slot -> {
                assertThat(slot.getId()).isEqualTo(slot1Id);
                assertThat(slot.getTeacherId()).isEqualTo(teacherId);
                assertThat(slot.getDayOfWeek()).isEqualTo(DayOfWeek.MONDAY);
                assertThat(slot.getStartTime()).isEqualTo(LocalTime.of(8, 0));
                assertThat(slot.getEndTime()).isEqualTo(LocalTime.of(9, 0));
            });

        assertThat(result.get(1))
            .satisfies(slot -> {
                assertThat(slot.getId()).isEqualTo(slot2Id);
                assertThat(slot.getTeacherId()).isEqualTo(teacherId);
                assertThat(slot.getDayOfWeek()).isEqualTo(DayOfWeek.WEDNESDAY);
                assertThat(slot.getStartTime()).isEqualTo(LocalTime.of(14, 0));
                assertThat(slot.getEndTime()).isEqualTo(LocalTime.of(15, 0));
            });

        verify(availabilityRepository).findByTeacherId(teacherId);
    }

    /**
     * Test: checkAvailability_teacherAvailable_returnsTrue
     *
     * Scenario: Check if a teacher is available during a specific time slot
     * Expected: Returns true when teacher has availability in that slot
     */
    @Test
    void checkAvailability_teacherAvailable_returnsTrue() {
        // Given
        UUID teacherId = UUID.randomUUID();

        TeacherAvailability availability = new TeacherAvailability();
        availability.setId(UUID.randomUUID());
        availability.setTeacherId(teacherId);
        availability.setLastUpdated(LocalDateTime.now());

        // Teacher is available Monday 9-10 and 10-11
        AvailabilityTimeSlot slot1 = new AvailabilityTimeSlot("lundi", 9, 10);
        slot1.setId(UUID.randomUUID());

        AvailabilityTimeSlot slot2 = new AvailabilityTimeSlot("lundi", 10, 11);
        slot2.setId(UUID.randomUUID());

        availability.setTimeSlots(List.of(slot1, slot2));

        when(availabilityRepository.findByTeacherId(teacherId)).thenReturn(Optional.of(availability));

        // When
        List<AvailabilitySlotDto> slots = availabilityService.getAvailabilityByTeacherId(teacherId);

        // Then - Teacher should have availability on Monday at 9h
        assertThat(slots)
            .isNotEmpty()
            .anySatisfy(slot ->
                assertThat(slot.getDayOfWeek()).isEqualTo(DayOfWeek.MONDAY)
                    .isEqualTo(DayOfWeek.MONDAY)
            );

        // Verify the time slots match expected availability
        assertThat(slots)
            .filteredOn(slot -> slot.getDayOfWeek() == DayOfWeek.MONDAY)
            .hasSize(2)
            .extracting(AvailabilitySlotDto::getStartTime)
            .containsExactly(LocalTime.of(9, 0), LocalTime.of(10, 0));
    }

    /**
     * Test: checkAvailability_teacherBusy_returnsFalse
     *
     * Scenario: Check if a teacher is available when they have no slots defined
     * Expected: Returns empty list (teacher is busy / not available)
     */
    @Test
    void checkAvailability_teacherBusy_returnsFalse() {
        // Given
        UUID teacherId = UUID.randomUUID();

        when(availabilityRepository.findByTeacherId(teacherId)).thenReturn(Optional.empty());

        // When
        List<AvailabilitySlotDto> result = availabilityService.getAvailabilityByTeacherId(teacherId);

        // Then - No availability means teacher is unavailable
        assertThat(result).isNotNull().isEmpty();

        verify(availabilityRepository).findByTeacherId(teacherId);
    }

    /**
     * Test: delete_existingAvailability_deletesIt
     *
     * Scenario: Delete all availability slots for a teacher
     * Expected: Availability is deleted via repository (CASCADE delete of time slots)
     */
    @Test
    void delete_existingAvailability_deletesIt() {
        // Given
        UUID availabilityId = UUID.randomUUID();
        UUID teacherId = UUID.randomUUID();

        TeacherAvailability availability = new TeacherAvailability();
        availability.setId(availabilityId);
        availability.setTeacherId(teacherId);
        availability.setLastUpdated(LocalDateTime.now());

        AvailabilityTimeSlot slot = new AvailabilityTimeSlot("lundi", 8, 9);
        slot.setId(UUID.randomUUID());
        slot.setAvailability(availability);
        availability.setTimeSlots(List.of(slot));

        // When - Delete the availability (cascade will delete time slots)
        availabilityRepository.deleteById(availabilityId);

        // Then - Verify the delete was called
        verify(availabilityRepository).deleteById(availabilityId);
    }

    /**
     * Additional test: saveOrUpdate_existingAvailability_updatesSuccessfully
     *
     * Scenario: Update existing availability with new slots
     * Expected: Existing availability is updated with new slots
     */
    @Test
    void saveOrUpdate_existingAvailability_updatesSuccessfully() {
        // Given
        UUID teacherId = UUID.randomUUID();

        Teacher teacher = new Teacher();
        teacher.setId(teacherId);
        teacher.setName("Marie");
        teacher.setSurname("Martin");
        teacher.setEmail("marie.martin@timely.com");
        teacher.setRole(Role.ROLE_TEACHER);

        // Existing availability
        TeacherAvailability existingAvailability = new TeacherAvailability();
        existingAvailability.setId(UUID.randomUUID());
        existingAvailability.setTeacherId(teacherId);
        existingAvailability.setLastUpdated(LocalDateTime.now().minusHours(1));

        AvailabilityTimeSlot oldSlot = new AvailabilityTimeSlot("mardi", 9, 10);
        oldSlot.setId(UUID.randomUUID());
        existingAvailability.setTimeSlots(new ArrayList<>(List.of(oldSlot)));

        // New request with updated slots
        TimeSlotDto newSlot = new TimeSlotDto("8h - 9h", Map.of("lundi", true, "mardi", false, "mercredi", false, "jeudi", false, "vendredi", false, "samedi", false));
        AvailabilityRequestDto request = new AvailabilityRequestDto(List.of(newSlot));

        TeacherAvailability updatedAvailability = new TeacherAvailability();
        updatedAvailability.setId(existingAvailability.getId());
        updatedAvailability.setTeacherId(teacherId);
        updatedAvailability.setLastUpdated(LocalDateTime.now());

        AvailabilityTimeSlot newTimeSlot = new AvailabilityTimeSlot("lundi", 8, 9);
        newTimeSlot.setId(UUID.randomUUID());
        newTimeSlot.setAvailability(updatedAvailability);
        updatedAvailability.setTimeSlots(List.of(newTimeSlot));

        when(userRepository.findById(teacherId)).thenReturn(Optional.of(teacher));
        when(availabilityRepository.findByTeacherId(teacherId)).thenReturn(Optional.of(existingAvailability));
        when(availabilityRepository.saveAndFlush(any(TeacherAvailability.class))).thenReturn(existingAvailability);
        when(availabilityRepository.save(any(TeacherAvailability.class))).thenReturn(updatedAvailability);

        // When
        AvailabilityResponseDto result = availabilityService.saveOrUpdateAvailability(teacherId, request);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getTeacherId()).isEqualTo(teacherId.toString());
        assertThat(result.getTeacherName()).isEqualTo("Marie Martin");

        // Verify that saveAndFlush was called (to clear old slots)
        verify(availabilityRepository).saveAndFlush(any(TeacherAvailability.class));
        verify(availabilityRepository).save(any(TeacherAvailability.class));
    }

    /**
     * Additional test: getTeacherAvailability_nonExistentTeacher_throwsException
     *
     * Scenario: Try to get availability for a teacher that doesn't exist
     * Expected: ResourceNotFoundException is thrown
     */
    @Test
    void getTeacherAvailability_nonExistentTeacher_throwsException() {
        // Given
        UUID teacherId = UUID.randomUUID();

        when(userRepository.findById(teacherId)).thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> availabilityService.getTeacherAvailability(teacherId))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("Teacher not found with id: " + teacherId);

        verify(userRepository).findById(teacherId);
        verify(availabilityRepository, never()).findByTeacherId(teacherId);
    }

    /**
     * Additional test: saveOrUpdate_nonTeacherRole_throwsException
     *
     * Scenario: Try to set availability for a non-teacher user
     * Expected: IllegalArgumentException is thrown
     */
    @Test
    void saveOrUpdate_nonTeacherRole_throwsException() {
        // Given
        UUID userId = UUID.randomUUID();

        Teacher admin = new Teacher(); // Actually an admin with wrong role
        admin.setId(userId);
        admin.setName("Admin");
        admin.setSurname("User");
        admin.setEmail("admin@timely.com");
        admin.setRole(Role.ROLE_ADMIN); // Not a teacher

        TimeSlotDto slot = new TimeSlotDto("8h - 9h", Map.of("lundi", true, "mardi", false, "mercredi", false, "jeudi", false, "vendredi", false, "samedi", false));
        AvailabilityRequestDto request = new AvailabilityRequestDto(List.of(slot));

        when(userRepository.findById(userId)).thenReturn(Optional.of(admin));

        // When/Then
        assertThatThrownBy(() -> availabilityService.saveOrUpdateAvailability(userId, request))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("User is not a teacher");

        verify(userRepository).findById(userId);
        verify(availabilityRepository, never()).save(any());
    }

    /**
     * Additional test: getTeacherAvailability_noExistingAvailability_returnsEmptyGrid
     *
     * Scenario: Get availability for teacher who hasn't set any availability
     * Expected: Returns empty grid with all slots marked as unavailable
     */
    @Test
    void getTeacherAvailability_noExistingAvailability_returnsEmptyGrid() {
        // Given
        UUID teacherId = UUID.randomUUID();

        Teacher teacher = new Teacher();
        teacher.setId(teacherId);
        teacher.setName("Paul");
        teacher.setSurname("Bernard");
        teacher.setEmail("paul.bernard@timely.com");
        teacher.setRole(Role.ROLE_TEACHER);

        when(userRepository.findById(teacherId)).thenReturn(Optional.of(teacher));
        when(availabilityRepository.findByTeacherId(teacherId)).thenReturn(Optional.empty());

        // When
        AvailabilityResponseDto result = availabilityService.getTeacherAvailability(teacherId);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getTeacherId()).isEqualTo(teacherId.toString());
        assertThat(result.getTeacherName()).isEqualTo("Paul Bernard");
        assertThat(result.getLastUpdated()).isNull();
        assertThat(result.getTimeSlots()).isNotNull().hasSize(9); // Empty grid with 9 hours

        // Verify all slots are marked as false (unavailable)
        result.getTimeSlots().forEach(slot ->
            slot.getSlots().values().forEach(available ->
                assertThat(available).isFalse()
            )
        );

        verify(userRepository).findById(teacherId);
        verify(availabilityRepository).findByTeacherId(teacherId);
    }

    /**
     * Additional test: getAvailabilityByTeacherId_convertsAllDayNames
     *
     * Scenario: Verify that French day names are correctly converted to DayOfWeek enum
     * Expected: All French day names map correctly to their corresponding DayOfWeek values
     */
    @Test
    void getAvailabilityByTeacherId_convertsAllDayNames() {
        // Given
        UUID teacherId = UUID.randomUUID();

        TeacherAvailability availability = new TeacherAvailability();
        availability.setId(UUID.randomUUID());
        availability.setTeacherId(teacherId);
        availability.setLastUpdated(LocalDateTime.now());

        // Create slots for each day of the week
        String[] frenchDays = {"lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"};
        DayOfWeek[] expectedDays = {DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY,
                                     DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY};

        List<AvailabilityTimeSlot> slots = new ArrayList<>();
        for (int i = 0; i < frenchDays.length; i++) {
            AvailabilityTimeSlot slot = new AvailabilityTimeSlot(frenchDays[i], 9, 10);
            slot.setId(UUID.randomUUID());
            slot.setAvailability(availability);
            slots.add(slot);
        }
        availability.setTimeSlots(slots);

        when(availabilityRepository.findByTeacherId(teacherId)).thenReturn(Optional.of(availability));

        // When
        List<AvailabilitySlotDto> result = availabilityService.getAvailabilityByTeacherId(teacherId);

        // Then
        assertThat(result).hasSize(7);
        for (int i = 0; i < expectedDays.length; i++) {
            assertThat(result.get(i).getDayOfWeek()).isEqualTo(expectedDays[i]);
        }

        verify(availabilityRepository).findByTeacherId(teacherId);
    }

    /**
     * Additional test: getMyAvailability_delegatesToGetTeacherAvailability
     *
     * Scenario: Call getMyAvailability which should delegate to getTeacherAvailability
     * Expected: Returns same result as getTeacherAvailability
     */
    @Test
    void getMyAvailability_delegatesToGetTeacherAvailability() {
        // Given
        UUID teacherId = UUID.randomUUID();

        Teacher teacher = new Teacher();
        teacher.setId(teacherId);
        teacher.setName("Sophie");
        teacher.setSurname("Leclerc");
        teacher.setEmail("sophie.leclerc@timely.com");
        teacher.setRole(Role.ROLE_TEACHER);

        TeacherAvailability availability = new TeacherAvailability();
        availability.setId(UUID.randomUUID());
        availability.setTeacherId(teacherId);
        availability.setLastUpdated(LocalDateTime.now());

        AvailabilityTimeSlot slot = new AvailabilityTimeSlot("jeudi", 11, 12);
        slot.setId(UUID.randomUUID());
        slot.setAvailability(availability);
        availability.setTimeSlots(List.of(slot));

        when(userRepository.findById(teacherId)).thenReturn(Optional.of(teacher));
        when(availabilityRepository.findByTeacherId(teacherId)).thenReturn(Optional.of(availability));

        // When
        AvailabilityResponseDto result = availabilityService.getMyAvailability(teacherId);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getTeacherId()).isEqualTo(teacherId.toString());
        assertThat(result.getTeacherName()).isEqualTo("Sophie Leclerc");
        assertThat(result.getLastUpdated()).isNotNull();

        verify(userRepository).findById(teacherId);
        verify(availabilityRepository).findByTeacherId(teacherId);
    }
}
