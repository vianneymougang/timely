-- =============================================
-- USER SERVICE - Seed data Phase 7 (standalone)
-- Campus IUSJC - 6 enseignants
-- =============================================
-- Prerequis : executer seed-booking-service.sql avant ce script
--             (les ecoles/cours references ici viennent du booking-service)
--
-- UUID legend:
--   Enseignants    : b1111111-0000-0000-0000-00000000000X
--   Disponibilites : ca111111-0000-0000-0000-00000000000X
--   IntervenirEcole: ie111111-0000-0000-0000-00000000000X
--   Enseigner      : en111111-0000-0000-0000-00000000000X
--
-- Refs ecoles (booking-service):
--   SJI  : 11111111-1111-1111-1111-111111111101
--   SJM  : 11111111-1111-1111-1111-111111111102
--   CPGE : 11111111-1111-1111-1111-111111111103
--   PV   : 11111111-1111-1111-1111-111111111104
--
-- Refs cours (booking-service):
--   Analyse I CM CP1       : 66666666-6666-6666-6666-666666666601
--   Analyse I TD CP1       : 66666666-6666-6666-6666-666666666602
--   Algebre CM CPGE1-MPSI  : 66666666-6666-6666-6666-666666666603
--   Algo CM CI1-GI         : 66666666-6666-6666-6666-666666666604
--   Prog C TP CI1-GI       : 66666666-6666-6666-6666-666666666605
--   BDD CM CI2-GI          : 66666666-6666-6666-6666-666666666606
--   Sys Info CM L2-CF      : 66666666-6666-6666-6666-666666666607
--   Compta CM L1-CF        : 66666666-6666-6666-6666-666666666608
--   Mecanique CM CP1       : 66666666-6666-6666-6666-666666666609
--   Physique CM CPGE1-MPSI : 66666666-6666-6666-6666-66666666660a
--   Physique CM PV1-SCI    : 66666666-6666-6666-6666-66666666660b
--   Analyse I CM CP2       : 66666666-6666-6666-6666-66666666660c
--   Algebre CM CPGE2-MPSI  : 66666666-6666-6666-6666-66666666660d
--   Physique CM CPGE2-MPSI : 66666666-6666-6666-6666-66666666660e
--   Physique CM PV2-SCI    : 66666666-6666-6666-6666-66666666660f

-- =============================================
-- NETTOYAGE (preserve le compte admin)
-- La suppression des enseignants cascade vers :
--   teacher_availability, availability_time_slots,
--   intervenir_ecole, enseigner
-- =============================================
DELETE FROM users WHERE user_type = 'TEACHER';

-- =============================================
-- 1. ENSEIGNANTS
-- Mot de passe : 'password' (hash BCrypt)
-- =============================================
INSERT INTO users (id, user_type, name, surname, email, password, role, status,
                   creation_date, matricule, grade, rank, hourly_rate)
VALUES
    ('b1111111-0000-0000-0000-000000000001', 'TEACHER', 'Jean',   'Dupont',
     'j.dupont@iusjc.cd',   '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG',
     'ROLE_TEACHER', 'ACTIVE', '2024-09-01', 'ENS-101', 'Professeur',           'Mathematiques', '80000'),

    ('b1111111-0000-0000-0000-000000000002', 'TEACHER', 'Sophie', 'Martin',
     's.martin@iusjc.cd',   '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG',
     'ROLE_TEACHER', 'ACTIVE', '2024-09-01', 'ENS-102', 'Maitre de conferences', 'Informatique',  '65000'),

    ('b1111111-0000-0000-0000-000000000003', 'TEACHER', 'Pierre', 'Leclerc',
     'p.leclerc@iusjc.cd',  '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG',
     'ROLE_TEACHER', 'ACTIVE', '2024-09-01', 'ENS-103', 'Professeur',           'Finance',       '80000'),

    ('b1111111-0000-0000-0000-000000000004', 'TEACHER', 'Linh',   'Nguyen',
     'l.nguyen@iusjc.cd',   '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG',
     'ROLE_TEACHER', 'ACTIVE', '2024-09-01', 'ENS-104', 'Charge de cours',      'Genie Civil',   '50000'),

    ('b1111111-0000-0000-0000-000000000005', 'TEACHER', 'Paul',   'Kamga',
     'p.kamga@iusjc.cd',    '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG',
     'ROLE_TEACHER', 'ACTIVE', '2024-09-01', 'ENS-105', 'Professeur',           'Physique',      '80000'),

    ('b1111111-0000-0000-0000-000000000006', 'TEACHER', 'Aline',  'Mbarga',
     'a.mbarga@iusjc.cd',   '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG',
     'ROLE_TEACHER', 'ACTIVE', '2024-09-01', 'ENS-106', 'Maitre de conferences', 'Informatique', '65000');

-- =============================================
-- 2. DISPONIBILITES (template hebdomadaire)
-- =============================================
INSERT INTO teacher_availability (id, teacher_id, last_updated, version)
VALUES
    ('ca111111-0000-0000-0000-000000000001', 'b1111111-0000-0000-0000-000000000001', CURRENT_TIMESTAMP, 0),
    ('ca111111-0000-0000-0000-000000000002', 'b1111111-0000-0000-0000-000000000002', CURRENT_TIMESTAMP, 0),
    ('ca111111-0000-0000-0000-000000000003', 'b1111111-0000-0000-0000-000000000003', CURRENT_TIMESTAMP, 0),
    ('ca111111-0000-0000-0000-000000000004', 'b1111111-0000-0000-0000-000000000004', CURRENT_TIMESTAMP, 0),
    ('ca111111-0000-0000-0000-000000000005', 'b1111111-0000-0000-0000-000000000005', CURRENT_TIMESTAMP, 0),
    ('ca111111-0000-0000-0000-000000000006', 'b1111111-0000-0000-0000-000000000006', CURRENT_TIMESTAMP, 0);

-- Creneaux de disponibilite (1h chacun, contrainte : hour_start IN [8,16], hour_end = hour_start+1)
-- ---
-- Dupont (26h/sem) : lun/mar/jeu 8-12 + 14-16, mer/ven 8-12
INSERT INTO availability_time_slots (id, availability_id, day_of_week, hour_start, hour_end) VALUES
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000001','lundi',    8,9),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000001','lundi',    9,10),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000001','lundi',   10,11),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000001','lundi',   11,12),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000001','lundi',   14,15),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000001','lundi',   15,16),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000001','mardi',    8,9),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000001','mardi',    9,10),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000001','mardi',   10,11),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000001','mardi',   11,12),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000001','mardi',   14,15),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000001','mardi',   15,16),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000001','mercredi', 8,9),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000001','mercredi', 9,10),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000001','mercredi',10,11),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000001','mercredi',11,12),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000001','jeudi',    8,9),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000001','jeudi',    9,10),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000001','jeudi',   10,11),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000001','jeudi',   11,12),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000001','jeudi',   14,15),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000001','jeudi',   15,16),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000001','vendredi', 8,9),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000001','vendredi', 9,10),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000001','vendredi',10,11),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000001','vendredi',11,12);

-- Martin (30h/sem) : lun/mar/jeu 8-12 + 13-16, mer 8-12 + 13-15, ven 8-11
INSERT INTO availability_time_slots (id, availability_id, day_of_week, hour_start, hour_end) VALUES
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','lundi',    8,9),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','lundi',    9,10),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','lundi',   10,11),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','lundi',   11,12),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','lundi',   13,14),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','lundi',   14,15),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','lundi',   15,16),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','mardi',    8,9),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','mardi',    9,10),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','mardi',   10,11),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','mardi',   11,12),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','mardi',   13,14),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','mardi',   14,15),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','mardi',   15,16),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','mercredi', 8,9),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','mercredi', 9,10),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','mercredi',10,11),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','mercredi',11,12),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','mercredi',13,14),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','mercredi',14,15),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','jeudi',    8,9),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','jeudi',    9,10),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','jeudi',   10,11),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','jeudi',   11,12),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','jeudi',   13,14),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','jeudi',   14,15),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','jeudi',   15,16),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','vendredi', 8,9),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','vendredi', 9,10),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000002','vendredi',10,11);

-- Leclerc (20h/sem) : lun 8-12 + 14-17, mer 8-12 + 14-16, jeu 9-12 + 14-15, ven 9-12
INSERT INTO availability_time_slots (id, availability_id, day_of_week, hour_start, hour_end) VALUES
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000003','lundi',    8,9),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000003','lundi',    9,10),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000003','lundi',   10,11),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000003','lundi',   11,12),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000003','lundi',   14,15),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000003','lundi',   15,16),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000003','lundi',   16,17),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000003','mercredi', 8,9),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000003','mercredi', 9,10),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000003','mercredi',10,11),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000003','mercredi',11,12),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000003','mercredi',14,15),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000003','mercredi',15,16),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000003','jeudi',    9,10),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000003','jeudi',   10,11),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000003','jeudi',   11,12),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000003','jeudi',   14,15),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000003','vendredi', 9,10),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000003','vendredi',10,11),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000003','vendredi',11,12);

-- Nguyen (19h/sem) : lun 8-12 + 13-15, mar 8-12, mer 8-11, jeu 8-12, ven 8-10
INSERT INTO availability_time_slots (id, availability_id, day_of_week, hour_start, hour_end) VALUES
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000004','lundi',    8,9),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000004','lundi',    9,10),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000004','lundi',   10,11),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000004','lundi',   11,12),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000004','lundi',   13,14),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000004','lundi',   14,15),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000004','mardi',    8,9),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000004','mardi',    9,10),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000004','mardi',   10,11),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000004','mardi',   11,12),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000004','mercredi', 8,9),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000004','mercredi', 9,10),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000004','mercredi',10,11),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000004','jeudi',    8,9),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000004','jeudi',    9,10),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000004','jeudi',   10,11),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000004','jeudi',   11,12),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000004','vendredi', 8,9),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000004','vendredi', 9,10);

-- Kamga (26h/sem) : lun/jeu 8-12 + 14-16, mar 8-12 + 14-17, mer 8-12, ven 8-11
INSERT INTO availability_time_slots (id, availability_id, day_of_week, hour_start, hour_end) VALUES
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000005','lundi',    8,9),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000005','lundi',    9,10),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000005','lundi',   10,11),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000005','lundi',   11,12),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000005','lundi',   14,15),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000005','lundi',   15,16),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000005','mardi',    8,9),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000005','mardi',    9,10),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000005','mardi',   10,11),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000005','mardi',   11,12),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000005','mardi',   14,15),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000005','mardi',   15,16),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000005','mardi',   16,17),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000005','mercredi', 8,9),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000005','mercredi', 9,10),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000005','mercredi',10,11),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000005','mercredi',11,12),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000005','jeudi',    8,9),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000005','jeudi',    9,10),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000005','jeudi',   10,11),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000005','jeudi',   11,12),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000005','jeudi',   14,15),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000005','jeudi',   15,16),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000005','vendredi', 8,9),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000005','vendredi', 9,10),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000005','vendredi',10,11);

-- Mbarga (20h/sem) : lun-ven 13-17 (apres-midi uniquement)
INSERT INTO availability_time_slots (id, availability_id, day_of_week, hour_start, hour_end) VALUES
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000006','lundi',   13,14),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000006','lundi',   14,15),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000006','lundi',   15,16),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000006','lundi',   16,17),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000006','mardi',   13,14),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000006','mardi',   14,15),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000006','mardi',   15,16),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000006','mardi',   16,17),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000006','mercredi',13,14),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000006','mercredi',14,15),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000006','mercredi',15,16),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000006','mercredi',16,17),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000006','jeudi',   13,14),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000006','jeudi',   14,15),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000006','jeudi',   15,16),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000006','jeudi',   16,17),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000006','vendredi',13,14),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000006','vendredi',14,15),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000006','vendredi',15,16),
    (uuid_generate_v4(),'ca111111-0000-0000-0000-000000000006','vendredi',16,17);

-- =============================================
-- 3. AFFECTATIONS ENSEIGNANT-ECOLES (intervenir_ecole)
-- Cles croisees : ecole_id = ID dans le booking-service
-- Test de partage inter-ecoles :
--   Dupont : SJI + CPGE
--   Martin : SJI + SJM
--   Kamga  : CPGE + PV
-- =============================================
INSERT INTO intervenir_ecole (id, enseignant_id, ecole_id, date_debut)
VALUES
    ('ie111111-0000-0000-0000-000000000001', 'b1111111-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111101', '2024-09-01'), -- Dupont -> SJI
    ('ie111111-0000-0000-0000-000000000002', 'b1111111-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111103', '2024-09-01'), -- Dupont -> CPGE
    ('ie111111-0000-0000-0000-000000000003', 'b1111111-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111101', '2024-09-01'), -- Martin -> SJI
    ('ie111111-0000-0000-0000-000000000004', 'b1111111-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111102', '2024-09-01'), -- Martin -> SJM
    ('ie111111-0000-0000-0000-000000000005', 'b1111111-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111102', '2024-09-01'), -- Leclerc -> SJM
    ('ie111111-0000-0000-0000-000000000006', 'b1111111-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111101', '2024-09-01'), -- Nguyen -> SJI
    ('ie111111-0000-0000-0000-000000000007', 'b1111111-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111103', '2024-09-01'), -- Kamga -> CPGE
    ('ie111111-0000-0000-0000-000000000008', 'b1111111-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111104', '2024-09-01'), -- Kamga -> PV
    ('ie111111-0000-0000-0000-000000000009', 'b1111111-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111101', '2024-09-01'); -- Mbarga -> SJI

-- =============================================
-- 4. AFFECTATIONS ENSEIGNANT-COURS (enseigner)
-- Cles croisees : cours_id = ID dans le booking-service
-- =============================================
INSERT INTO enseigner (id, enseignant_id, cours_id, date_debut)
VALUES
    -- Dupont (SJI : Analyse I ; CPGE : Algebre)
    ('en111111-0000-0000-0000-000000000001', 'b1111111-0000-0000-0000-000000000001', '66666666-6666-6666-6666-666666666601', '2024-09-01'), -- Analyse I CM CP1
    ('en111111-0000-0000-0000-000000000002', 'b1111111-0000-0000-0000-000000000001', '66666666-6666-6666-6666-666666666602', '2024-09-01'), -- Analyse I TD CP1
    ('en111111-0000-0000-0000-000000000003', 'b1111111-0000-0000-0000-000000000001', '66666666-6666-6666-6666-666666666603', '2024-09-01'), -- Algebre CM CPGE1
    ('en111111-0000-0000-0000-000000000004', 'b1111111-0000-0000-0000-000000000001', '66666666-6666-6666-6666-66666666660c', '2024-09-01'), -- Analyse I CM CP2
    ('en111111-0000-0000-0000-000000000005', 'b1111111-0000-0000-0000-000000000001', '66666666-6666-6666-6666-66666666660d', '2024-09-01'), -- Algebre CM CPGE2

    -- Martin (SJI : Algo + BDD ; SJM : Sys Info)
    ('en111111-0000-0000-0000-000000000006', 'b1111111-0000-0000-0000-000000000002', '66666666-6666-6666-6666-666666666604', '2024-09-01'), -- Algo CM CI1-GI
    ('en111111-0000-0000-0000-000000000007', 'b1111111-0000-0000-0000-000000000002', '66666666-6666-6666-6666-666666666606', '2024-09-01'), -- BDD CM CI2-GI
    ('en111111-0000-0000-0000-000000000008', 'b1111111-0000-0000-0000-000000000002', '66666666-6666-6666-6666-666666666607', '2024-09-01'), -- Sys Info CM L2-CF

    -- Leclerc (SJM : Comptabilite)
    ('en111111-0000-0000-0000-000000000009', 'b1111111-0000-0000-0000-000000000003', '66666666-6666-6666-6666-666666666608', '2024-09-01'), -- Compta CM L1-CF

    -- Nguyen (SJI : Mecanique)
    ('en111111-0000-0000-0000-000000000010', 'b1111111-0000-0000-0000-000000000004', '66666666-6666-6666-6666-666666666609', '2024-09-01'), -- Mecanique CM CP1

    -- Kamga (CPGE : Physique ; PV : Physique)
    ('en111111-0000-0000-0000-000000000011', 'b1111111-0000-0000-0000-000000000005', '66666666-6666-6666-6666-66666666660a', '2024-09-01'), -- Physique CM CPGE1
    ('en111111-0000-0000-0000-000000000012', 'b1111111-0000-0000-0000-000000000005', '66666666-6666-6666-6666-66666666660b', '2024-09-01'), -- Physique CM PV1
    ('en111111-0000-0000-0000-000000000013', 'b1111111-0000-0000-0000-000000000005', '66666666-6666-6666-6666-66666666660e', '2024-09-01'), -- Physique CM CPGE2
    ('en111111-0000-0000-0000-000000000014', 'b1111111-0000-0000-0000-000000000005', '66666666-6666-6666-6666-66666666660f', '2024-09-01'), -- Physique CM PV2

    -- Mbarga (SJI : Prog C TP)
    ('en111111-0000-0000-0000-000000000015', 'b1111111-0000-0000-0000-000000000006', '66666666-6666-6666-6666-666666666605', '2024-09-01'); -- Prog C TP CI1-GI
