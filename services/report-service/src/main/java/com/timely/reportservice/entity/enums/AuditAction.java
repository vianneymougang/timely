package com.timely.reportservice.entity.enums;

/**
 * Types d'actions d'audit possibles.
 */
public enum AuditAction {
    /**
     * Création d'une nouvelle entité.
     */
    CREATE,

    /**
     * Mise à jour d'une entité existante.
     */
    UPDATE,

    /**
     * Suppression d'une entité.
     */
    DELETE,

    /**
     * Publication d'un emploi du temps (action métier spécifique).
     */
    PUBLISH,

    /**
     * Validation d'un emploi du temps (action métier spécifique).
     */
    VALIDATE,

    /**
     * Export de données (action métier spécifique).
     */
    EXPORT
}
