package com.timely.bookingservice.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.timely.bookingservice.entity.Ecole;

public interface EcoleRepository extends JpaRepository<Ecole, UUID> {

    Optional<Ecole> findByCode(String code);

    boolean existsByCode(String code);
}
