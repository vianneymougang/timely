package com.timely.bookingservice.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.timely.bookingservice.entity.UE;

public interface UERepository extends JpaRepository<UE, UUID> {

    List<UE> findByFiliereId(UUID filiereId);

    Optional<UE> findByCode(String code);

    boolean existsByCode(String code);
}
