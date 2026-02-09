package com.timely.reportservice.repository;

import com.timely.reportservice.entity.KPIHistorique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface KPIHistoriqueRepository extends JpaRepository<KPIHistorique, UUID> {
    List<KPIHistorique> findByNomKpi(String nomKpi);
    List<KPIHistorique> findByDate(LocalDate date);
    List<KPIHistorique> findByDateBetween(LocalDate dateDebut, LocalDate dateFin);
    List<KPIHistorique> findByNomKpiAndDateBetween(String nomKpi, LocalDate dateDebut, LocalDate dateFin);
}
