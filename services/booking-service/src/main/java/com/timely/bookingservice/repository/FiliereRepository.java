package com.timely.bookingservice.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.timely.bookingservice.entity.Filiere;

public interface FiliereRepository extends JpaRepository<Filiere, UUID> {

    List<Filiere> findByEcoleId(UUID ecoleId);

    Optional<Filiere> findByCode(String code);

    boolean existsByCode(String code);
}
