# Plan d'implementation -- Refonte de la generation d'emploi du temps

> **Portee** : Planning-service, User-service, Booking-service, Frontend Angular
> **Date** : 2026-04-01
> **Strategie** : Phases incrementales, chaque phase produit un livrable testable

---

## Table des matieres

1. [Diagnostic complet](#1-diagnostic-complet)
2. [Architecture cible](#2-architecture-cible)
3. [Phase 0 -- Alignement du modele de donnees](#3-phase-0----alignement-du-modele-de-donnees)
4. [Phase 1 -- Nomenclature des niveaux academiques](#4-phase-1----nomenclature-des-niveaux-academiques)
5. [Phase 2 -- Refonte de la grille temporelle](#5-phase-2----refonte-de-la-grille-temporelle)
6. [Phase 3 -- Disponibilites enseignant : template + override hebdomadaire](#6-phase-3----disponibilites-enseignant--template--override-hebdomadaire)
7. [Phase 4 -- Algorithme campus-wide avec Ford-Fulkerson](#7-phase-4----algorithme-campus-wide-avec-ford-fulkerson)
8. [Phase 5 -- Refonte frontend UI/UX](#8-phase-5----refonte-frontend-uiux)
9. [Phase 6 -- Integration Agora](#9-phase-6----integration-agora)
10. [Phase 7 -- Seed data](#10-phase-7----seed-data)
11. [Ordre d'execution](#11-ordre-dexecution)
12. [Annexe A -- Pseudocode de l'algorithme Ford-Fulkerson](#12-annexe-a----pseudocode-de-lalgorithme-ford-fulkerson)
13. [Annexe B -- Pseudocode de l'affectation des salles (Hungarian)](#13-annexe-b----pseudocode-de-laffectation-des-salles)
14. [Annexe C -- Schema du reseau de flot](#14-annexe-c----schema-du-reseau-de-flot)
15. [Annexe D -- Structure des 4 ecoles du campus IUSJC](#15-annexe-d----structure-des-4-ecoles-du-campus-iusjc)

---

## 1. Diagnostic complet

### 1.1 Bugs critiques dans l'algorithme actuel

| # | Bug | Fichier | Ligne(s) | Impact |
|---|-----|---------|----------|--------|
| B1 | **Slot marque "used" globalement** : quand un cours est place dans un creneau, `bestSlot.used = true` empeche TOUT autre cours de se placer au meme horaire, meme dans une salle differente. Resultat : une seule salle peut etre utilisee par heure. | `PlanningGenerationService.java` | 152, 295 | L'algo ne peut planifier qu'un cours par heure sur toute l'ecole -- completement faux |
| B2 | **Aucune verification de double-reservation enseignant** : l'algo ne verifie jamais si un enseignant est deja assigne a un autre cours au meme moment. `isTeacherAvailable()` verifie seulement si l'enseignant a DECLARE etre disponible, pas s'il est deja programme. | `PlanningGenerationService.java` | 314-333 | Un enseignant peut etre programme dans 2 salles au meme moment |
| B3 | **`getSallesDisponibles` retourne toutes les salles sans filtrer** : le endpoint booking-service retourne toutes les salles de l'ecole sans verifier les reservations existantes. Commentaire dans le code : `"simple implementation - can be optimized"`. | `booking-service InternalController.java` | 69-73 | Meme une salle deja reservee est proposee |
| B4 | **Pas de pause dejeuner** : la generation de la grille de creneaux ne contient aucune exclusion de la tranche 12h-13h. | `PlanningGenerationService.java` | 245-288 | Des cours peuvent etre places a 12h |
| B5 | **Placeholder enseignant** : le endpoint `GET /internal/enseignants/{id}` retourne des donnees en dur (`"Unknown"`, `"Teacher"`, `"teacher@example.com"`). | `user-service InternalAvailabilityController.java` | 79-91 | Le planning n'affiche jamais le vrai nom de l'enseignant |
| B6 | **Route dupliquee teacher** : dans `teacher.routes.ts`, le path `'schedule'` est defini deux fois (lignes 12-16 et 33-38). Le second est cense pointer vers `teacher-profile`. | `teacher.routes.ts` | 33 | La page profil enseignant est inaccessible |

### 1.2 Incoherences d'enums (backend vs frontend vs SQL)

| Enum | Backend Java | Frontend TypeScript | SQL CHECK constraint | Verdict |
|------|-------------|--------------------|--------------------|---------|
| `StatutEmploi` | `BROUILLON, VALIDE, PUBLIE` | `DRAFT, VALIDATED, PUBLISHED, ARCHIVED` | `BROUILLON, VALIDE, PUBLIE` | **Aucun match** sauf par semantique. Frontend en anglais, backend en francais. Le frontend ajoute ARCHIVED qui n'existe pas cote back. |
| `StatutCreneau` | `ACTIF, ANNULE, REPORTE` | `DISPONIBLE, RESERVE, CONFIRME, ANNULE` | `ACTIF, ANNULE, REPORTE` | **Seul ANNULE est commun.** 3 valeurs front n'existent pas en back. |
| `TypeConflit` | `ENSEIGNANT_OCCUPE, SALLE_OCCUPEE, GROUPE_OCCUPE, CAPACITE_INSUFFISANTE, EQUIPEMENTS_MANQUANTS, CHEVAUCHEMENT_DISPONIBILITE` | `ENSEIGNANT, SALLE, GROUPE, HORAIRE` | Idem backend | **Completement different.** Le front utilise des noms courts, le back des noms longs. |
| `Severite` | (Java enum non lu directement, mais SQL a) `CRITIQUE, MAJEURE, MINEURE` | `CRITIQUE, MOYENNE, MINEURE` | `CRITIQUE, MAJEURE, MINEURE` | **MAJEURE vs MOYENNE** -- un seul mot differe mais casse le mapping. |
| `StatutResolution` | `NON_RESOLU, EN_COURS, RESOLU` | `NON_RESOLU, EN_COURS, RESOLU, IGNORE` | `NON_RESOLU, EN_COURS, RESOLU` | **IGNORE manque** cote backend et SQL. |
| `DayOfWeek` (creneaux.jour_semaine) | Java `DayOfWeek` enum : `MONDAY, TUESDAY...` | Idem Java (`MONDAY`...) | SQL CHECK : `LUNDI, MARDI...` | **Le JPA persiste `MONDAY` mais le SQL attend `LUNDI`** -- violation de constraint si la migration V1 est reellement appliquee. |

### 1.3 Incoherences de configuration

| Parametre | Backend config (`PlanningGenerationConfig.java`) | Backend DTO (`GeneratePlanningRequest.java`) | Frontend form (`schedule-generator.component.ts`) | Valeur cible |
|-----------|--------------------------------------------------|----------------------------------------------|--------------------------------------------------|-------------|
| Duree creneau | 120 min | 90 min | 90 min | **60 min fixe** |
| Heure de fin | 17:00 | 18:00 | 18:00 | **17:00 fixe** |
| Creneaux/jour | 4 | 6 | 6 | **8 (calcule automatiquement)** |
| Pause entre creneaux | 15 min | 15 min | 15 min | **0 min (pas de pause, creneaux colles)** |

### 1.4 Problemes frontend

| # | Probleme | Fichier | Detail |
|---|---------|---------|--------|
| F1 | **Samedi absent de la grille** | `schedule-viewer.component.ts:71` et `schedule-grid.component.ts:23` | `daysOfWeek` ne contient que `MONDAY` a `FRIDAY` |
| F2 | **CSS grille calcule pour 5 colonnes** | `schedule-grid.component.scss:13` | `width: calc((100% - 100px) / 5)` -- doit passer a 6 |
| F3 | **Formulaire expose des parametres metier fixes** | `schedule-generator.component.html` | L'admin peut modifier la duree, l'heure de fin, la pause -- ce sont des regles metier non modifiables |
| F4 | **Teacher schedule est un stub** | `teacher-schedule.component.html` | Contient uniquement `<p>teacher-schedule.component works!</p>` |
| F5 | **Aucun filtre par salle/classe/enseignant dans le viewer** | `schedule-viewer.component.ts` | Une seule vue plate, pas de dropdown de filtrage |
| F6 | **Le formulaire envoie un seul `ecoleId`** | `schedule-generator.component.ts` | La generation doit etre campus-wide, sans selection d'ecole |

### 1.5 Problemes d'architecture

| # | Probleme | Impact |
|---|---------|--------|
| A1 | **Generation per-ecole** : `GeneratePlanningRequest` prend un seul `ecoleId`. Aucune generation globale. | Un enseignant intervenant dans 2 ecoles peut etre double-reserve. |
| A2 | **Disponibilites enseignant par jour-de-semaine uniquement** : pas de surcharge hebdomadaire. | Impossible pour un prof de signaler une absence specifique a une semaine. |
| A3 | **Nomenclature `Niveau` limitee a L1-M2** : pas de support pour les cycles ingenieur (CP1, CP2, CI1-CI3), CPGE, PrépaVogt. | Les 4 ecoles du campus ne peuvent pas etre correctement modelisees. |
| A4 | **Pas d'entite Campus** : les ecoles sont independantes sans lien commun. | La generation campus-wide n'a pas de point d'ancrage. |

---

## 2. Architecture cible

### 2.1 Regles metier fixes (non parametrables)

```
Jours             : Lundi a Samedi (6 jours)
Plage horaire     : 08:00 -- 17:00
Pause dejeuner    : 12:00 -- 13:00 (exclue de la grille)
Duree d'un creneau: 60 minutes exactement
Creneaux par jour : 8 (8-9, 9-10, 10-11, 11-12, 13-14, 14-15, 15-16, 16-17)
Total par semaine : 48 creneaux (6 jours x 8 creneaux)
```

### 2.2 Modele d'EmploiDuTemps

```
1 generation campus-wide  -->  N EmploiDuTemps (1 par ecole)
Chaque EmploiDuTemps      -->  couvre exactement 1 semaine (lundi a samedi)
Chaque Creneau             -->  date precise (pas de recurrence)
                                typeRecurrence = UNIQUE
```

### 2.3 Flux de generation

```
1. Super-admin declenche : POST /api/planning/generate { weekStart: "2026-04-06" }
2. Le service collecte TOUTES les ecoles, TOUS les cours, TOUS les enseignants
3. Ford-Fulkerson assigne globalement les cours aux creneaux (respect des contraintes enseignant)
4. Matching bipartite assigne les salles (per-ecole)
5. Creation d'1 EmploiDuTemps par ecole (statut DRAFT)
6. Response : resultats par ecole (taux, cours non planifies, conflits)
```

### 2.4 Priorite de placement

```
1. Type de cours    : CM > TD > TP (les CM sont places en premier)
2. A type egal      : Ford-Fulkerson maximise le nombre total de cours places (max-flow)
3. Heures residuelles: si un enseignant a 6h dispo et 2 ecoles demandent 4h chacune,
                       le max-flow repartira 6h de facon a maximiser le total de cours places.
                       Les CM des deux ecoles passent avant les TD des deux ecoles.
```

### 2.5 Placement en blocs consecutifs

```
Un cours de volumeHoraire = N heures  -->  1 bloc de N creneaux consecutifs le meme jour.
"Consecutif" signifie : heures adjacentes SANS compter la pause dejeuner.
Exemple bloc de 4h : 8-9, 9-10, 10-11, 11-12  OU  13-14, 14-15, 15-16, 16-17
Interdit            : 10-11, 11-12, 13-14, 14-15 (la pause coupe le bloc)

Si aucun bloc consecutif de taille N n'est trouvable, le cours est marque comme non planifiable
avec la raison "Aucun bloc consecutif de {N}h disponible".
```

---

## 3. Phase 0 -- Alignement du modele de donnees

> **Objectif** : Aligner les enums et la migration SQL entre backend, frontend, et base de donnees.
> **Prerequis** : Aucun
> **Livrable** : Les enums sont coherents partout. Aucune donnee existante n'est cassee.

### 3.1 Fichiers backend a modifier

#### 3.1.1 `StatutEmploi.java`

**Fichier** : `services/planning-service/src/main/java/com/timely/planningservice/entity/enums/StatutEmploi.java`

**Avant** :
```java
public enum StatutEmploi {
    BROUILLON,
    VALIDE,
    PUBLIE
}
```

**Apres** :
```java
public enum StatutEmploi {
    DRAFT,
    VALIDATED,
    PUBLISHED,
    ARCHIVED
}
```

#### 3.1.2 `StatutCreneau.java`

**Fichier** : `services/planning-service/src/main/java/com/timely/planningservice/entity/enums/StatutCreneau.java`

**Avant** :
```java
public enum StatutCreneau {
    ACTIF,
    ANNULE,
    REPORTE
}
```

**Apres** :
```java
public enum StatutCreneau {
    DISPONIBLE,
    RESERVE,
    CONFIRME,
    ANNULE
}
```

#### 3.1.3 `TypeConflit.java`

**Fichier** : `services/planning-service/src/main/java/com/timely/planningservice/entity/enums/TypeConflit.java`

**Avant** :
```java
public enum TypeConflit {
    ENSEIGNANT_OCCUPE,
    SALLE_OCCUPEE,
    GROUPE_OCCUPE,
    CAPACITE_INSUFFISANTE,
    EQUIPEMENTS_MANQUANTS,
    CHEVAUCHEMENT_DISPONIBILITE
}
```

**Apres** :
```java
public enum TypeConflit {
    ENSEIGNANT,
    SALLE,
    GROUPE,
    HORAIRE
}
```

#### 3.1.4 `Severite.java`

**Fichier** : `services/planning-service/src/main/java/com/timely/planningservice/entity/enums/Severite.java`

Verifier le contenu actuel. Si la valeur `MAJEURE` existe, la remplacer par `MOYENNE` pour aligner avec le frontend :

```java
public enum Severite {
    MINEURE,
    MOYENNE,
    CRITIQUE
}
```

#### 3.1.5 `StatutResolution.java`

**Fichier** : `services/planning-service/src/main/java/com/timely/planningservice/entity/enums/StatutResolution.java`

Ajouter `IGNORE` :

```java
public enum StatutResolution {
    NON_RESOLU,
    EN_COURS,
    RESOLU,
    IGNORE
}
```

#### 3.1.6 `TypeRecurrence.java`

**Fichier** : `services/planning-service/src/main/java/com/timely/planningservice/entity/enums/TypeRecurrence.java`

**Contenu actuel** : `UNIQUE, HEBDOMADAIRE`

La generation ne creera plus que des creneaux `UNIQUE` (dates precises). Garder `HEBDOMADAIRE` pour compatibilite mais la generation n'utilisera que `UNIQUE`.

Pas de modification necessaire de ce fichier.

### 3.2 References a mettre a jour dans le code Java

Apres avoir modifie les enums, chercher et remplacer dans tout le planning-service :

| Rechercher | Remplacer par | Fichiers concernes |
|-----------|--------------|-------------------|
| `StatutEmploi.BROUILLON` | `StatutEmploi.DRAFT` | `EmploiDuTemps.java` (constructeur, ligne 83), `EmploiDuTempsMapper.java`, `PlanningGenerationService.java` |
| `StatutEmploi.VALIDE` | `StatutEmploi.VALIDATED` | Tous les services/controleurs qui referencent ce statut |
| `StatutEmploi.PUBLIE` | `StatutEmploi.PUBLISHED` | Idem |
| `StatutCreneau.ACTIF` | `StatutCreneau.RESERVE` | `Creneau.java` (constructeur, ligne 91), `CreneauMapper.java` |
| `StatutCreneau.REPORTE` | Supprimer les references | Chercher dans tout le code |
| `TypeConflit.ENSEIGNANT_OCCUPE` | `TypeConflit.ENSEIGNANT` | Tous les fichiers qui creent des conflits |
| `TypeConflit.SALLE_OCCUPEE` | `TypeConflit.SALLE` | Idem |
| `TypeConflit.GROUPE_OCCUPE` | `TypeConflit.GROUPE` | Idem |
| `TypeConflit.CAPACITE_INSUFFISANTE` | `TypeConflit.HORAIRE` | Fusionner les anciens types fin dans HORAIRE |
| `TypeConflit.EQUIPEMENTS_MANQUANTS` | `TypeConflit.HORAIRE` | Idem |
| `TypeConflit.CHEVAUCHEMENT_DISPONIBILITE` | `TypeConflit.HORAIRE` | Idem |
| `Severite.MAJEURE` | `Severite.MOYENNE` | Toutes les references |

### 3.3 Migration SQL Flyway

**Nouveau fichier** : `services/planning-service/src/main/resources/db/migration/V2__align_enums.sql`

```sql
-- Aligner StatutEmploi
ALTER TABLE emplois_du_temps DROP CONSTRAINT IF EXISTS emplois_du_temps_statut_check;
UPDATE emplois_du_temps SET statut = 'DRAFT' WHERE statut = 'BROUILLON';
UPDATE emplois_du_temps SET statut = 'VALIDATED' WHERE statut = 'VALIDE';
UPDATE emplois_du_temps SET statut = 'PUBLISHED' WHERE statut = 'PUBLIE';
ALTER TABLE emplois_du_temps ADD CONSTRAINT emplois_du_temps_statut_check
    CHECK (statut IN ('DRAFT', 'VALIDATED', 'PUBLISHED', 'ARCHIVED'));

-- Aligner StatutCreneau
ALTER TABLE creneaux DROP CONSTRAINT IF EXISTS creneaux_statut_creneau_check;
UPDATE creneaux SET statut_creneau = 'RESERVE' WHERE statut_creneau = 'ACTIF';
UPDATE creneaux SET statut_creneau = 'ANNULE' WHERE statut_creneau = 'REPORTE';
ALTER TABLE creneaux ADD CONSTRAINT creneaux_statut_creneau_check
    CHECK (statut_creneau IN ('DISPONIBLE', 'RESERVE', 'CONFIRME', 'ANNULE'));

-- Aligner TypeConflit
ALTER TABLE conflits DROP CONSTRAINT IF EXISTS conflits_type_conflit_check;
UPDATE conflits SET type_conflit = 'ENSEIGNANT' WHERE type_conflit = 'ENSEIGNANT_OCCUPE';
UPDATE conflits SET type_conflit = 'SALLE' WHERE type_conflit = 'SALLE_OCCUPEE';
UPDATE conflits SET type_conflit = 'GROUPE' WHERE type_conflit = 'GROUPE_OCCUPE';
UPDATE conflits SET type_conflit = 'HORAIRE' WHERE type_conflit IN ('CAPACITE_INSUFFISANTE', 'EQUIPEMENTS_MANQUANTS', 'CHEVAUCHEMENT_DISPONIBILITE');
ALTER TABLE conflits ADD CONSTRAINT conflits_type_conflit_check
    CHECK (type_conflit IN ('ENSEIGNANT', 'SALLE', 'GROUPE', 'HORAIRE'));

-- Aligner Severite
ALTER TABLE conflits DROP CONSTRAINT IF EXISTS conflits_severite_check;
UPDATE conflits SET severite = 'MOYENNE' WHERE severite = 'MAJEURE';
ALTER TABLE conflits ADD CONSTRAINT conflits_severite_check
    CHECK (severite IN ('CRITIQUE', 'MOYENNE', 'MINEURE'));

-- Aligner StatutResolution
ALTER TABLE conflits DROP CONSTRAINT IF EXISTS conflits_statut_resolution_check;
ALTER TABLE conflits ADD CONSTRAINT conflits_statut_resolution_check
    CHECK (statut_resolution IN ('NON_RESOLU', 'EN_COURS', 'RESOLU', 'IGNORE'));

-- Aligner jour_semaine (JPA persiste MONDAY, TUESDAY... pas LUNDI, MARDI...)
ALTER TABLE creneaux DROP CONSTRAINT IF EXISTS creneaux_jour_semaine_check;
ALTER TABLE creneaux ADD CONSTRAINT creneaux_jour_semaine_check
    CHECK (jour_semaine IN ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'));
```

### 3.4 Fichier frontend -- Aucune modification

Les fichiers `planning.model.ts` et les composants frontend utilisent deja les valeurs cibles (`DRAFT`, `DISPONIBLE`, etc.). Aucune modification frontend dans cette phase.

### 3.5 Criteres d'acceptation Phase 0

- [ ] Tous les enums Java compilent
- [ ] La migration V2 s'execute sans erreur sur une base contenant des donnees V1
- [ ] `grep -r "BROUILLON\|ACTIF\|REPORTE\|VALIDE\b\|PUBLIE\b\|MAJEURE\|ENSEIGNANT_OCCUPE\|SALLE_OCCUPEE\|GROUPE_OCCUPE\|CAPACITE_INSUFFISANTE\|EQUIPEMENTS_MANQUANTS\|CHEVAUCHEMENT_DISPONIBILITE" services/planning-service/src/` ne retourne aucun resultat
- [ ] Le planning-service demarre sans erreur
- [ ] Un test d'integration basique (creer un EmploiDuTemps, creer un Creneau) fonctionne

---

## 4. Phase 1 -- Nomenclature des niveaux academiques

> **Objectif** : Remplacer l'enum `Niveau` (L1-M2) par un modele generique `CycleType` + `yearIndex` pour supporter les 4 ecoles du campus.
> **Prerequis** : Aucun (independant de Phase 0)
> **Livrable** : Les classes de toutes les ecoles du campus sont modelisables.

### 4.1 Contexte des 4 ecoles

| Ecole | Code | Cycles proposes | Niveaux | Notation attendue |
|-------|------|-----------------|---------|-------------------|
| Saint Jean Ingenieur | SJI | Prepa Ingenieur (2 ans) + Cycle Ingenieur (3 ans), ET Licence (3 ans) + Master (2 ans) | 5 + 5 | CP1, CP2, CI1, CI2, CI3 et L1, L2, L3, M1, M2 |
| Saint Jean Management | SJM | Licence (3 ans) + Master (2 ans) | 5 | L1, L2, L3, M1, M2 |
| CPGE | CPGE | Classes Preparatoires aux Grandes Ecoles (2 ans) | 2 | CPGE1, CPGE2 |
| PrepaVogt | PV | Preparatoire (2 ans) | 2 | PV1, PV2 |

### 4.2 Nouveau modele

#### 4.2.1 Nouvel enum `CycleType.java`

**Nouveau fichier** : `services/booking-service/src/main/java/com/timely/bookingservice/entity/enums/CycleType.java`

```java
public enum CycleType {
    LICENCE,
    MASTER,
    PREPA_INGENIEUR,
    CYCLE_INGENIEUR,
    CPGE,
    PREPA_VOGT;

    public String getDisplayPrefix() {
        return switch (this) {
            case LICENCE -> "L";
            case MASTER -> "M";
            case PREPA_INGENIEUR -> "CP";
            case CYCLE_INGENIEUR -> "CI";
            case CPGE -> "CPGE";
            case PREPA_VOGT -> "PV";
        };
    }

    public int getMaxYears() {
        return switch (this) {
            case LICENCE -> 3;
            case MASTER -> 2;
            case PREPA_INGENIEUR -> 2;
            case CYCLE_INGENIEUR -> 3;
            case CPGE -> 2;
            case PREPA_VOGT -> 2;
        };
    }

    public String getDisplayLabel(int yearIndex) {
        return getDisplayPrefix() + yearIndex;
    }
}
```

#### 4.2.2 Modifier `Filiere.java`

**Fichier** : `services/booking-service/src/main/java/com/timely/bookingservice/entity/Filiere.java`

Ajouter un champ `cycleType` a l'entite :

```java
@Enumerated(EnumType.STRING)
@Column(name = "cycle_type", nullable = false, length = 30)
private CycleType cycleType;
```

Raison : une filiere appartient a un seul cycle. Exemple : "Genie Informatique" dans SJI est de type `CYCLE_INGENIEUR`. "Informatique de Gestion" dans SJM est de type `LICENCE`.

#### 4.2.3 Modifier `Classe.java`

**Fichier** : `services/booking-service/src/main/java/com/timely/bookingservice/entity/Classe.java`

Remplacer le champ `Niveau niveau` par `int yearIndex` :

**Avant** :
```java
@Enumerated(EnumType.STRING)
@Column(nullable = false, length = 10)
private Niveau niveau;
```

**Apres** :
```java
@Column(name = "year_index", nullable = false)
@Min(1)
@Max(5)
private Integer yearIndex;
```

Le label d'affichage est derive dynamiquement :
`classe.getFiliere().getCycleType().getDisplayLabel(classe.getYearIndex())`

Exemple : Filiere "Genie Informatique" (cycle CYCLE_INGENIEUR), Classe yearIndex=2 -> affichage "CI2".

#### 4.2.4 Supprimer `Niveau.java`

**Fichier a supprimer** : `services/booking-service/src/main/java/com/timely/bookingservice/entity/enums/Niveau.java`

Apres avoir remplace toutes ses references par `yearIndex` + `CycleType`.

#### 4.2.5 Modifier les DTOs

**`ClasseRequest.java`** : Remplacer `private Niveau niveau;` par `private Integer yearIndex;`

**`ClasseResponse.java`** : Remplacer le champ `niveau` par :
```java
private Integer yearIndex;
private String cycleType;
private String displayLevel;  // valeur calculee : "CI2", "L3", etc.
```

**`FiliereRequest.java`** : Ajouter `private CycleType cycleType;`

**`FiliereResponse.java`** : Ajouter `private String cycleType;`

#### 4.2.6 Modifier le mapper `ClasseMapper` (ou equivalent)

Chercher le mapper qui convertit `Classe` -> `ClasseResponse` et ajouter :
```java
response.setYearIndex(classe.getYearIndex());
response.setCycleType(classe.getFiliere().getCycleType().name());
response.setDisplayLevel(classe.getFiliere().getCycleType().getDisplayLabel(classe.getYearIndex()));
```

#### 4.2.7 Modifier le mapper `FiliereMapper` (ou equivalent)

Ajouter le champ `cycleType` dans le mapping Filiere -> FiliereResponse.

### 4.3 Migration SQL Flyway

**Nouveau fichier** : `services/booking-service/src/main/resources/db/migration/V2__refactor_academic_levels.sql`

```sql
-- Ajouter cycle_type a la table filieres
ALTER TABLE filieres ADD COLUMN cycle_type VARCHAR(30);

-- Ajouter year_index a la table classes
ALTER TABLE classes ADD COLUMN year_index INTEGER;

-- Migrer les donnees existantes : convertir niveau -> year_index
UPDATE classes SET year_index = CASE
    WHEN niveau = 'L1' THEN 1
    WHEN niveau = 'L2' THEN 2
    WHEN niveau = 'L3' THEN 3
    WHEN niveau = 'M1' THEN 1
    WHEN niveau = 'M2' THEN 2
    ELSE 1
END;

-- Definir cycle_type des filieres existantes en fonction du niveau des classes
-- (heuristique : si une filiere a des classes M1/M2, c'est MASTER, sinon LICENCE)
UPDATE filieres f SET cycle_type = 'LICENCE'
WHERE EXISTS (SELECT 1 FROM classes c WHERE c.filiere_id = f.id AND c.niveau IN ('L1','L2','L3'));
UPDATE filieres f SET cycle_type = 'MASTER'
WHERE EXISTS (SELECT 1 FROM classes c WHERE c.filiere_id = f.id AND c.niveau IN ('M1','M2'));
-- Default pour celles sans classes
UPDATE filieres SET cycle_type = 'LICENCE' WHERE cycle_type IS NULL;

-- Rendre les colonnes NOT NULL
ALTER TABLE filieres ALTER COLUMN cycle_type SET NOT NULL;
ALTER TABLE classes ALTER COLUMN year_index SET NOT NULL;

-- Supprimer l'ancienne colonne niveau
ALTER TABLE classes DROP COLUMN IF EXISTS niveau;

-- Ajouter les contraintes
ALTER TABLE filieres ADD CONSTRAINT check_cycle_type
    CHECK (cycle_type IN ('LICENCE','MASTER','PREPA_INGENIEUR','CYCLE_INGENIEUR','CPGE','PREPA_VOGT'));
ALTER TABLE classes ADD CONSTRAINT check_year_index
    CHECK (year_index >= 1 AND year_index <= 5);
```

### 4.4 Frontend

#### 4.4.1 Modifier `academic.model.ts`

Ajouter :
```typescript
export type CycleType = 'LICENCE' | 'MASTER' | 'PREPA_INGENIEUR' | 'CYCLE_INGENIEUR' | 'CPGE' | 'PREPA_VOGT';

export const CycleTypeLabels: Record<CycleType, string> = {
    LICENCE: 'Licence',
    MASTER: 'Master',
    PREPA_INGENIEUR: 'Classe Preparatoire Ingenieur',
    CYCLE_INGENIEUR: 'Cycle Ingenieur',
    CPGE: 'CPGE',
    PREPA_VOGT: 'PrepaVogt'
};

export const CycleTypePrefix: Record<CycleType, string> = {
    LICENCE: 'L',
    MASTER: 'M',
    PREPA_INGENIEUR: 'CP',
    CYCLE_INGENIEUR: 'CI',
    CPGE: 'CPGE',
    PREPA_VOGT: 'PV'
};

export const CycleTypeMaxYears: Record<CycleType, number> = {
    LICENCE: 3,
    MASTER: 2,
    PREPA_INGENIEUR: 2,
    CYCLE_INGENIEUR: 3,
    CPGE: 2,
    PREPA_VOGT: 2
};
```

Modifier l'interface `Filiere` pour ajouter `cycleType: CycleType`.

Modifier l'interface `Classe` : remplacer `niveau: string` par `yearIndex: number` et `displayLevel: string`.

Modifier `CreateClasseDTO` : remplacer `niveau: string` par `yearIndex: number`.

Modifier `CreateFiliereDTO` : ajouter `cycleType: CycleType`.

#### 4.4.2 Modifier `academic.component.html`

Remplacer le dropdown "Niveau" statique (lignes 497-504 actuelles) par un dropdown dynamique :

**Formulaire de creation de filiere** -- Ajouter un select `CycleType` :
```html
<select formControlName="cycleType">
    <option value="" disabled>Selectionner le type de cycle</option>
    <!-- Boucler sur CycleType -->
</select>
```

**Formulaire de creation de classe** -- Remplacer le select "Niveau" par un select "Annee" dont les options dependent du `cycleType` de la filiere selectionnee :
```html
<!-- Si la filiere selectionnee a cycleType = CYCLE_INGENIEUR (maxYears=3) -->
<select formControlName="yearIndex">
    <option [value]="1">CI1 (1ere annee)</option>
    <option [value]="2">CI2 (2eme annee)</option>
    <option [value]="3">CI3 (3eme annee)</option>
</select>
```

Le label de chaque option est compute dynamiquement : `CycleTypePrefix[filiere.cycleType] + i` pour i allant de 1 a `CycleTypeMaxYears[filiere.cycleType]`.

#### 4.4.3 Modifier `academic.component.ts`

- Ajouter les imports des nouvelles constantes (`CycleType`, `CycleTypeLabels`, etc.)
- Ajouter un computed signal `availableYears` qui se met a jour quand une filiere est selectionnee dans le formulaire de creation de classe
- Lors de l'affichage dans les listes, utiliser `classe.displayLevel` (fourni par le backend) au lieu de `classe.niveau`

### 4.5 Criteres d'acceptation Phase 1

- [ ] L'enum `Niveau` n'existe plus dans le code
- [ ] On peut creer une filiere de type `CYCLE_INGENIEUR` dans SJI et y ajouter des classes CI1, CI2, CI3
- [ ] On peut creer une filiere de type `CPGE` dans l'ecole CPGE et y ajouter des classes CPGE1, CPGE2
- [ ] Les labels s'affichent correctement (ex: "CI2" et non "2")
- [ ] La migration V2 s'execute sans erreur
- [ ] Les 4 ecoles du campus peuvent etre modelisees completement avec la seed data (Phase 7)

---

## 5. Phase 2 -- Refonte de la grille temporelle

> **Objectif** : Forcer la grille 8 creneaux de 60 min, lundi-samedi, avec pause 12-13h.
> **Prerequis** : Phase 0 (enums alignes)
> **Livrable** : La grille temporelle est correcte et non modifiable par l'utilisateur.

### 5.1 Backend

#### 5.1.1 Modifier `PlanningGenerationConfig.java`

**Fichier** : `services/planning-service/src/main/java/com/timely/planningservice/config/PlanningGenerationConfig.java`

Remplacer tout le contenu par des constantes fixes. Ce ne sont plus des proprietes configurables mais des constantes metier :

```java
@Configuration
@Getter
public class PlanningGenerationConfig {
    private final int slotDurationMinutes = 60;
    private final LocalTime dayStart = LocalTime.of(8, 0);
    private final LocalTime dayEnd = LocalTime.of(17, 0);
    private final LocalTime lunchStart = LocalTime.of(12, 0);
    private final LocalTime lunchEnd = LocalTime.of(13, 0);
    private final int slotsPerDay = 8;
    private final DayOfWeek[] activeDays = {
        DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
        DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY
    };
    private final long maxGenerationDurationMs = 120_000L;

    // Scoring weights
    private final int scoreCmMorning = 40;
    private final int scoreMidWeek = 10;
    private final int penaltyLateAfternoon = 20;
    private final int scoreGroupSameDay = 50;

    public List<LocalTime> getSlotStartTimes() {
        return List.of(
            LocalTime.of(8, 0), LocalTime.of(9, 0), LocalTime.of(10, 0), LocalTime.of(11, 0),
            LocalTime.of(13, 0), LocalTime.of(14, 0), LocalTime.of(15, 0), LocalTime.of(16, 0)
        );
    }

    public boolean isConsecutive(LocalTime first, LocalTime second) {
        if (first.equals(LocalTime.of(11, 0)) && second.equals(LocalTime.of(13, 0))) {
            return false; // lunch break
        }
        return first.plusMinutes(slotDurationMinutes).equals(second);
    }
}
```

**Points importants** :
- `getSlotStartTimes()` retourne les 8 heures de debut (pas 12h)
- `isConsecutive(11h, 13h)` retourne `false` car la pause dejeuner coupe la consecutivite
- `isConsecutive(10h, 11h)` retourne `true`
- Supprimer l'annotation `@ConfigurationProperties` : ce ne sont plus des proprietes modifiables

#### 5.1.2 Simplifier `GeneratePlanningRequest.java`

**Fichier** : `services/planning-service/src/main/java/com/timely/planningservice/dto/request/GeneratePlanningRequest.java`

Remplacer tout le contenu. Le DTO ne contient plus que la date de debut de semaine :

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeneratePlanningRequest {
    @NotNull(message = "La date de debut de semaine est obligatoire")
    private LocalDate weekStart;
}
```

**Supprime** : `ecoleId`, `dateFin`, `periode`, `creneauxParJour`, `heureDebutJournee`, `heureFinJournee`, `dureeCreneauMinutes`, `pauseEntreCreneauxMinutes`.

Le backend calculera automatiquement :
- `dateFin = weekStart.plusDays(5)` (samedi)
- `periode = PeriodeEmploi.SEMAINE` (toujours)
- Tous les autres parametres sont des constantes.

**Validation supplementaire** : verifier que `weekStart` est un lundi. Sinon, retourner 400 avec message "weekStart doit etre un lundi".

### 5.2 Frontend

#### 5.2.1 Simplifier `schedule-generator.component.ts`

**Fichier** : `timely-frontend/src/app/features/admin/schedule/generator/schedule-generator.component.ts`

Remplacer le formulaire par un champ unique `weekStart` (date picker filtre sur les lundis) :

```typescript
generatorForm = this.fb.group({
    weekStart: ['', Validators.required]
});
```

Supprimer : `ecoleId`, `dateDebut`, `dateFin`, `periode`, `creneauxParJour`, `heureDebutJournee`, `heureFinJournee`, `dureeCreneauMinutes`, `pauseEntreCreneauxMinutes`.

Supprimer : `periodeOptions`, `ecoles` signal, l'appel `ecoleService.fetchEcolesFromApi()` dans `ngOnInit`.

#### 5.2.2 Simplifier `schedule-generator.component.html`

Remplacer tout le formulaire par :

1. Un titre "Generer les emplois du temps de la semaine"
2. Un champ date (date picker) etiquete "Semaine du" avec une indication "(selectionner un lundi)"
3. Un bouton "Generer"
4. Le resultat de generation (inchange sauf qu'il montre les resultats par ecole -- voir Phase 5 pour le detail UI)

Supprimer toute la section "Configuration avancee".

#### 5.2.3 Mettre a jour `planning.model.ts`

Modifier `GeneratePlanningRequest` :

```typescript
export interface GeneratePlanningRequest {
    weekStart: string; // Format ISO: YYYY-MM-DD (doit etre un lundi)
}
```

### 5.3 Criteres d'acceptation Phase 2

- [ ] Le DTO `GeneratePlanningRequest` ne contient que `weekStart`
- [ ] Le backend refuse un `weekStart` qui n'est pas un lundi (HTTP 400)
- [ ] La grille generee contient exactement 48 slots (6 jours x 8 heures)
- [ ] Aucun slot n'est cree a 12h
- [ ] Le formulaire frontend ne montre qu'un date picker

---

## 6. Phase 3 -- Disponibilites enseignant : template + override hebdomadaire

> **Objectif** : Permettre aux enseignants de signaler des modifications de disponibilite pour une semaine specifique.
> **Prerequis** : Aucun (independant)
> **Livrable** : Le planning-service utilise les disponibilites effectives (template + overrides) pour la semaine donnee.

### 6.1 Nouvelle entite `TeacherWeeklyOverride.java`

**Nouveau fichier** : `services/user-service/src/main/java/com/timely/userservice/model/TeacherWeeklyOverride.java`

```java
@Entity
@Table(
    name = "teacher_weekly_overrides",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_teacher_week_day_hour",
        columnNames = {"teacher_id", "week_start", "day_of_week", "hour_start"}
    )
)
@Getter
@Setter
@NoArgsConstructor
public class TeacherWeeklyOverride {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "teacher_id", nullable = false)
    private UUID teacherId;

    @Column(name = "week_start", nullable = false)
    private LocalDate weekStart;  // toujours un lundi

    @Column(name = "day_of_week", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private DayOfWeek dayOfWeek;

    @Column(name = "hour_start", nullable = false)
    private Integer hourStart;

    @Column(name = "hour_end", nullable = false)
    private Integer hourEnd;

    @Column(name = "available", nullable = false)
    private Boolean available;  // true = disponible, false = indisponible

    @Column(name = "reason", length = 255)
    private String reason;  // optionnel : "conge", "reunion", etc.

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
```

### 6.2 Nouveau repository

**Nouveau fichier** : `services/user-service/src/main/java/com/timely/userservice/repository/TeacherWeeklyOverrideRepository.java`

```java
public interface TeacherWeeklyOverrideRepository extends JpaRepository<TeacherWeeklyOverride, UUID> {
    List<TeacherWeeklyOverride> findByTeacherIdAndWeekStart(UUID teacherId, LocalDate weekStart);
    void deleteByTeacherIdAndWeekStart(UUID teacherId, LocalDate weekStart);
}
```

### 6.3 Migration SQL Flyway

**Nouveau fichier** : `services/user-service/src/main/resources/db/migration/V5__create_weekly_overrides.sql`

```sql
CREATE TABLE teacher_weekly_overrides (
    id UUID PRIMARY KEY,
    teacher_id UUID NOT NULL,
    week_start DATE NOT NULL,
    day_of_week VARCHAR(20) NOT NULL CHECK (day_of_week IN ('MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY')),
    hour_start INTEGER NOT NULL CHECK (hour_start >= 8 AND hour_start <= 16),
    hour_end INTEGER NOT NULL CHECK (hour_end >= 9 AND hour_end <= 17),
    available BOOLEAN NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_teacher_week_day_hour UNIQUE (teacher_id, week_start, day_of_week, hour_start),
    CONSTRAINT check_hours CHECK (hour_end > hour_start),
    CONSTRAINT check_week_start_is_monday CHECK (EXTRACT(ISODOW FROM week_start) = 1)
);

CREATE INDEX idx_override_teacher_week ON teacher_weekly_overrides(teacher_id, week_start);
```

### 6.4 Modifier `AvailabilityServiceImpl.java`

Ajouter une methode qui fusionne template + overrides :

```java
public List<AvailabilitySlotDto> getEffectiveAvailability(UUID teacherId, LocalDate weekStart) {
    // 1. Recuperer le template (disponibilites recurentes)
    List<AvailabilitySlotDto> templateSlots = getAvailabilityByTeacherId(teacherId);

    // 2. Recuperer les overrides pour cette semaine
    List<TeacherWeeklyOverride> overrides = overrideRepository.findByTeacherIdAndWeekStart(teacherId, weekStart);

    // 3. Fusionner : pour chaque (jour, heure), l'override ecrase le template
    //    Si override.available = false -> retirer le slot du template
    //    Si override.available = true -> ajouter le slot (meme s'il n'etait pas dans le template)

    // Implementation : creer un Set<(DayOfWeek, hour)> a partir du template,
    // puis appliquer les overrides dessus, puis reconvertir en AvailabilitySlotDto.
}
```

### 6.5 Nouvel endpoint dans `InternalAvailabilityController.java`

Ajouter :

```java
@GetMapping("/disponibilites/enseignant/{enseignantId}/semaine")
public ResponseEntity<List<DisponibiliteDTO>> getDisponibilitesSemaine(
        @PathVariable UUID enseignantId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart) {
    List<AvailabilitySlotDto> effective = availabilityService.getEffectiveAvailability(enseignantId, weekStart);
    // Convertir en DisponibiliteDTO et retourner
}
```

### 6.6 Corriger le endpoint `getEnseignant` (bug B5)

Dans `InternalAvailabilityController.java`, remplacer le placeholder par un vrai appel a la base de donnees :

```java
@GetMapping("/enseignants/{id}")
public ResponseEntity<EnseignantDTO> getEnseignant(@PathVariable UUID id) {
    User teacher = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found: " + id));
    Teacher t = (Teacher) teacher;
    return ResponseEntity.ok(new EnseignantDTO(
        t.getId(), t.getName(), t.getSurname(), t.getEmail(),
        t.getGrade(), t.getRank()
    ));
}
```

### 6.7 Mettre a jour `UserServiceClient.java` dans planning-service

**Fichier** : `services/planning-service/src/main/java/com/timely/planningservice/client/UserServiceClient.java`

Ajouter :
```java
@GetMapping("/internal/disponibilites/enseignant/{enseignantId}/semaine")
List<DisponibiliteDTO> getDisponibilitesSemaine(
        @PathVariable UUID enseignantId,
        @RequestParam LocalDate weekStart);
```

### 6.8 Endpoint pour que l'enseignant saisisse ses overrides

**Nouveau endpoint dans le controller enseignant (cote user-service, expose via gateway)** :

```
PUT /api/users/teachers/me/availability/overrides
Body: {
    weekStart: "2026-04-13",
    overrides: [
        { dayOfWeek: "MONDAY", hourStart: 8, hourEnd: 12, available: false, reason: "Reunion departement" },
        { dayOfWeek: "FRIDAY", hourStart: 14, hourEnd: 17, available: true }
    ]
}
```

Logique : supprimer tous les overrides existants pour `(teacherId, weekStart)`, puis inserer les nouveaux.

### 6.9 Frontend -- mise a jour du composant availability enseignant

Le composant `teacher-availability.component.ts` existe deja et fonctionne pour le template de base.

**Modification** : ajouter un onglet "Exceptions de la semaine" :
- Un date picker pour selectionner la semaine
- La meme grille que le template, mais preremplit a partir du template
- L'enseignant clique pour toggler des creneaux ON/OFF
- Bouton "Sauvegarder les exceptions"

### 6.10 Criteres d'acceptation Phase 3

- [ ] Un enseignant peut saisir des overrides pour une semaine future
- [ ] `getEffectiveAvailability(teacherId, weekStart)` retourne le template SAUF les creneaux overrides
- [ ] Le planning-service utilise les disponibilites effectives (pas le template brut)
- [ ] L'endpoint `getEnseignant` retourne les vraies donnees du prof

---

## 7. Phase 4 -- Algorithme campus-wide avec Ford-Fulkerson

> **Objectif** : Remplacer l'algorithme MCF mono-ecole par un algorithme global multi-ecoles base sur Ford-Fulkerson.
> **Prerequis** : Phase 0, Phase 2, Phase 3
> **Livrable** : La generation produit N EmploiDuTemps (1 par ecole) en une seule requete, sans double-reservation d'enseignant.

### 7.1 Vue d'ensemble de l'algorithme

```
Entree  : weekStart (un lundi)
Sortie  : 1 EmploiDuTemps par ecole du campus

Etape 1  : Collecte globale des donnees
Etape 2  : Pre-traitement et validation
Etape 3  : Affectation enseignant-creneaux (Ford-Fulkerson) -- par priorite de type
Etape 4  : Affectation des salles (matching bipartite par ecole)
Etape 5  : Creation des EmploiDuTemps et Creneaux
Etape 6  : Construction de la reponse
```

### 7.2 Nouveau DTO de requete

Deja defini en Phase 2. `GeneratePlanningRequest` ne contient que `weekStart`.

### 7.3 Nouveau DTO de reponse

**Nouveau fichier** : `services/planning-service/src/main/java/com/timely/planningservice/dto/response/CampusGenerationResponse.java`

```java
public record CampusGenerationResponse(
    List<SchoolResult> schoolResults,
    int totalCourses,
    int totalScheduled,
    int totalUnscheduled,
    double overallSuccessRate,
    long generationDurationMs
) {}

public record SchoolResult(
    UUID ecoleId,
    String ecoleNom,
    UUID emploiDuTempsId,
    int coursesScheduled,
    int coursesUnscheduled,
    List<CoursNonPlanifie> unscheduledCourses,
    double successRate
) {}
```

### 7.4 Nouveau service : `CampusScheduleGenerationService.java`

**Nouveau fichier** : `services/planning-service/src/main/java/com/timely/planningservice/service/CampusScheduleGenerationService.java`

Ce service remplace `PlanningGenerationService.java`. L'ancien fichier n'est pas supprime mais n'est plus appele (on peut le deprecier).

#### 7.4.1 Etape 1 : Collecte globale

```
1.1 Recuperer TOUTES les ecoles via BookingServiceClient
    -> Nouveau endpoint necessaire : GET /internal/ecoles
    -> Retourne List<EcoleDTO(id, nom, code)>

1.2 Pour chaque ecole, recuperer tous les cours
    -> bookingServiceClient.getCoursByEcole(ecoleId) pour chaque ecole
    -> Resultat : Map<UUID ecoleId, List<CoursDTO>> coursesBySchool

1.3 Extraire tous les enseignantIds uniques de tous les cours

1.4 Pour chaque enseignant unique, recuperer ses disponibilites effectives
    -> userServiceClient.getDisponibilitesSemaine(enseignantId, weekStart)
    -> Resultat : Map<UUID enseignantId, List<DisponibiliteDTO>> availabilities

1.5 Pour chaque ecole, recuperer toutes les salles
    -> bookingServiceClient.getSallesByEcole(ecoleId)
    -> Resultat : Map<UUID ecoleId, List<SalleDTO>> roomsBySchool
```

**IMPORTANT -- Nouvel endpoint requis dans booking-service** :

Ajouter dans `InternalController.java` du booking-service :
```java
@GetMapping("/ecoles")
public ResponseEntity<List<EcoleResponse>> getAllEcoles() {
    return ResponseEntity.ok(ecoleService.getAll(Pageable.unpaged()).getContent());
}
```

Et ajouter dans `BookingServiceClient.java` du planning-service :
```java
@GetMapping("/internal/ecoles")
List<EcoleDTO> getAllEcoles();

record EcoleDTO(UUID id, String nom, String code) {}
```

#### 7.4.2 Etape 2 : Pre-traitement

Pour chaque cours de chaque ecole :

```
2.1 Verifier que le cours a un enseignantId. Sinon : non planifiable, raison = "Aucun enseignant assigne".

2.2 Calculer le nombre d'heures requises :
    requiredHours = cours.volumeHoraire
    (NB : volumeHoraire est deja en heures, et un creneau = 1 heure,
     donc requiredHours = volumeHoraire directement)

2.3 Si requiredHours > 8 : non planifiable, raison = "Volume horaire depasse 8h (max par jour)".
    (Un bloc consecutif ne peut pas depasser les 8 creneaux d'une journee)

2.4 Calculer les placements valides pour ce cours :
    Pour chaque jour (Lun-Sam) :
        Pour chaque heure de debut possible :
            Verifier si un bloc de `requiredHours` heures consecutives est possible
            a partir de cette heure (en respectant que 11h->13h n'est PAS consecutif).
            Verifier si l'enseignant est disponible pour CHAQUE heure du bloc.
            Si oui : ajouter (jour, heureDebut) comme placement valide.

    Si aucun placement valide : non planifiable, raison = "Aucun bloc consecutif
    de {N}h disponible compatible avec les disponibilites de l'enseignant".

2.5 Calculer le score de contrainte :
    constraintScore = nombre de placements valides / requiredHours
    (Plus le score est bas, plus le cours est contraint)
```

#### 7.4.3 Etape 3 : Affectation enseignant-creneaux avec Ford-Fulkerson

C'est le coeur de l'algorithme. Le processus se fait en **3 passes successives** par type de cours :

```
Passe 1 : Placer tous les cours de type CM  (priorite haute)
Passe 2 : Placer tous les cours de type TD  (priorite moyenne)
Passe 3 : Placer tous les cours de type TP  (priorite basse)
```

Pour chaque passe :

**3.1 Construire le reseau de flot (flow network)**

Noeuds :
- `SOURCE`
- Un noeud `COURSE_{courseId}` par cours non encore place de ce type
- Un noeud `PLACEMENT_{courseId}_{day}_{startHour}` par placement valide
- Un noeud `TEACHER_HOUR_{teacherId}_{day}_{hour}` par creneau enseignant encore libre
- `SINK`

Aretes :
```
SOURCE -> COURSE_{courseId}               capacite = 1

COURSE_{courseId} -> PLACEMENT_{cId}_{d}_{h}   capacite = 1
    (pour chaque placement valide du cours)

PLACEMENT_{cId}_{d}_{h} -> TEACHER_HOUR_{tId}_{d}_{k}  capacite = 1
    (pour chaque heure k dans le bloc [h, h+requiredHours-1],
     ou tId = enseignantId du cours)
    ATTENTION : si le bloc enjambe la pause (ce qui est interdit),
    ce placement n'existe pas (filtre a l'etape 2.4)

TEACHER_HOUR_{tId}_{d}_{k} -> SINK        capacite = 1
```

**IMPORTANT** : les noeuds `TEACHER_HOUR` sont **globaux** (partages entre toutes les ecoles). C'est ce qui garantit qu'un enseignant ne peut pas etre programme dans 2 ecoles au meme moment.

Si un noeud `TEACHER_HOUR_{tId}_{d}_{k}` a deja ete consomme par un cours d'une passe precedente, il n'est pas inclus dans le graphe de la passe courante.

**3.2 Executer Edmonds-Karp (BFS-based Ford-Fulkerson)**

```
maxFlow = 0
tant que BFS(SOURCE, SINK) trouve un chemin augmentant P:
    bottleneck = min(capaciteResiduelle(e) pour e dans P)
    pour chaque arete e dans P:
        flow[e] += bottleneck
        flow[reverse(e)] -= bottleneck
    maxFlow += bottleneck
retourner maxFlow
```

Le `maxFlow` represente le nombre de cours de ce type qui ont pu etre places.

**3.3 Extraire les affectations a partir du flot**

Pour chaque arete `COURSE_{cId} -> PLACEMENT_{cId}_{d}_{h}` ayant un flot de 1 :
- Le cours `cId` est affecte au jour `d` a partir de l'heure `h`
- Marquer les noeuds `TEACHER_HOUR_{tId}_{d}_{k}` comme consommes

Pour chaque cours sans affectation dans cette passe :
- Ajouter a la liste des cours non planifies avec raison.

**3.4 Apres les 3 passes** : tous les cours CM, TD, TP ont ete traites.

#### 7.4.4 Etape 4 : Affectation des salles

Pour chaque ecole separement :

```
4.1 Collecter toutes les affectations (cours, jour, heureDebut, heuresList) pour cette ecole.

4.2 Pour chaque creneau horaire (jour, heure) ou au moins un cours est place :
    - Lister les cours assignes a ce (jour, heure)
    - Lister les salles disponibles (non encore assignees a ce jour+heure)
    - Pour chaque cours, filtrer les salles compatibles :
        * salle.capacite >= cours.effectifGroupe (ou 30 par defaut)
        * salle.typeSalle compatible avec cours.typeCours si pertinent
          (ex: TP -> LABORATOIRE ou SALLE_INFO)

4.3 Effectuer un matching glouton (greedy) simple :
    Trier les cours par effectifGroupe decroissant (les plus gros groupes en premier).
    Pour chaque cours, assigner la plus petite salle compatible disponible.

    Alternative plus optimale : algorithme hongrois (Hungarian algorithm)
    pour minimiser le gaspillage de capacite des salles.
    Voir Annexe B pour le pseudocode.

4.4 Si un cours n'a pas de salle compatible :
    - Ajouter a coursNonPlanifies avec raison "Aucune salle disponible a {jour} {heure}"
    - Liberer les TEACHER_HOUR correspondants ?
      Non : on laisse l'affectation enseignant mais on signale un conflit.
      Le super-admin pourra resoudre manuellement.
```

#### 7.4.5 Etape 5 : Creation des EmploiDuTemps

Pour chaque ecole :

```
5.1 Creer un EmploiDuTemps :
    ecoleId = ecole.id
    dateDebut = weekStart
    dateFin = weekStart.plusDays(5)  // samedi
    periode = SEMAINE
    statut = DRAFT

5.2 Pour chaque affectation (cours, jour, listeHeures, salle) de cette ecole :
    Pour chaque heure dans listeHeures :
        Creer un Creneau :
            emploiDuTemps = emploi cree en 5.1
            jourSemaine = jour (DayOfWeek)
            heureDebut = heure
            heureFin = heure + 60 min
            dateCreneau = date precise (weekStart + offset du jour)
            typeRecurrence = UNIQUE
            statutCreneau = RESERVE
            coursId = cours.id
            enseignantId = cours.enseignantId
            salleId = salle.id (ou null si pas de salle)
            groupeId = premier groupe du cours (ou null)

5.3 Creer la Reservation correspondante dans le booking-service :
        POST /internal/reservations
        Body : { dateReservation, heureDebut, heureFin, jourSemaine,
                 recurrence: "UNIQUE", coursId, salleId, groupeEtudiantId, enseignantId }
```

#### 7.4.6 Etape 6 : Construction de la reponse

Construire le `CampusGenerationResponse` avec les statistiques par ecole.

### 7.5 Implementation du reseau de flot

**Nouveau fichier** : `services/planning-service/src/main/java/com/timely/planningservice/algorithm/FlowNetwork.java`

Structure de donnees pour le graphe de flot :

```java
public class FlowNetwork {
    // Representation par liste d'adjacence
    // Chaque noeud est identifie par un String (ex: "COURSE_uuid", "TEACHER_HOUR_uuid_MONDAY_8")
    private final Map<String, Map<String, Integer>> capacity = new HashMap<>();
    private final Map<String, Map<String, Integer>> flow = new HashMap<>();
    private final Set<String> nodes = new HashSet<>();

    public void addEdge(String from, String to, int cap) {
        // Ajouter l'arete dans capacity[from][to] = cap
        // Ajouter l'arete inverse capacity[to][from] = 0 (pour le reseau residuel)
        // Ajouter les deux noeuds au set
    }

    public int maxFlow(String source, String sink) {
        // Edmonds-Karp : BFS pour trouver le chemin augmentant
        int totalFlow = 0;
        while (true) {
            Map<String, String> parent = new HashMap<>();
            if (!bfs(source, sink, parent)) break;

            int pathFlow = Integer.MAX_VALUE;
            for (String v = sink; !v.equals(source); v = parent.get(v)) {
                String u = parent.get(v);
                pathFlow = Math.min(pathFlow, residualCapacity(u, v));
            }

            for (String v = sink; !v.equals(source); v = parent.get(v)) {
                String u = parent.get(v);
                addFlow(u, v, pathFlow);
                addFlow(v, u, -pathFlow);
            }

            totalFlow += pathFlow;
        }
        return totalFlow;
    }

    private boolean bfs(String source, String sink, Map<String, String> parent) {
        Set<String> visited = new HashSet<>();
        Queue<String> queue = new LinkedList<>();
        queue.add(source);
        visited.add(source);

        while (!queue.isEmpty()) {
            String u = queue.poll();
            for (Map.Entry<String, Integer> entry : getNeighbors(u).entrySet()) {
                String v = entry.getKey();
                if (!visited.contains(v) && residualCapacity(u, v) > 0) {
                    visited.add(v);
                    parent.put(v, u);
                    if (v.equals(sink)) return true;
                    queue.add(v);
                }
            }
        }
        return false;
    }

    private int residualCapacity(String u, String v) {
        return getCapacity(u, v) - getFlow(u, v);
    }

    // Helpers pour acceder aux maps avec defaut 0
    // ...

    // Methode pour extraire les affectations apres le max-flow
    public Map<String, String> getAssignments(String coursePrefix) {
        // Pour chaque noeud commencant par coursePrefix,
        // trouver le PLACEMENT vers lequel le flot = 1
        // Retourner Map<courseId, "day_startHour">
    }
}
```

### 7.6 Naming convention des noeuds

```
"S"                                        -> Source
"T"                                        -> Sink
"C_{courseId}"                             -> Noeud cours
"P_{courseId}_{MONDAY}_{8}"                -> Placement : cours X, lundi, debut 8h
"H_{teacherId}_{MONDAY}_{8}"              -> Heure enseignant : prof Y, lundi, 8h
```

### 7.7 Modifier le controller

**Fichier** : `services/planning-service/src/main/java/com/timely/planningservice/controller/PlanningController.java`

Modifier le endpoint de generation :

```java
@PostMapping("/generate")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<CampusGenerationResponse> generateCampusSchedule(
        @Valid @RequestBody GeneratePlanningRequest request) {
    return ResponseEntity.ok(campusGenerationService.generate(request));
}
```

### 7.8 Complexite et performance

Pour un campus typique :
- 4 ecoles, ~15 cours par ecole = ~60 cours
- ~20 enseignants uniques
- 48 creneaux/semaine

Taille du graphe :
- Noeuds : ~60 (cours) + ~60*10 (placements) + ~20*48 (teacher-hours) + 2 (source/sink) ≈ 1600
- Aretes : ~60 + ~600 + ~600*4 + ~960 ≈ 4000

Edmonds-Karp : O(V * E^2) = O(1600 * 4000^2) ≈ 25 milliards dans le pire cas theorique, mais en pratique le nombre de chemins augmentants est bien plus faible. Le calcul devrait prendre < 1 seconde.

### 7.9 Criteres d'acceptation Phase 4

- [ ] `POST /api/planning/generate` avec `{ weekStart: "2026-04-06" }` genere N EmploiDuTemps (1 par ecole)
- [ ] Aucun enseignant n'est programme dans 2 salles/ecoles au meme moment
- [ ] Les cours CM sont places avant les TD, qui sont places avant les TP
- [ ] Un cours de 4h est place en bloc consecutif de 4 creneaux d'1h
- [ ] Le bloc ne chevauche pas la pause dejeuner
- [ ] Si un enseignant a 6h dispo et 2 ecoles demandent 4h chacune, le max-flow place 6h au total (pas 4+4=8)
- [ ] Les salles sont assignees par ecole sans double-reservation
- [ ] Les cours non planifies ont une raison explicite
- [ ] Le temps de generation < 5 secondes pour le campus complet

---

## 8. Phase 5 -- Refonte frontend UI/UX

> **Objectif** : Redesigner l'interface pour supporter la generation campus-wide, les vues filtrees, et la grille lundi-samedi avec pause.
> **Prerequis** : Phase 0, Phase 2, Phase 4 (backend fonctionnel)
> **Livrable** : Interface admin complete avec filtres, grille correcte, et vues par role.

### 8.1 Refonte du Schedule Generator

**Fichiers** : `schedule-generator.component.ts` + `.html`

**Nouveau design** :

```
+--------------------------------------------------------------------+
|  Generer les emplois du temps                                      |
|  Campus IUSJC -- Semaine du [  date picker  ]                     |
|                                                                    |
|  [ Generer les emplois du temps ]                                 |
+--------------------------------------------------------------------+

(Apres generation reussie :)

+--------------------------------------------------------------------+
|  Generation terminee -- 4 ecoles traitees                          |
|                                                                    |
|  +---------------------+  +---------------------+                |
|  | SJI                 |  | SJM                 |                |
|  | 15/18 cours (83.3%) |  | 12/12 cours (100%)  |                |
|  | [Voir l'EDT]        |  | [Voir l'EDT]        |                |
|  +---------------------+  +---------------------+                |
|  +---------------------+  +---------------------+                |
|  | CPGE                |  | PrepaVogt           |                |
|  | 8/8 cours (100%)    |  | 6/7 cours (85.7%)   |                |
|  | [Voir l'EDT]        |  | [Voir l'EDT]        |                |
|  +---------------------+  +---------------------+                |
|                                                                    |
|  Duree totale : 1.23s | Total : 41/45 cours (91.1%)              |
|                                                                    |
|  Cours non planifies (4) :                                        |
|  - Algorithmique avancee (SJI) : Aucun bloc de 4h dispo          |
|  - ...                                                            |
+--------------------------------------------------------------------+
```

**Modifications TypeScript** :
- Adapter le `GeneratePlanningResponse` au nouveau `CampusGenerationResponse`
- Le bouton "Voir l'EDT" navigue vers `/admin/schedule/viewer/{emploiDuTempsId}`
- Afficher les resultats par ecole dans des cards

### 8.2 Refonte du Schedule Viewer

**Fichiers** : `schedule-viewer.component.ts` + `.html`

#### 8.2.1 Barre de filtrage

Ajouter en haut de la page une barre de filtres :

```
+--------------------------------------------------------------------+
|  Emploi du temps -- Semaine du 6 avril 2026                        |
|  Ecole : [SJI v]  |  Vue : [Par salle v]                         |
|  Filtre : [Amphi A v]                                             |
+--------------------------------------------------------------------+
```

Le dropdown "Vue" a 3 options :
- **Par salle** : le dropdown "Filtre" affiche les salles de l'ecole
- **Par classe** : le dropdown "Filtre" affiche les classes de l'ecole
- **Par enseignant** : le dropdown "Filtre" affiche les enseignants

Quand on change la vue ou le filtre, la grille se met a jour en filtrant les creneaux :
- Par salle : `creneaux.filter(c => c.salleId === selectedSalleId)`
- Par classe : filtrer par `groupeId` (le groupe appartient a une classe)
- Par enseignant : `creneaux.filter(c => c.enseignantId === selectedEnseignantId)`

**Pour recuperer les noms** (salle, enseignant, cours) a afficher dans les cellules de la grille, il faut enrichir le `CreneauResponseDTO` avec les noms (pas seulement les IDs). Modifier :

**Fichier backend** : `CreneauResponseDTO.java`

Ajouter :
```java
private String coursIntitule;
private String coursType;  // CM, TD, TP
private String enseignantNom;
private String salleNom;
private String groupeNom;
```

**Fichier backend** : Le mapper `CreneauMapper.java` devra remplir ces champs. Comme les cours/salles/enseignants sont dans d'autres microservices, deux approches :
1. **Approche recommandee** : lors de la creation du creneau (dans CampusScheduleGenerationService), stocker directement les noms dans le creneau (colonnes supplementaires dans la table creneaux)
2. Alternative : un endpoint qui enrichit les creneaux a la volee (plus couteux)

**Approche retenue (1)** -- Ajouter les colonnes de denormalisation a l'entite `Creneau.java` :
```java
@Column(name = "cours_intitule")
private String coursIntitule;

@Column(name = "cours_type", length = 10)
private String coursType;

@Column(name = "enseignant_nom")
private String enseignantNom;

@Column(name = "salle_nom")
private String salleNom;

@Column(name = "groupe_nom")
private String groupeNom;
```

Et migration SQL :
```sql
-- Dans V3__add_creneau_display_fields.sql
ALTER TABLE creneaux ADD COLUMN cours_intitule VARCHAR(255);
ALTER TABLE creneaux ADD COLUMN cours_type VARCHAR(10);
ALTER TABLE creneaux ADD COLUMN enseignant_nom VARCHAR(255);
ALTER TABLE creneaux ADD COLUMN salle_nom VARCHAR(255);
ALTER TABLE creneaux ADD COLUMN groupe_nom VARCHAR(255);
```

Le `CampusScheduleGenerationService` remplira ces champs lors de la creation de chaque creneau.

#### 8.2.2 Grille hebdomadaire

**Modifications du composant `schedule-grid`** (`shared/components/schedule-grid/`) :

```
+--------+----------+----------+----------+----------+----------+----------+
|        |  Lundi   |  Mardi   | Mercredi |  Jeudi   | Vendredi | Samedi   |
+--------+----------+----------+----------+----------+----------+----------+
| 08-09  |  [cell]  |  [cell]  |  [cell]  |  [cell]  |  [cell]  |  [cell]  |
| 09-10  |  [cell]  |  [cell]  |  [cell]  |  [cell]  |  [cell]  |  [cell]  |
| 10-11  |  [cell]  |  [cell]  |  [cell]  |  [cell]  |  [cell]  |  [cell]  |
| 11-12  |  [cell]  |  [cell]  |  [cell]  |  [cell]  |  [cell]  |  [cell]  |
| 12-13  |          P  A  U  S  E     D  E  J  E  U  N  E  R              |
| 13-14  |  [cell]  |  [cell]  |  [cell]  |  [cell]  |  [cell]  |  [cell]  |
| 14-15  |  [cell]  |  [cell]  |  [cell]  |  [cell]  |  [cell]  |  [cell]  |
| 15-16  |  [cell]  |  [cell]  |  [cell]  |  [cell]  |  [cell]  |  [cell]  |
| 16-17  |  [cell]  |  [cell]  |  [cell]  |  [cell]  |  [cell]  |  [cell]  |
+--------+----------+----------+----------+----------+----------+----------+
```

Chaque cellule [cell] occupee affiche :
```
+-------------------+
| Algo. avancee     |  <- cours intitule (tronque si long)
| CM                |  <- badge type (bleu=CM, vert=TD, orange=TP)
| Prof. Dupont      |  <- enseignant nom
| Salle A102        |  <- salle nom
+-------------------+
```

Couleur de fond de la cellule selon le type de cours :
- CM : `bg-blue-50 border-blue-300`
- TD : `bg-green-50 border-green-300`
- TP : `bg-amber-50 border-amber-300`

**Modifications specifiques dans `schedule-grid.component.ts`** :

1. Changer `daysOfWeek` par defaut pour inclure `SATURDAY` :
```typescript
@Input() daysOfWeek: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
```

2. Generer les `timeSlots` de facon deterministe (pas depuis les creneaux) :
```typescript
readonly fixedTimeSlots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
```
La grille montre toujours les 8 lignes + la ligne pause, meme si certains creneaux sont vides.

3. Ajouter la ligne "Pause dejeuner" entre 11:00 et 13:00 dans le template HTML : une ligne `<tr>` avec un `<td colspan="7">` grise affichant "Pause dejeuner 12h-13h".

4. Modifier le CSS : passer de 5 a 6 colonnes :
```scss
td:not(:first-child) { width: calc((100% - 100px) / 6); }
```

5. La coloration des cellules utilise `coursType` au lieu de `statutCreneau` :
```typescript
getCreneauColor(creneau: CreneauResponse): string {
    switch (creneau.coursType) {
        case 'CM': return 'bg-blue-50 hover:bg-blue-100 border-blue-300';
        case 'TD': return 'bg-green-50 hover:bg-green-100 border-green-300';
        case 'TP': return 'bg-amber-50 hover:bg-amber-100 border-amber-300';
        default: return 'bg-gray-50 hover:bg-gray-100 border-gray-200';
    }
}
```

#### 8.2.3 Mise a jour du modele `CreneauResponse`

**Fichier** : `timely-frontend/src/app/core/models/planning.model.ts`

Ajouter a `CreneauResponse` :
```typescript
coursIntitule?: string;
coursType?: string;
enseignantNom?: string;
salleNom?: string;
groupeNom?: string;
```

Modifier `CampusGenerationResponse` (ou creer si inexistant) pour correspondre au nouveau DTO backend.

### 8.3 Vue enseignant

**Fichier** : `timely-frontend/src/app/features/teacher/schedule/teacher-schedule.component.ts`

Remplacer le stub par un composant fonctionnel :

```
1. Au chargement, recuperer l'ID de l'enseignant connecte (depuis le token JWT ou un service auth)
2. Recuperer la liste des EmploiDuTemps publies (statut PUBLISHED) pour la semaine courante
3. Pour chaque EmploiDuTemps, filtrer les creneaux ou enseignantId == currentUserId
4. Fusionner tous ces creneaux (de toutes les ecoles) dans une seule grille
5. Afficher la grille via le composant schedule-grid
```

**Layout** :
```
+--------------------------------------------------------------------+
|  Mon emploi du temps -- Semaine du 6 avril 2026                    |
|  [ < Semaine precedente ]  [ Semaine suivante > ]                 |
+--------------------------------------------------------------------+
|  [      Grille schedule-grid avec mes creneaux      ]              |
+--------------------------------------------------------------------+
|  [ Modifier mes disponibilites pour la semaine prochaine ]         |
+--------------------------------------------------------------------+
```

Le bouton "Modifier mes disponibilites" navigue vers `/teacher/availability` avec un parametre de semaine.

**Nouvel endpoint necessaire dans planning-service** (ou via gateway) :

```
GET /api/planning/emplois-du-temps/enseignant/{enseignantId}?weekStart=2026-04-06
```

Retourne les creneaux de l'enseignant pour cette semaine, toutes ecoles confondues. Le backend fait une requete `findByEnseignantIdAndDateCreneauBetween(enseignantId, weekStart, weekEnd)` sur la table creneaux.

### 8.4 Liste des emplois du temps

**Fichier** : `schedule-list.component.ts`

Modifier pour :
1. Afficher le nom de l'ecole (pas juste l'ecoleId)
2. Grouper par semaine
3. Ajouter un filtre par ecole

### 8.5 Correction du bug route enseignant (B6)

**Fichier** : `timely-frontend/src/app/features/teacher/teacher.routes.ts`

Ligne 33 : changer `path: 'schedule'` en `path: 'profile'` :
```typescript
{
    path: 'profile',      // etait 'schedule' par erreur
    loadComponent: () =>
        import('./profile/teacher-profile.component').then(
            (m) => m.TeacherProfileComponent
        ),
},
```

### 8.6 Criteres d'acceptation Phase 5

- [ ] La grille affiche 6 jours (lun-sam) et 8 creneaux + pause dejeuner
- [ ] Le generateur ne demande qu'une date de lundi
- [ ] Le resultat montre les stats par ecole avec liens vers chaque EDT
- [ ] Le viewer a 3 vues : par salle, par classe, par enseignant
- [ ] Les cellules affichent : nom du cours, type (badge couleur), nom du prof, nom de la salle
- [ ] La vue enseignant affiche ses creneaux de toutes les ecoles fusionnes
- [ ] La route `/teacher/profile` fonctionne (bug corrige)

---

## 9. Phase 6 -- Integration Agora

> **Objectif** : Permettre l'envoi de l'emploi du temps d'une classe aux etudiants via Agora.
> **Prerequis** : Phase 5
> **Livrable** : Bouton "Envoyer aux etudiants" fonctionnel.

### 9.1 Backend

Ajouter un endpoint dans `planning-service` :

```
POST /api/planning/emplois-du-temps/{id}/send-to-students
Body: { classeId: UUID, groupeId: UUID (optionnel) }
```

Logique :
1. Recuperer l'EmploiDuTemps par id
2. Filtrer les creneaux par groupeId (ou par classeId en recuperant les groupes de la classe)
3. Formatter le planning en message texte lisible
4. Appeler le service Agora via un `AgoraServiceClient` (Feign) :
   ```
   POST /internal/messages/broadcast
   Body: { channelId: groupeId, content: planningFormate, type: "SCHEDULE" }
   ```

### 9.2 Frontend

Dans le `schedule-viewer` (vue admin), ajouter un bouton "Envoyer aux etudiants" visible quand :
- Le filtre actif est "Par classe"
- L'EDT est en statut PUBLISHED

Le bouton ouvre un modal de confirmation avec le nom de la classe et du groupe, puis appelle l'endpoint.

### 9.3 Criteres d'acceptation Phase 6

- [ ] Le bouton "Envoyer aux etudiants" est visible en vue "Par classe" quand l'EDT est publie
- [ ] L'appel au service Agora est effectue (ou loggue si Agora n'est pas disponible)
- [ ] Un toast de confirmation s'affiche

---

## 10. Phase 7 -- Seed data

> **Objectif** : Creer un jeu de donnees complet pour tester la generation.
> **Prerequis** : Phase 0, Phase 1
> **Livrable** : Scripts SQL executables pour les 3 bases (user, booking, planning).

### 10.1 Donnees a inserer

#### 10.1.1 Ecoles (booking-service)

| Ecole | Code | Adresse |
|-------|------|---------|
| Saint Jean Ingenieur | SJI | Campus IUSJC |
| Saint Jean Management | SJM | Campus IUSJC |
| Classes Preparatoires aux Grandes Ecoles | CPGE | Campus IUSJC |
| PrepaVogt | PV | Campus IUSJC |

#### 10.1.2 Filieres et classes

**SJI** :

| Filiere | CycleType | Classes |
|---------|-----------|---------|
| Genie Informatique | CYCLE_INGENIEUR | CI1-GI, CI2-GI, CI3-GI |
| Genie Civil | CYCLE_INGENIEUR | CI1-GC, CI2-GC |
| Prepa Ingenieur | PREPA_INGENIEUR | CP1, CP2 |
| Informatique Licence | LICENCE | L1-INFO, L2-INFO, L3-INFO |

**SJM** :

| Filiere | CycleType | Classes |
|---------|-----------|---------|
| Comptabilite-Finance | LICENCE | L1-CF, L2-CF, L3-CF |
| Marketing | MASTER | M1-MKT, M2-MKT |

**CPGE** :

| Filiere | CycleType | Classes |
|---------|-----------|---------|
| MPSI | CPGE | CPGE1-MPSI, CPGE2-MPSI |

**PrepaVogt** :

| Filiere | CycleType | Classes |
|---------|-----------|---------|
| Preparatoire Scientifique | PREPA_VOGT | PV1-SCI, PV2-SCI |

#### 10.1.3 Salles (booking-service)

| Ecole | Salle | Type | Capacite |
|-------|-------|------|----------|
| SJI | Amphi Einstein | AMPHITHEATRE | 200 |
| SJI | Salle A101 | SALLE_COURS | 50 |
| SJI | Salle A102 | SALLE_COURS | 50 |
| SJI | Labo Info 1 | SALLE_INFORMATIQUE | 30 |
| SJI | Labo Info 2 | SALLE_INFORMATIQUE | 30 |
| SJM | Amphi B | AMPHITHEATRE | 150 |
| SJM | Salle B201 | SALLE_COURS | 40 |
| SJM | Salle B202 | SALLE_COURS | 40 |
| CPGE | Salle C101 | SALLE_COURS | 45 |
| CPGE | Salle C102 | SALLE_COURS | 45 |
| PV | Salle D101 | SALLE_COURS | 40 |
| PV | Salle D102 | SALLE_COURS | 40 |

#### 10.1.4 Enseignants (user-service)

| Nom | Prenom | Grade | Ecoles | Specialite |
|-----|--------|-------|--------|-----------|
| Dupont | Jean | Professeur | SJI, CPGE | Mathematiques |
| Martin | Sophie | Maitre de conferences | SJI, SJM | Informatique |
| Leclerc | Pierre | Professeur | SJM | Finance |
| Nguyen | Linh | Charge de cours | SJI | Genie Civil |
| Kamga | Paul | Professeur | CPGE, PV | Physique |
| Mbarga | Aline | Maitre de conferences | SJI | Informatique |

**Disponibilites (template)** : Chaque enseignant est disponible environ 20-30h/semaine (details dans le script SQL).

#### 10.1.5 UEs et Cours (booking-service)

Environ 15-20 cours repartis sur les 4 ecoles, avec des enseignants partages.

Exemples :

| Cours | Ecole | Type | Volume | Enseignant |
|-------|-------|------|--------|-----------|
| Analyse I | SJI-CP1 | CM | 4h | Dupont |
| Analyse I - TD | SJI-CP1 | TD | 2h | Dupont |
| Algebre | CPGE1 | CM | 4h | Dupont | <-- meme enseignant, autre ecole |
| Algo & Structures | SJI-CI1 | CM | 3h | Martin |
| Programmation C | SJI-CI1 | TP | 2h | Mbarga |
| Base de donnees | SJI-CI2 | CM | 3h | Martin |
| Systemes Info | SJM-L2 | CM | 2h | Martin | <-- meme enseignant, autre ecole |
| Comptabilite | SJM-L1 | CM | 3h | Leclerc |
| Mecanique | SJI-CP1 | CM | 3h | Nguyen |
| Physique Generale | CPGE1 | CM | 4h | Kamga |
| Physique Generale | PV1 | CM | 3h | Kamga | <-- meme enseignant, autre ecole |

Ce jeu de donnees permet de tester :
- La generation multi-ecoles
- Le partage d'enseignants (Dupont entre SJI et CPGE, Martin entre SJI et SJM, Kamga entre CPGE et PV)
- Les blocs consecutifs (4h d'Analyse I)
- La priorite CM > TD > TP

### 10.2 Format des scripts

Creer 3 fichiers de seed :
- `docs/seed/seed-booking-service.sql` (ecoles, filieres, classes, UEs, cours, salles, groupes)
- `docs/seed/seed-user-service.sql` (enseignants, disponibilites, IntervenirEcole, Enseigner)
- `docs/seed/seed-planning-service.sql` (vide -- les EDT sont generes par l'algo)

**IMPORTANT** : utiliser des UUIDs deterministes (ex: `'11111111-1111-1111-1111-111111111101'` pour SJI, etc.) pour faciliter les references croisees entre les 3 scripts.

### 10.3 Criteres d'acceptation Phase 7

- [ ] Les 3 scripts s'executent sans erreur sur des bases vides
- [ ] Les 4 ecoles existent avec leurs filieres, classes, et salles
- [ ] Les 6 enseignants existent avec disponibilites et affectations ecoles/cours
- [ ] La generation d'EDT sur ces donnees produit un resultat non trivial (au moins 80% de reussite)
- [ ] Le conflit d'enseignant partage (ex: Dupont SJI/CPGE) est correctement gere

---

## 11. Ordre d'execution

```
Phase 0 (enums)            ─┐
Phase 1 (niveaux)           │──> peuvent etre en parallele
Phase 7 (seed data)        ─┘
                              │
Phase 2 (grille)            <─┘ depend de Phase 0
Phase 3 (disponibilites)    <── independant, mais utile pour Phase 4
                              │
Phase 4 (algorithme)        <── depend de Phase 0 + 2 + 3
                              │
Phase 5 (frontend)          <── depend de Phase 4 (backend fonctionnel)
                              │
Phase 6 (Agora)             <── depend de Phase 5
```

**Chemin critique** : Phase 0 -> Phase 2 -> Phase 3 -> Phase 4 -> Phase 5 -> Phase 6

Phase 1 et Phase 7 sont sur un chemin parallele et peuvent etre faites en meme temps que Phase 0.

---

## 12. Annexe A -- Pseudocode de l'algorithme Ford-Fulkerson

```
FONCTION generateCampusSchedule(weekStart):
    -- Etape 1 : Collecte
    ecoles       = bookingClient.getAllEcoles()
    coursesByEcole = {}
    POUR CHAQUE ecole DANS ecoles:
        coursesByEcole[ecole.id] = bookingClient.getCoursByEcole(ecole.id)

    allCourses   = aplatir(coursesByEcole)
    teacherIds   = extraireUnique(allCourses, c -> c.enseignantId)
    availabilities = {}
    POUR CHAQUE tid DANS teacherIds:
        availabilities[tid] = userClient.getDisponibilitesSemaine(tid, weekStart)

    roomsByEcole = {}
    POUR CHAQUE ecole DANS ecoles:
        roomsByEcole[ecole.id] = bookingClient.getSallesByEcole(ecole.id)

    -- Etape 2 : Pre-traitement
    courseInfos = []
    POUR CHAQUE cours DANS allCourses:
        info = preprocessCourse(cours, availabilities, weekStart)
        courseInfos.ajouter(info)

    -- Etape 3 : Affectation par priorite
    usedTeacherHours = ensemble vide   -- Set<(teacherId, day, hour)>
    assignments      = {}              -- Map<courseId, (day, startHour)>
    unscheduled      = []

    POUR CHAQUE type DANS [CM, TD, TP]:
        coursesOfType = courseInfos.filtrer(c -> c.type == type ET c.schedulable)
        network = construireReseau(coursesOfType, usedTeacherHours)
        maxFlow = network.edmondsKarp("S", "T")

        POUR CHAQUE assignation DANS network.extraireAssignations():
            assignments[assignation.courseId] = (assignation.day, assignation.startHour)
            -- Marquer les heures enseignant comme utilisees
            POUR h = assignation.startHour .. startHour + requiredHours - 1:
                SI h == 12: SAUTER (pause)
                usedTeacherHours.ajouter((cours.enseignantId, assignation.day, h))

        POUR CHAQUE cours non assigne dans cette passe:
            unscheduled.ajouter(cours, "Pas de creneau disponible")

    -- Etape 4 : Affectation des salles
    POUR CHAQUE ecole DANS ecoles:
        ecoleAssignments = assignments.filtrer(ecole)
        POUR CHAQUE (jour, heure) ou des cours sont places:
            coursesAtSlot = getCourses(ecoleAssignments, jour, heure)
            availableRooms = roomsByEcole[ecole.id].filtrer(non occupee a jour+heure)
            matching = greedyRoomMatch(coursesAtSlot, availableRooms)
            -- Si un cours n'a pas de salle : ajouter a unscheduled

    -- Etape 5 : Creer les EmploiDuTemps
    POUR CHAQUE ecole DANS ecoles:
        edt = creerEmploiDuTemps(ecole, weekStart)
        POUR CHAQUE (course, day, startHour, room) de cette ecole:
            POUR h = startHour .. startHour + course.volumeHoraire - 1:
                SI h == 12: SAUTER
                creerCreneau(edt, day, h, h+1, course, room)
                creerReservation(course, room, day, h)

    RETOURNER resultats par ecole


FONCTION construireReseau(courses, usedTeacherHours):
    network = nouveau FlowNetwork()
    POUR CHAQUE cours DANS courses:
        network.addEdge("S", "C_" + cours.id, 1)
        POUR CHAQUE placement (day, startHour) valide pour cours:
            placementId = "P_" + cours.id + "_" + day + "_" + startHour
            network.addEdge("C_" + cours.id, placementId, 1)
            POUR h = startHour .. startHour + cours.requiredHours - 1:
                SI h == 12: SAUTER
                hourId = "H_" + cours.enseignantId + "_" + day + "_" + h
                SI (cours.enseignantId, day, h) PAS DANS usedTeacherHours:
                    network.addEdge(placementId, hourId, 1)
                    network.addEdge(hourId, "T", 1)
    RETOURNER network


FONCTION preprocessCourse(cours, availabilities, weekStart):
    info = nouveau CourseInfo()
    info.cours = cours
    SI cours.enseignantId == null:
        info.schedulable = false
        info.reason = "Aucun enseignant assigne"
        RETOURNER info

    info.requiredHours = cours.volumeHoraire
    SI info.requiredHours > 8:
        info.schedulable = false
        info.reason = "Volume horaire > 8h"
        RETOURNER info

    dispo = availabilities[cours.enseignantId]
    info.validPlacements = []

    POUR CHAQUE day DANS [MONDAY..SATURDAY]:
        slotStarts = [8, 9, 10, 11, 13, 14, 15, 16]
        POUR CHAQUE startHour DANS slotStarts:
            -- Verifier que le bloc de N heures tient dans la journee
            blockHours = []
            h = startHour
            TANT QUE taille(blockHours) < info.requiredHours ET h <= 16:
                SI h == 12:
                    SORTIR DE LA BOUCLE  -- pause coupe le bloc
                blockHours.ajouter(h)
                h = h + 1

            SI taille(blockHours) == info.requiredHours:
                -- Verifier que l'enseignant est dispo pour chaque heure
                allAvailable = VRAI
                POUR CHAQUE bh DANS blockHours:
                    SI enseignant PAS dispo a (day, bh, bh+1):
                        allAvailable = FAUX
                        SORTIR
                SI allAvailable:
                    info.validPlacements.ajouter((day, startHour))

    SI info.validPlacements est vide:
        info.schedulable = false
        info.reason = "Aucun bloc consecutif de " + info.requiredHours + "h disponible"
    SINON:
        info.schedulable = true
        info.constraintScore = taille(info.validPlacements) / info.requiredHours

    RETOURNER info
```

---

## 13. Annexe B -- Pseudocode de l'affectation des salles

```
FONCTION greedyRoomMatch(coursesAtSlot, availableRooms):
    -- Trier les cours par effectif decroissant (les gros groupes d'abord)
    courses = trier(coursesAtSlot, par effectifGroupe DESC)
    -- Trier les salles par capacite croissante (best-fit)
    rooms = trier(availableRooms, par capacite ASC)

    assignments = {}
    usedRooms = ensemble vide

    POUR CHAQUE cours DANS courses:
        bestRoom = null
        POUR CHAQUE room DANS rooms:
            SI room.id DANS usedRooms: CONTINUER
            SI room.capacite < cours.effectifGroupe: CONTINUER
            -- Optionnel : verifier compatibilite type (TP -> LABO)
            bestRoom = room
            SORTIR  -- premiere salle compatible = plus petite possible (best-fit)

        SI bestRoom != null:
            assignments[cours.id] = bestRoom
            usedRooms.ajouter(bestRoom.id)
        SINON:
            -- Pas de salle disponible pour ce cours a cet horaire
            marquerCommeNonPlanifiable(cours, "Aucune salle disponible")

    RETOURNER assignments
```

Pour une version optimale (Hungarian algorithm), utiliser une matrice de couts :
- `cost[i][j] = room[j].capacite - course[i].effectif` (gaspillage de places)
- Minimiser le cout total donne l'affectation optimale.

La librairie Java `org.apache.commons:commons-math3` contient `HungarianAlgorithm` si on veut cette optimisation. Pour le MVP, le greedy best-fit suffit.

---

## 14. Annexe C -- Schema du reseau de flot

```
                    cap=1         cap=1              cap=1          cap=1
  [SOURCE] ───────> [C_cours1] ────> [P_c1_MON_8] ────> [H_prof1_MON_8] ────> [SINK]
     │                  │                  │                                      ^
     │                  │                  └──> [H_prof1_MON_9] ────────────────┘
     │                  │                  └──> [H_prof1_MON_10] ───────────────┘
     │                  │                  └──> [H_prof1_MON_11] ───────────────┘
     │                  │
     │                  └───> [P_c1_TUE_8] ────> [H_prof1_TUE_8] ─────────────┘
     │                            │                                             ^
     │                            └──> [H_prof1_TUE_9] ────────────────────────┘
     │                            └──> [H_prof1_TUE_10] ───────────────────────┘
     │                            └──> [H_prof1_TUE_11] ───────────────────────┘
     │
     │  cap=1         cap=1              cap=1
     └───> [C_cours2] ────> [P_c2_MON_8] ────> [H_prof1_MON_8] (meme noeud!)
                │                  └──> [H_prof1_MON_9]
                │
                └───> [P_c2_WED_13] ────> [H_prof1_WED_13]
                           └──> [H_prof1_WED_14]

LEGENDE :
  C_cours1 = "Analyse I" (CM, 4h, SJI, Prof Dupont)
  C_cours2 = "Algebre" (CM, 2h, CPGE, Prof Dupont)  <-- MEME ENSEIGNANT

  Le noeud H_prof1_MON_8 a capacite 1 vers SINK.
  Si cours1 l'utilise, cours2 ne peut pas l'utiliser au meme moment.
  Ford-Fulkerson trouvera automatiquement un chemin alternatif pour cours2
  (ex: mercredi au lieu de lundi) si possible.
```

---

## 15. Annexe D -- Structure des 4 ecoles du campus IUSJC

```
Campus IUSJC
├── Saint Jean Ingenieur (SJI)
│   ├── Filiere Genie Informatique (CYCLE_INGENIEUR)
│   │   ├── CI1-GI (effectif ~40)
│   │   ├── CI2-GI (effectif ~35)
│   │   └── CI3-GI (effectif ~30)
│   ├── Filiere Genie Civil (CYCLE_INGENIEUR)
│   │   ├── CI1-GC (effectif ~35)
│   │   └── CI2-GC (effectif ~30)
│   ├── Filiere Prepa Ingenieur (PREPA_INGENIEUR)
│   │   ├── CP1 (effectif ~60)
│   │   └── CP2 (effectif ~50)
│   └── Filiere Informatique Licence (LICENCE)
│       ├── L1-INFO (effectif ~80)
│       ├── L2-INFO (effectif ~60)
│       └── L3-INFO (effectif ~45)
│
├── Saint Jean Management (SJM)
│   ├── Filiere Comptabilite-Finance (LICENCE)
│   │   ├── L1-CF (effectif ~70)
│   │   ├── L2-CF (effectif ~55)
│   │   └── L3-CF (effectif ~40)
│   └── Filiere Marketing (MASTER)
│       ├── M1-MKT (effectif ~35)
│       └── M2-MKT (effectif ~25)
│
├── CPGE
│   └── Filiere MPSI (CPGE)
│       ├── CPGE1-MPSI (effectif ~45)
│       └── CPGE2-MPSI (effectif ~40)
│
└── PrepaVogt (PV)
    └── Filiere Preparatoire Scientifique (PREPA_VOGT)
        ├── PV1-SCI (effectif ~50)
        └── PV2-SCI (effectif ~45)
```
