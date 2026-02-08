package com.timely.bookingservice.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.timely.bookingservice.entity.Etudiant;

public interface EtudiantRepository extends JpaRepository<Etudiant, UUID> {

    List<Etudiant> findByClasseId(UUID classeId);

    Optional<Etudiant> findByMatricule(String matricule);

    boolean existsByMatricule(String matricule);
}
