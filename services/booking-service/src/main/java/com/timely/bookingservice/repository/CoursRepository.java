package com.timely.bookingservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.timely.bookingservice.entity.Cours;

public interface CoursRepository extends JpaRepository<Cours, UUID> {

    List<Cours> findByUeId(UUID ueId);

    Page<Cours> findByUeId(UUID ueId, Pageable pageable);

    List<Cours> findByClasseId(UUID classeId);

    Page<Cours> findByClasseId(UUID classeId, Pageable pageable);

    List<Cours> findByEnseignantId(UUID enseignantId);

    Page<Cours> findByEnseignantId(UUID enseignantId, Pageable pageable);
}
