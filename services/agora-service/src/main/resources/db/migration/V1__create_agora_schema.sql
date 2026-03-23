-- Table exports_agora
CREATE TABLE exports_agora (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    emploi_du_temps_id UUID NOT NULL,
    date_export TIMESTAMP NOT NULL,
    format VARCHAR(20) NOT NULL,
    statut VARCHAR(20) NOT NULL,
    numero_tentative INTEGER NOT NULL DEFAULT 0,
    message_erreur TEXT,
    reponse_agora JSONB,
    date_derniere_tentative TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table mapping_entites
CREATE TABLE mapping_entites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entite_locale_type VARCHAR(50) NOT NULL,
    entite_locale_id UUID NOT NULL,
    entite_agora_id VARCHAR(100) NOT NULL,
    type_mapping VARCHAR(50),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(entite_locale_type, entite_locale_id)
);

-- Table logs_integration
CREATE TABLE logs_integration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    export_agora_id UUID NOT NULL,
    type_log VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    stack_trace TEXT,
    FOREIGN KEY (export_agora_id) REFERENCES exports_agora(id) ON DELETE CASCADE
);

-- Index pour recherche rapide
CREATE INDEX idx_exports_agora_statut ON exports_agora(statut);
CREATE INDEX idx_exports_agora_date ON exports_agora(date_export);
CREATE INDEX idx_mapping_locale ON mapping_entites(entite_locale_type, entite_locale_id);
CREATE INDEX idx_logs_export ON logs_integration(export_agora_id);
