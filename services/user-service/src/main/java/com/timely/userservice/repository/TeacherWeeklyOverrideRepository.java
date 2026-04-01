package com.timely.userservice.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.timely.userservice.model.TeacherWeeklyOverride;

@Repository
public interface TeacherWeeklyOverrideRepository extends JpaRepository<TeacherWeeklyOverride, UUID> {

    List<TeacherWeeklyOverride> findByTeacherIdAndWeekStart(UUID teacherId, LocalDate weekStart);

    void deleteByTeacherIdAndWeekStart(UUID teacherId, LocalDate weekStart);
}
