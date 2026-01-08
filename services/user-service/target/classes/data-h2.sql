-- Données d'initialisation pour H2 - User Service

-- Profils des administrateurs
INSERT INTO users (id, name, surname, email, telephone_number, role, status, creation_date) VALUES
('admin-001', 'Admin', 'Principal', 'admin@timely.com', '+33 1 23 45 67 89', 'ROLE_ADMIN', 'ACTIVE', CURRENT_TIMESTAMP),
('admin-002', 'Sarah', 'Dubois', 'admin.rh@timely.com', '+33 1 23 45 67 90', 'ROLE_ADMIN', 'ACTIVE', CURRENT_TIMESTAMP),
('admin-003', 'Thomas', 'Leclerc', 'admin.tech@timely.com', '+33 1 23 45 67 91', 'ROLE_ADMIN', 'ACTIVE', CURRENT_TIMESTAMP),
('admin-004', 'Catherine', 'Rousseau', 'directeur@timely.com', '+33 1 23 45 67 92', 'ROLE_ADMIN', 'ACTIVE', CURRENT_TIMESTAMP);

-- Profils des enseignants
INSERT INTO users (id, name, surname, email, telephone_number, role, status, creation_date) VALUES
('teacher-001', 'Marie', 'Martin', 'marie.martin@timely.com', '+33 1 98 76 54 32', 'ROLE_TEACHER', 'ACTIVE', CURRENT_TIMESTAMP),
('teacher-002', 'Jean', 'Dupont', 'jean.dupont@timely.com', '+33 1 98 76 54 33', 'ROLE_TEACHER', 'ACTIVE', CURRENT_TIMESTAMP),
('teacher-003', 'Sophie', 'Leroy', 'sophie.leroy@timely.com', '+33 1 98 76 54 34', 'ROLE_TEACHER', 'ACTIVE', CURRENT_TIMESTAMP),
('teacher-004', 'Pierre', 'Bernard', 'pierre.bernard@timely.com', '+33 1 98 76 54 35', 'ROLE_TEACHER', 'ACTIVE', CURRENT_TIMESTAMP),
('teacher-005', 'Claire', 'Moreau', 'claire.moreau@timely.com', '+33 1 98 76 54 36', 'ROLE_TEACHER', 'ACTIVE', CURRENT_TIMESTAMP),
('teacher-006', 'Laurent', 'Simon', 'laurent.simon@timely.com', '+33 1 98 76 54 37', 'ROLE_TEACHER', 'ACTIVE', CURRENT_TIMESTAMP),
('teacher-007', 'Isabelle', 'Michel', 'isabelle.michel@timely.com', '+33 1 98 76 54 38', 'ROLE_TEACHER', 'ACTIVE', CURRENT_TIMESTAMP),
('teacher-008', 'François', 'Garcia', 'francois.garcia@timely.com', '+33 1 98 76 54 39', 'ROLE_TEACHER', 'ACTIVE', CURRENT_TIMESTAMP),
('teacher-009', 'Nathalie', 'Roux', 'nathalie.roux@timely.com', '+33 1 98 76 54 40', 'ROLE_TEACHER', 'BLOCKED', CURRENT_TIMESTAMP),
('teacher-010', 'David', 'Fournier', 'david.fournier@timely.com', '+33 1 98 76 54 41', 'ROLE_TEACHER', 'ACTIVE', CURRENT_TIMESTAMP);

-- Profils des utilisateurs standards
INSERT INTO users (id, name, surname, email, telephone_number, role, status, creation_date) VALUES
('user-001', 'Lucas', 'Petit', 'etudiant1@timely.com', '+33 6 12 34 56 78', 'ROLE_USER', 'ACTIVE', CURRENT_TIMESTAMP),
('user-002', 'Emma', 'Robert', 'etudiant2@timely.com', '+33 6 12 34 56 79', 'ROLE_USER', 'ACTIVE', CURRENT_TIMESTAMP),
('user-003', 'Antoine', 'Richard', 'personnel1@timely.com', '+33 6 12 34 56 80', 'ROLE_USER', 'BLOCKED', CURRENT_TIMESTAMP);

-- Insertion des profils administrateurs avec informations spécifiques
INSERT INTO admins (user_id, access_level, department) VALUES
('admin-001', 4, 1),
('admin-002', 3, 2),
('admin-003', 3, 3),
('admin-004', 4, 4);

-- Insertion des profils enseignants avec informations spécifiques
INSERT INTO teachers (user_id, matricule, grade, rank, hourly_rate) VALUES
('teacher-001', 'T2024001', 'Professeur', 'Classe exceptionnelle', 45.50),
('teacher-002', 'T2024002', 'Maître de conférences', 'Hors classe', 42.00),
('teacher-003', 'T2024003', 'Professeur agrégé', 'Classe normale', 38.50),
('teacher-004', 'T2024004', 'Professeur certifié', 'Classe normale', 35.00),
('teacher-005', 'T2024005', 'Chargé de cours', 'Vacataire', 30.00),
('teacher-006', 'T2024006', 'Professeur', 'Classe normale', 40.00),
('teacher-007', 'T2024007', 'Maître de conférences', 'Classe normale', 39.00),
('teacher-008', 'T2024008', 'Professeur agrégé', 'Hors classe', 41.50),
('teacher-009', 'T2024009', 'Professeur certifié', 'Hors classe', 37.00),
('teacher-010', 'T2024010', 'Chargé de cours', 'Contractuel', 32.50);