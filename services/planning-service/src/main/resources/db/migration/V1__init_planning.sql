-- Planning Service Database Schema
-- Tables: emplois_du_temps, creneaux, conflits

-- Table: emplois_du_temps
CREATE TABLE emplois_du_temps (
    id UUID PRIMARY KEY,
    ecole_id UUID NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    periode VARCHAR(50) NOT NULL CHECK (periode IN ('SEMAINE', 'MOIS', 'TRIMESTRE', 'SEMESTRE')),
    statut VARCHAR(50) NOT NULL CHECK (statut IN ('BROUILLON', 'VALIDE', 'PUBLIE')),
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_publication TIMESTAMP,
    utilisateur_validation VARCHAR(255),
    notes TEXT,
    CONSTRAINT check_dates CHECK (date_fin >= date_debut)
);

-- Table: creneaux
CREATE TABLE creneaux (
    id UUID PRIMARY KEY,
    emploi_id UUID NOT NULL,
    jour_semaine VARCHAR(20) NOT NULL CHECK (jour_semaine IN ('LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE')),
    heure_debut TIME NOT NULL,
    heure_fin TIME NOT NULL,
    date_creneau DATE,
    type_recurrence VARCHAR(50) NOT NULL CHECK (type_recurrence IN ('UNIQUE', 'HEBDOMADAIRE')),
    statut_creneau VARCHAR(50) NOT NULL CHECK (statut_creneau IN ('ACTIF', 'ANNULE', 'REPORTE')),
    reservation_id UUID,
    enseignant_id UUID,
    salle_id UUID,
    groupe_id UUID,
    cours_id UUID,
    CONSTRAINT fk_emploi FOREIGN KEY (emploi_id) REFERENCES emplois_du_temps(id) ON DELETE CASCADE,
    CONSTRAINT check_heures CHECK (heure_fin > heure_debut)
);

-- Table: conflits
CREATE TABLE conflits (
    id UUID PRIMARY KEY,
    emploi_id UUID NOT NULL,
    type_conflit VARCHAR(100) NOT NULL CHECK (type_conflit IN ('ENSEIGNANT_OCCUPE', 'SALLE_OCCUPEE', 'GROUPE_OCCUPE', 'CAPACITE_INSUFFISANTE', 'EQUIPEMENTS_MANQUANTS', 'CHEVAUCHEMENT_DISPONIBILITE')),
    description TEXT NOT NULL,
    severite VARCHAR(50) NOT NULL CHECK (severite IN ('CRITIQUE', 'MAJEURE', 'MINEURE')),
    suggestion_resolution JSONB,
    statut_resolution VARCHAR(50) NOT NULL CHECK (statut_resolution IN ('NON_RESOLU', 'EN_COURS', 'RESOLU')),
    date_detection TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_resolution TIMESTAMP,
    reservation1_id UUID,
    reservation2_id UUID,
    CONSTRAINT fk_emploi_conflit FOREIGN KEY (emploi_id) REFERENCES emplois_du_temps(id) ON DELETE CASCADE
);

-- Indexes pour optimisation des requêtes
CREATE INDEX idx_emploi_ecole ON emplois_du_temps(ecole_id);
CREATE INDEX idx_emploi_dates ON emplois_du_temps(date_debut, date_fin);
CREATE INDEX idx_emploi_statut ON emplois_du_temps(statut);

CREATE INDEX idx_creneau_emploi ON creneaux(emploi_id);
CREATE INDEX idx_creneau_date ON creneaux(date_creneau);
CREATE INDEX idx_creneau_jour ON creneaux(jour_semaine);
CREATE INDEX idx_creneau_enseignant ON creneaux(enseignant_id);
CREATE INDEX idx_creneau_salle ON creneaux(salle_id);
CREATE INDEX idx_creneau_groupe ON creneaux(groupe_id);
CREATE INDEX idx_creneau_cours ON creneaux(cours_id);

CREATE INDEX idx_conflit_emploi ON conflits(emploi_id);
CREATE INDEX idx_conflit_statut ON conflits(statut_resolution);
CREATE INDEX idx_conflit_type ON conflits(type_conflit);
CREATE INDEX idx_conflit_severite ON conflits(severite);
