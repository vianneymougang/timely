-- Migration V3: Création de la table audit trail (historique_modifications)

CREATE TABLE IF NOT EXISTS historique_modifications (
    id UUID PRIMARY KEY,
    action_type VARCHAR(20) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    entity_class_name VARCHAR(255),
    utilisateur VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP NOT NULL,
    valeur_avant JSONB,
    valeur_apres JSONB,
    changements JSONB,
    metadata JSONB,
    source_service VARCHAR(100),
    source_method VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances des recherches
CREATE INDEX idx_audit_entity ON historique_modifications(entity_type, entity_id);
CREATE INDEX idx_audit_action ON historique_modifications(action_type);
CREATE INDEX idx_audit_utilisateur ON historique_modifications(utilisateur);
CREATE INDEX idx_audit_timestamp ON historique_modifications(timestamp DESC);
CREATE INDEX idx_audit_source_service ON historique_modifications(source_service);
CREATE INDEX idx_audit_entity_type ON historique_modifications(entity_type);

-- Index composite pour les requêtes fréquentes
CREATE INDEX idx_audit_type_timestamp ON historique_modifications(entity_type, timestamp DESC);
CREATE INDEX idx_audit_user_timestamp ON historique_modifications(utilisateur, timestamp DESC);

-- Commentaires sur la table et les colonnes
COMMENT ON TABLE historique_modifications IS 'Audit trail - traçabilité de toutes les actions critiques (CREATE, UPDATE, DELETE)';
COMMENT ON COLUMN historique_modifications.action_type IS 'Type d''action: CREATE, UPDATE, DELETE, PUBLISH, VALIDATE, EXPORT';
COMMENT ON COLUMN historique_modifications.entity_type IS 'Type d''entité modifiée (ex: EmploiDuTemps, Cours, Salle)';
COMMENT ON COLUMN historique_modifications.entity_id IS 'ID de l''entité modifiée';
COMMENT ON COLUMN historique_modifications.utilisateur IS 'Email de l''utilisateur qui a effectué l''action';
COMMENT ON COLUMN historique_modifications.valeur_avant IS 'Valeur de l''entité AVANT modification (JSON) - null pour CREATE';
COMMENT ON COLUMN historique_modifications.valeur_apres IS 'Valeur de l''entité APRÈS modification (JSON) - null pour DELETE';
COMMENT ON COLUMN historique_modifications.changements IS 'Détail des champs modifiés avec anciennes et nouvelles valeurs (JSON)';
COMMENT ON COLUMN historique_modifications.source_service IS 'Service d''origine de l''action (ex: planning-service)';
COMMENT ON COLUMN historique_modifications.source_method IS 'Méthode/endpoint qui a déclenché l''action';
