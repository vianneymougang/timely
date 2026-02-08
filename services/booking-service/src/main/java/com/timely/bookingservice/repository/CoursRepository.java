package com.timely.bookingservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.timely.bookingservice.entity.Cours;

public interface CoursRepository extends JpaRepository<Cours, UUID> {

    List<Cours> findByUeId(UUID ueId);

    List<Cours> findByClasseId(UUID classeId);

    List<Cours> findByEnseignantId(UUID enseignantId);
}
