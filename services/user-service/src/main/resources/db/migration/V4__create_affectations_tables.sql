-- V4: Create teacher assignment tables (intervenir_ecole and enseigner)

-- Table for teacher-school assignments (IntervenirEcole)
CREATE TABLE intervenir_ecole (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enseignant_id UUID NOT NULL,
    ecole_id UUID NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key to users table (teacher)
    CONSTRAINT fk_intervenir_ecole_enseignant FOREIGN KEY (enseignant_id)
        REFERENCES users(id) ON DELETE CASCADE,

    -- Unique constraint: one teacher can't be assigned twice to same school with overlapping dates
    CONSTRAINT uk_enseignant_ecole UNIQUE (enseignant_id, ecole_id)
);

-- Table for teacher-course assignments (Enseigner)
CREATE TABLE enseigner (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enseignant_id UUID NOT NULL,
    cours_id UUID NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key to users table (teacher)
    CONSTRAINT fk_enseigner_enseignant FOREIGN KEY (enseignant_id)
        REFERENCES users(id) ON DELETE CASCADE,

    -- Note: cours_id is external reference to booking-service, no FK constraint
    -- Unique constraint: one teacher can't be assigned twice to same course
    CONSTRAINT uk_enseignant_cours UNIQUE (enseignant_id, cours_id)
);

-- Indexes for performance
CREATE INDEX idx_intervenir_ecole_enseignant ON intervenir_ecole(enseignant_id);
CREATE INDEX idx_intervenir_ecole_ecole ON intervenir_ecole(ecole_id);
CREATE INDEX idx_enseigner_enseignant ON enseigner(enseignant_id);
CREATE INDEX idx_enseigner_cours ON enseigner(cours_id);
