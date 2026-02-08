package com.timely.bookingservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.timely.bookingservice.entity.GroupeEtudiant;

public interface GroupeEtudiantRepository extends JpaRepository<GroupeEtudiant, UUID> {

    List<GroupeEtudiant> findByCoursId(UUID coursId);
}
