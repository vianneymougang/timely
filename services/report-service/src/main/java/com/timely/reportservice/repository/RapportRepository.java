package com.timely.reportservice.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.timely.reportservice.entity.Rapport;
import com.timely.reportservice.entity.enums.TypeRapport;

@Repository
public interface RapportRepository extends JpaRepository<Rapport, UUID> {

    List<Rapport> findByTypeRapport(TypeRapport typeRapport);

    List<Rapport> findByEcoleId(UUID ecoleId);

    List<Rapport> findByUtilisateurCreateur(String utilisateurCreateur);

    List<Rapport> findByDateGenerationBetween(LocalDateTime dateDebut, LocalDateTime dateFin);
}
