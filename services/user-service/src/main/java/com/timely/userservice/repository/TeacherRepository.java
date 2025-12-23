package com.timely.userservice.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.timely.userservice.model.Teacher;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, UUID> {
    Optional<Teacher> findByMatricule(String matricule);
    boolean existsByMatricule(String matricule);
}
