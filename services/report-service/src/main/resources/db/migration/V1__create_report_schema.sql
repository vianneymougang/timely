-- Create extension for UUID support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE type_rapport AS ENUM ('UTILISATION_SALLES', 'CHARGE_ENSEIGNANTS', 'CONFLITS', 'REPARTITION_COURS', 'EVENEMENTS', 'AUDIT');
CREATE TYPE format_export AS ENUM ('PDF', 'EXCEL', 'CSV');
CREATE TYPE statut_export AS ENUM ('EN_COURS', 'TERMINE', 'ECHOUE');

-- Table: rapports
CREATE TABLE rapports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type_rapport type_rapport NOT NULL,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    date_generation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_debut DATE,
    date_fin DATE,
    ecole_id UUID,
    format format_export NOT NULL,
    chemin_fichier VARCHAR(500),
    utilisateur_createur VARCHAR(255) NOT NULL,
    parametres_rapport JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: kpi_historique
CREATE TABLE kpi_historique (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    nom_kpi VARCHAR(100) NOT NULL,
    valeur DECIMAL(15, 2) NOT NULL,
    unite VARCHAR(50),
    periode VARCHAR(50),
    detail_json JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: exports
CREATE TABLE exports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rapport_id UUID NOT NULL REFERENCES rapports(id) ON DELETE CASCADE,
    format format_export NOT NULL,
    date_export TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    utilisateur VARCHAR(255) NOT NULL,
    chemin_fichier VARCHAR(500) NOT NULL,
    statut statut_export NOT NULL DEFAULT 'EN_COURS',
    message_erreur TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_rapports_type ON rapports(type_rapport);
CREATE INDEX idx_rapports_ecole ON rapports(ecole_id);
CREATE INDEX idx_rapports_date ON rapports(date_generation);
CREATE INDEX idx_rapports_utilisateur ON rapports(utilisateur_createur);

CREATE INDEX idx_kpi_date ON kpi_historique(date);
CREATE INDEX idx_kpi_nom ON kpi_historique(nom_kpi);

CREATE INDEX idx_exports_rapport ON exports(rapport_id);
CREATE INDEX idx_exports_statut ON exports(statut);
CREATE INDEX idx_exports_date ON exports(date_export);

-- Comments
COMMENT ON TABLE rapports IS 'Stocke les rapports générés avec leurs métadonnées';
COMMENT ON TABLE kpi_historique IS 'Historique des KPIs calculés pour le tableau de bord';
COMMENT ON TABLE exports IS 'Historique des exports de rapports dans différents formats';
