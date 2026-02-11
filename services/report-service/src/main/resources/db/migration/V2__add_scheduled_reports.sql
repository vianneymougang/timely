-- Migration V2: Ajout de la table scheduled_reports pour la planification automatique de rapports

CREATE TABLE IF NOT EXISTS scheduled_reports (
    id UUID PRIMARY KEY,
    type_rapport VARCHAR(50) NOT NULL,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    cron_expression VARCHAR(100) NOT NULL,
    ecole_id UUID,
    format VARCHAR(20) NOT NULL,
    destinataires_email VARCHAR(1000) NOT NULL,
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    utilisateur_createur VARCHAR(255) NOT NULL,
    parametres_rapport JSONB,
    derniere_execution TIMESTAMP,
    prochaine_execution TIMESTAMP,
    nombre_executions INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances des recherches
CREATE INDEX idx_scheduled_reports_actif ON scheduled_reports(actif);
CREATE INDEX idx_scheduled_reports_ecole_id ON scheduled_reports(ecole_id);
CREATE INDEX idx_scheduled_reports_type_rapport ON scheduled_reports(type_rapport);
CREATE INDEX idx_scheduled_reports_utilisateur_createur ON scheduled_reports(utilisateur_createur);
CREATE INDEX idx_scheduled_reports_prochaine_execution ON scheduled_reports(prochaine_execution);

-- Commentaires sur la table et les colonnes
COMMENT ON TABLE scheduled_reports IS 'Rapports planifiés pour exécution automatique récurrente';
COMMENT ON COLUMN scheduled_reports.cron_expression IS 'Expression cron définissant la périodicité (ex: 0 0 9 * * MON pour tous les lundis à 9h)';
COMMENT ON COLUMN scheduled_reports.destinataires_email IS 'Liste des emails destinataires séparés par des virgules';
COMMENT ON COLUMN scheduled_reports.actif IS 'Indique si le rapport planifié est actif et doit être exécuté';
COMMENT ON COLUMN scheduled_reports.derniere_execution IS 'Date et heure de la dernière exécution du rapport';
COMMENT ON COLUMN scheduled_reports.prochaine_execution IS 'Date et heure calculée pour la prochaine exécution';
COMMENT ON COLUMN scheduled_reports.nombre_executions IS 'Nombre total d''exécutions depuis la création';
