ALTER TABLE emplois_du_temps DROP CONSTRAINT IF EXISTS emplois_du_temps_statut_check;
UPDATE emplois_du_temps SET statut = 'DRAFT' WHERE statut = 'BROUILLON';
UPDATE emplois_du_temps SET statut = 'VALIDATED' WHERE statut = 'VALIDE';
UPDATE emplois_du_temps SET statut = 'PUBLISHED' WHERE statut = 'PUBLIE';
ALTER TABLE emplois_du_temps ADD CONSTRAINT emplois_du_temps_statut_check
    CHECK (statut IN ('DRAFT', 'VALIDATED', 'PUBLISHED', 'ARCHIVED'));

ALTER TABLE creneaux DROP CONSTRAINT IF EXISTS creneaux_statut_creneau_check;
UPDATE creneaux SET statut_creneau = 'RESERVE' WHERE statut_creneau = 'ACTIF';
UPDATE creneaux SET statut_creneau = 'ANNULE' WHERE statut_creneau = 'REPORTE';
ALTER TABLE creneaux ADD CONSTRAINT creneaux_statut_creneau_check
    CHECK (statut_creneau IN ('DISPONIBLE', 'RESERVE', 'CONFIRME', 'ANNULE'));

ALTER TABLE conflits DROP CONSTRAINT IF EXISTS conflits_type_conflit_check;
UPDATE conflits SET type_conflit = 'ENSEIGNANT' WHERE type_conflit = 'ENSEIGNANT_OCCUPE';
UPDATE conflits SET type_conflit = 'SALLE' WHERE type_conflit = 'SALLE_OCCUPEE';
UPDATE conflits SET type_conflit = 'GROUPE' WHERE type_conflit = 'GROUPE_OCCUPE';
UPDATE conflits SET type_conflit = 'HORAIRE' WHERE type_conflit IN ('CAPACITE_INSUFFISANTE', 'EQUIPEMENTS_MANQUANTS', 'CHEVAUCHEMENT_DISPONIBILITE');
ALTER TABLE conflits ADD CONSTRAINT conflits_type_conflit_check
    CHECK (type_conflit IN ('ENSEIGNANT', 'SALLE', 'GROUPE', 'HORAIRE'));

ALTER TABLE conflits DROP CONSTRAINT IF EXISTS conflits_severite_check;
UPDATE conflits SET severite = 'MOYENNE' WHERE severite = 'MAJEURE';
ALTER TABLE conflits ADD CONSTRAINT conflits_severite_check
    CHECK (severite IN ('CRITIQUE', 'MOYENNE', 'MINEURE'));

ALTER TABLE conflits DROP CONSTRAINT IF EXISTS conflits_statut_resolution_check;
ALTER TABLE conflits ADD CONSTRAINT conflits_statut_resolution_check
    CHECK (statut_resolution IN ('NON_RESOLU', 'EN_COURS', 'RESOLU', 'IGNORE'));

ALTER TABLE creneaux DROP CONSTRAINT IF EXISTS creneaux_jour_semaine_check;
ALTER TABLE creneaux ADD CONSTRAINT creneaux_jour_semaine_check
    CHECK (jour_semaine IN ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'));
