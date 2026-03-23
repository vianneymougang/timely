package com.timely.planningservice.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.timely.planningservice.entity.enums.PeriodeEmploi;
import com.timely.planningservice.entity.enums.StatutEmploi;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmploiDuTempsResponseDTO {

    private UUID id;
    private UUID ecoleId;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private PeriodeEmploi periode;
    private StatutEmploi statut;
    private LocalDateTime dateCreation;
    private LocalDateTime datePublication;
    private String utilisateurValidation;
    private String notes;
    private List<CreneauResponseDTO> creneaux;
    private List<ConflitResponseDTO> conflits;
}
