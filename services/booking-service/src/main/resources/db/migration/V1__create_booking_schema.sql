-- =============================================
-- Booking Service - Schema Initial
-- =============================================

-- 1. Ecoles
CREATE TABLE ecoles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    adresse VARCHAR(500),
    telephone VARCHAR(20),
    email VARCHAR(255),
    contact_responsable VARCHAR(255),
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP
);

-- 2. Filieres
CREATE TABLE filieres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ecole_id UUID NOT NULL,
    nom VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP,
    CONSTRAINT fk_filiere_ecole FOREIGN KEY (ecole_id) REFERENCES ecoles(id) ON DELETE CASCADE
);

-- 3. Classes
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filiere_id UUID NOT NULL,
    niveau VARCHAR(10) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    effectif INTEGER NOT NULL DEFAULT 0,
    annee_academique VARCHAR(20) NOT NULL,
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP,
    CONSTRAINT fk_classe_filiere FOREIGN KEY (filiere_id) REFERENCES filieres(id) ON DELETE CASCADE
);

-- 4. Etudiants
CREATE TABLE etudiants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classe_id UUID NOT NULL,
    matricule VARCHAR(50) NOT NULL UNIQUE,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telephone VARCHAR(20),
    date_inscription DATE,
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP,
    CONSTRAINT fk_etudiant_classe FOREIGN KEY (classe_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- 5. Unites d'enseignement
CREATE TABLE unites_enseignement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filiere_id UUID NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    intitule VARCHAR(255) NOT NULL,
    credit_ects INTEGER NOT NULL,
    volume_horaire_total INTEGER NOT NULL,
    description TEXT,
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP,
    CONSTRAINT fk_ue_filiere FOREIGN KEY (filiere_id) REFERENCES filieres(id) ON DELETE CASCADE
);

-- 6. Cours
CREATE TABLE cours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ue_id UUID NOT NULL,
    classe_id UUID NOT NULL,
    enseignant_id UUID,
    intitule VARCHAR(255) NOT NULL,
    type_cours VARCHAR(10) NOT NULL,
    volume_horaire INTEGER NOT NULL,
    effectif_groupe INTEGER,
    description TEXT,
    statut VARCHAR(20) NOT NULL DEFAULT 'ACTIF',
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP,
    CONSTRAINT fk_cours_ue FOREIGN KEY (ue_id) REFERENCES unites_enseignement(id) ON DELETE CASCADE,
    CONSTRAINT fk_cours_classe FOREIGN KEY (classe_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- 7. Salles
CREATE TABLE salles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ecole_id UUID NOT NULL,
    numero VARCHAR(50) NOT NULL,
    nom VARCHAR(255),
    type_salle VARCHAR(30) NOT NULL,
    capacite INTEGER NOT NULL,
    superficie_m2 DOUBLE PRECISION,
    batiment VARCHAR(100),
    etage VARCHAR(20),
    statut VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP,
    CONSTRAINT fk_salle_ecole FOREIGN KEY (ecole_id) REFERENCES ecoles(id) ON DELETE CASCADE
);

-- 8. Equipements
CREATE TABLE equipements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    quantite_disponible INTEGER NOT NULL DEFAULT 0,
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP
);

-- 9. Table de jointure Salle-Equipement (M:N)
CREATE TABLE salle_equipement (
    salle_id UUID NOT NULL,
    equipement_id UUID NOT NULL,
    PRIMARY KEY (salle_id, equipement_id),
    CONSTRAINT fk_se_salle FOREIGN KEY (salle_id) REFERENCES salles(id) ON DELETE CASCADE,
    CONSTRAINT fk_se_equipement FOREIGN KEY (equipement_id) REFERENCES equipements(id) ON DELETE CASCADE
);

-- 10. Groupes etudiants
CREATE TABLE groupes_etudiants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cours_id UUID NOT NULL,
    numero_groupe INTEGER NOT NULL,
    effectif INTEGER NOT NULL DEFAULT 0,
    type_groupe VARCHAR(30) NOT NULL,
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP,
    CONSTRAINT fk_groupe_cours FOREIGN KEY (cours_id) REFERENCES cours(id) ON DELETE CASCADE
);

-- 11. Table de jointure GroupeEtudiant-Etudiant (M:N)
CREATE TABLE groupe_etudiant_etudiant (
    groupe_etudiant_id UUID NOT NULL,
    etudiant_id UUID NOT NULL,
    PRIMARY KEY (groupe_etudiant_id, etudiant_id),
    CONSTRAINT fk_gee_groupe FOREIGN KEY (groupe_etudiant_id) REFERENCES groupes_etudiants(id) ON DELETE CASCADE,
    CONSTRAINT fk_gee_etudiant FOREIGN KEY (etudiant_id) REFERENCES etudiants(id) ON DELETE CASCADE
);

-- 12. Reservations
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cours_id UUID NOT NULL,
    salle_id UUID NOT NULL,
    groupe_etudiant_id UUID,
    enseignant_id UUID,
    date_reservation DATE NOT NULL,
    heure_debut TIME NOT NULL,
    heure_fin TIME NOT NULL,
    jour_semaine VARCHAR(10) NOT NULL,
    recurrence VARCHAR(20) NOT NULL DEFAULT 'UNIQUE',
    statut VARCHAR(20) NOT NULL DEFAULT 'TEMPORAIRE',
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP,
    CONSTRAINT fk_reservation_cours FOREIGN KEY (cours_id) REFERENCES cours(id) ON DELETE CASCADE,
    CONSTRAINT fk_reservation_salle FOREIGN KEY (salle_id) REFERENCES salles(id) ON DELETE CASCADE,
    CONSTRAINT fk_reservation_groupe FOREIGN KEY (groupe_etudiant_id) REFERENCES groupes_etudiants(id) ON DELETE SET NULL
);

-- 13. Evenements
CREATE TABLE evenements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ecole_id UUID NOT NULL,
    type_evenement VARCHAR(30) NOT NULL,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    heure_debut TIME,
    heure_fin TIME,
    priorite INTEGER DEFAULT 0,
    statut VARCHAR(20) NOT NULL DEFAULT 'PLANIFIE',
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP,
    CONSTRAINT fk_evenement_ecole FOREIGN KEY (ecole_id) REFERENCES ecoles(id) ON DELETE CASCADE
);

-- Index pour les requetes frequentes
CREATE INDEX idx_filiere_ecole ON filieres(ecole_id);
CREATE INDEX idx_classe_filiere ON classes(filiere_id);
CREATE INDEX idx_etudiant_classe ON etudiants(classe_id);
CREATE INDEX idx_ue_filiere ON unites_enseignement(filiere_id);
CREATE INDEX idx_cours_ue ON cours(ue_id);
CREATE INDEX idx_cours_classe ON cours(classe_id);
CREATE INDEX idx_cours_enseignant ON cours(enseignant_id);
CREATE INDEX idx_salle_ecole ON salles(ecole_id);
CREATE INDEX idx_groupe_cours ON groupes_etudiants(cours_id);
CREATE INDEX idx_reservation_cours ON reservations(cours_id);
CREATE INDEX idx_reservation_salle ON reservations(salle_id);
CREATE INDEX idx_reservation_date ON reservations(date_reservation, heure_debut, heure_fin);
CREATE INDEX idx_evenement_ecole ON evenements(ecole_id);
CREATE INDEX idx_evenement_dates ON evenements(date_debut, date_fin);
