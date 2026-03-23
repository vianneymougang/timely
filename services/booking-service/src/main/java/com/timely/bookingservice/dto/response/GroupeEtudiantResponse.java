package com.timely.bookingservice.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import com.timely.bookingservice.entity.enums.TypeGroupe;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GroupeEtudiantResponse {

    private UUID id;
    private UUID coursId;
    private String coursIntitule;
    private Integer numeroGroupe;
    private Integer effectif;
    private TypeGroupe typeGroupe;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}
