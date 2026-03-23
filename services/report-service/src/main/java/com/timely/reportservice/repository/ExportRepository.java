package com.timely.reportservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.timely.reportservice.entity.Export;
import com.timely.reportservice.entity.enums.StatutExport;

@Repository
public interface ExportRepository extends JpaRepository<Export, UUID> {

    List<Export> findByRapportId(UUID rapportId);

    List<Export> findByStatut(StatutExport statut);

    List<Export> findByUtilisateur(String utilisateur);
}
