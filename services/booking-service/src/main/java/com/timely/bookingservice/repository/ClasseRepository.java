package com.timely.bookingservice.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.timely.bookingservice.entity.Classe;

public interface ClasseRepository extends JpaRepository<Classe, UUID> {

    List<Classe> findByFiliereId(UUID filiereId);

    Optional<Classe> findByCode(String code);

    boolean existsByCode(String code);
}
