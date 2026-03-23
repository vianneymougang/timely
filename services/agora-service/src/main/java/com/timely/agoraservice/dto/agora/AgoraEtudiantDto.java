package com.timely.agoraservice.dto.agora;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO représentant un étudiant dans le système Agora externe.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgoraEtudiantDto {

    /**
     * ID Agora de l'étudiant.
     */
    private String agoraId;

    /**
     * Matricule unique de l'étudiant.
     */
    private String matricule;

    /**
     * Nom de l'étudiant.
     */
    private String nom;

    /**
     * Prénom de l'étudiant.
     */
    private String prenom;

    /**
     * Email de l'étudiant.
     */
    private String email;

    /**
     * ID Agora de la classe.
     */
    private String agoraClasseId;

    /**
     * Nom de la classe.
     */
    private String nomClasse;

    /**
     * Année académique.
     */
    private String anneeAcademique;

    /**
     * Téléphone (optionnel).
     */
    private String telephone;

    /**
     * Date de naissance (optionnel).
     */
    private String dateNaissance;

    /**
     * Genre (optionnel: M, F, AUTRE).
     */
    private String genre;
}
