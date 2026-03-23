package com.timely.bookingservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.timely.bookingservice.entity.Evenement;

public interface EvenementRepository extends JpaRepository<Evenement, UUID> {

    List<Evenement> findByEcoleId(UUID ecoleId);
}
