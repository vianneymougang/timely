package com.timely.bookingservice.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.timely.bookingservice.entity.Equipement;

public interface EquipementRepository extends JpaRepository<Equipement, UUID> {

    Optional<Equipement> findByCode(String code);

    boolean existsByCode(String code);
}
