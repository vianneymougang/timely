# Architecture Microservices - Système de Gestion des Emplois du Temps IUSJC

## Vue d'Ensemble de l'Architecture

L'application est structurée selon une architecture microservices permettant scalabilité, maintenabilité et déploiement indépendant. Chaque service est autonome avec sa propre base de données (pattern Database per Service). La communication entre services se fait principalement via des API REST synchrones, orchestrées par une API Gateway centrale.

### Stack Technologique Commune
- **Framework :** Spring Boot 3.x
- **Langage :** Java 17+
- **Build Tool :** Maven
- **Communication :** REST API (synchrone)
- **Découverte :** Eureka Client
- **Documentation API :** SpringDoc OpenAPI (Swagger)

---

## 1. 🌐 API Gateway Service

### Description
Point d'entrée unique pour toutes les requêtes clients. Assure le routage intelligent vers les microservices, la validation des tokens JWT, le rate limiting et la gestion globale des erreurs. Agit comme une couche de sécurité et d'abstraction entre le client et les services métier.

### Technologies
- Spring Cloud Gateway, Spring Security, Resilience4j, Redis (cache)

### Port
`8080`

### Base de Données
Redis (cache de routes, rate limiting)

### Endpoints
- `POST /api/auth/**` → Route vers Auth Service
- `GET/POST/PUT/DELETE /api/users/**` → Route vers User Service
- `GET/POST/PUT/DELETE /api/planning/**` → Route vers Planning Service
- `GET/POST/PUT/DELETE /api/bookings/**` → Route vers Booking Service
- `POST /api/notifications/**` → Route vers Notification Service
- `GET/POST /api/reports/**` → Route vers Report Service
- `POST /api/agora/**` → Route vers Agora Integration Service

### Responsabilités Clés
- Routage dynamique avec load balancing
- Validation JWT pour toutes les requêtes (sauf authentification)
- Rate limiting par IP/utilisateur
- Circuit breaker pour résilience
- Logging centralisé des requêtes

---

## 2. 📡 Service Registry (Eureka Server)

### Description
Serveur de découverte de services permettant l'enregistrement automatique de tous les microservices au démarrage. Fournit un mécanisme de health check périodique et facilite le load balancing côté client. Expose un dashboard web pour la supervision des instances.

### Technologies
- Spring Cloud Netflix Eureka Server

### Port
`8761`

### Base de Données
Aucune (registre en mémoire)

### Endpoints
- `GET /eureka/apps` → Liste des services enregistrés
- `GET /eureka/apps/{serviceName}` → Détails d'un service

### Dashboard
`http://localhost:8761` - Interface de supervision temps réel

---

## 3. 🔐 Auth Service

### Description
Service d'authentification centralisé gérant la création et validation des tokens JWT. Implémente un système de refresh tokens pour la gestion des sessions longues. Maintient une blacklist Redis des tokens révoqués pour la déconnexion. Gère les rôles (ADMINISTRATEUR, ENSEIGNANT) et permissions associées.

### Technologies
- Spring Security, JWT (jjwt library), BCrypt, Redis

### Port
`8081`

### Base de Données
PostgreSQL (`auth_db`) : utilisateurs, roles, permissions, refresh_tokens

### Endpoints
- `POST /login` - Authentification utilisateur
- `POST /refresh` - Renouvellement token
- `POST /logout` - Déconnexion et révocation token
- `GET /validate` - Validation token JWT
- `POST /register` - Inscription nouveau compte (admin only)

### Structure JWT
```
{
  sub: userId,
  email: email,
  role: ADMINISTRATEUR/ENSEIGNANT,
  permissions: [array],
  iat: timestamp,
  exp: timestamp
}
```

---

## 4. 👥 User Service

### Description
Gestion complète des utilisateurs du système (administrateurs et enseignants). Permet aux enseignants de déclarer leurs disponibilités hebdomadaires par école d'intervention. Gère les affectations enseignants-écoles et enseignants-cours. Vérifie automatiquement les chevauchements de disponibilités et calcule la charge horaire annuelle.

### Technologies
- Spring Data JPA, PostgreSQL, MapStruct, Bean Validation

### Port
`8082`

### Base de Données
PostgreSQL (`user_db`) : utilisateurs, administrateurs, enseignants, disponibilites, intervenir_ecole, enseigner

### Endpoints - Gestion Utilisateurs
- `POST /users` - Créer utilisateur
- `GET /users/{id}` - Consulter utilisateur
- `PUT /users/{id}` - Modifier utilisateur
- `DELETE /users/{id}` - Supprimer utilisateur
- `GET /users` - Lister utilisateurs (avec pagination/filtres)

### Endpoints - Disponibilités Enseignants
- `GET /users/{enseignantId}/disponibilites` - Consulter disponibilités
- `POST /users/{enseignantId}/disponibilites` - Ajouter disponibilité
- `PUT /users/{enseignantId}/disponibilites/{id}` - Modifier disponibilité
- `DELETE /users/{enseignantId}/disponibilites/{id}` - Supprimer disponibilité

### Endpoints - Affectations
- `POST /users/{enseignantId}/ecoles/{ecoleId}` - Assigner à une école
- `GET /users/{enseignantId}/cours` - Lister cours enseignés
- `POST /users/{enseignantId}/cours/{coursId}` - Assigner à un cours
- `GET /users/{enseignantId}/charge-horaire` - Calculer charge horaire

---

## 5. 📅 Planning Service

### Description
Cœur du système, responsable de la génération automatique des emplois du temps. Utilise des algorithmes heuristiques pour optimiser la planification en tenant compte des disponibilités enseignants, capacités des salles et contraintes multiples. Détecte automatiquement les conflits (enseignant/salle/groupe) et propose des solutions alternatives. Gère le cycle de vie des emplois du temps (brouillon → validé → publié).

### Technologies
- Spring Data JPA, PostgreSQL, Algorithmes d'optimisation, Spring Events

### Port
`8083`

### Base de Données
PostgreSQL (`planning_db`) : emplois_du_temps, creneaux, conflits

### Endpoints - Génération et Gestion
- `POST /plannings/generate` - Générer emploi du temps automatiquement
- `GET /plannings/{id}` - Consulter emploi du temps
- `PUT /plannings/{id}/creneaux/{creneauId}` - Modifier créneau manuellement
- `POST /plannings/{id}/validate` - Valider emploi du temps
- `POST /plannings/{id}/publish` - Publier emploi du temps
- `DELETE /plannings/{id}` - Supprimer emploi du temps

### Endpoints - Conflits
- `GET /plannings/{id}/conflits` - Lister conflits détectés
- `POST /plannings/{id}/conflits/{conflitId}/resolve` - Appliquer solution
- `GET /plannings/{id}/conflits/{conflitId}/suggestions` - Obtenir solutions

### Endpoints - Consultation
- `GET /plannings/search` - Rechercher emplois du temps (par école/enseignant/salle/groupe/semaine)
- `GET /plannings/{id}/export/pdf` - Exporter en PDF
- `GET /plannings/{id}/export/ical` - Exporter format iCalendar

---

## 6. 🏢 Booking Service

### Description
Service de gestion des ressources physiques et pédagogiques. Gère l'inventaire complet des salles avec leurs équipements et capacités. Permet la création de cours avec génération automatique des groupes d'étudiants. Implémente l'assignation automatique des salles en fonction du type de cours, effectif et équipements requis. Gère également les événements académiques exceptionnels et les réservations ponctuelles.

### Technologies
- Spring Data JPA, PostgreSQL, Redis (cache disponibilités)

### Port
`8084`

### Base de Données
PostgreSQL (`booking_db`) : ecoles, filieres, classes, etudiants, ue, cours, groupes_etudiants, salles, equipements, reservations, evenements

### Endpoints - Salles
- `GET /salles` - Lister toutes les salles
- `POST /salles` - Créer salle
- `PUT /salles/{id}` - Modifier salle
- `DELETE /salles/{id}` - Supprimer salle
- `GET /salles/disponibles` - Rechercher salles disponibles (filtres: créneau, type, capacité)
- `POST /salles/{id}/equipements` - Ajouter équipement

### Endpoints - Cours
- `GET /cours` - Lister cours
- `POST /cours` - Créer cours
- `PUT /cours/{id}` - Modifier cours
- `DELETE /cours/{id}` - Supprimer cours
- `POST /cours/{id}/groupes` - Générer groupes automatiquement

### Endpoints - Groupes Étudiants
- `GET /groupes` - Lister groupes (par cours)
- `POST /groupes` - Créer groupe
- `PUT /groupes/{id}` - Modifier groupe
- `PUT /groupes/{id}/etudiants/{etudiantId}` - Ajouter étudiant
- `DELETE /groupes/{id}/etudiants/{etudiantId}` - Retirer étudiant

### Endpoints - Réservations
- `POST /reservations` - Créer réservation (avec validation automatique)
- `GET /reservations` - Lister réservations (filtres: salle/enseignant/date)
- `PUT /reservations/{id}` - Modifier réservation
- `DELETE /reservations/{id}` - Annuler réservation
- `POST /reservations/auto-assign` - Assignation automatique salle

### Endpoints - Événements
- `POST /evenements` - Créer événement académique
- `GET /evenements` - Lister événements (filtres: type/période)
- `PUT /evenements/{id}` - Modifier événement
- `DELETE /evenements/{id}` - Annuler événement

---

## 7. 🔔 Notification Service

### Description
Service de communication multi-canal vers les utilisateurs. Gère l'envoi asynchrone de notifications par email (SMTP), SMS (Twilio) et push notifications. Utilise des templates Thymeleaf personnalisables pour les emails. Implémente un système de file d'attente Redis avec retry automatique en cas d'échec. Permet la planification d'envois différés et massifs (ex: rappels quotidiens).

### Technologies
- Spring Mail, Twilio API, Firebase Cloud Messaging, Thymeleaf, Spring Async, Redis

### Port
`8085`

### Base de Données
PostgreSQL (`notification_db`) : notifications, templates, historique_envois
Redis : file d'attente, retry queue

### Endpoints - Envoi
- `POST /notifications/send` - Envoyer notification
- `POST /notifications/send-bulk` - Envoi massif
- `POST /notifications/schedule` - Planifier envoi différé
- `GET /notifications/{id}/status` - Consulter statut envoi

### Endpoints - Historique
- `GET /notifications/historique` - Historique par utilisateur
- `GET /notifications/{id}/details` - Détails d'une notification

### Endpoints - Templates
- `GET /templates` - Lister templates
- `POST /templates` - Créer template
- `PUT /templates/{id}` - Modifier template
- `DELETE /templates/{id}` - Supprimer template

### Types de Notifications
- CHANGEMENT_EMPLOI_TEMPS
- RAPPEL_COURS
- CONFLIT_HORAIRE
- NOUVEL_EMPLOI_TEMPS
- ANNULATION_COURS
- EVENEMENT_A_VENIR

---

## 8. 📊 Report Service

### Description
Service d'analyse et reporting. Génère des statistiques d'utilisation des salles, charge horaire des enseignants, répartition des cours. Calcule des indicateurs clés de performance (KPI) comme le taux d'occupation des salles. Permet l'export multi-format (PDF, Excel, CSV) avec génération automatique via Apache POI et iText. Supporte la planification de rapports automatiques périodiques.

### Technologies
- Spring Data JPA, PostgreSQL, Apache POI (Excel), iText/Flying Saucer (PDF), Spring Scheduler

### Port
`8086`

### Base de Données
PostgreSQL (`report_db`) : rapports, kpi_historique, exports
Accès lecture seule aux autres bases (via vues)

### Endpoints - Dashboard et KPI
- `GET /reports/dashboard` - Tableau de bord (filtres: école/période)
- `GET /reports/statistics/salles` - Statistiques d'utilisation salles
- `GET /reports/statistics/enseignants` - Charge horaire enseignants
- `GET /reports/statistics/cours` - Répartition des cours

### Endpoints - Génération Rapports
- `POST /reports/generate` - Générer rapport personnalisé
- `GET /reports/{id}/download` - Télécharger rapport
- `GET /reports/types` - Types de rapports disponibles
- `POST /reports/schedule` - Planifier rapport automatique

### Types de Rapports
- UTILISATION_SALLES (taux occupation, heures utilisées)
- CHARGE_ENSEIGNANTS (heures par enseignant, répartition)
- CONFLITS (historique, temps résolution)
- REPARTITION_COURS (par type/école/filière)
- EVENEMENTS (liste semestre, salles mobilisées)
- AUDIT (traçabilité des modifications)

---

## 9. 🔗 Agora Integration Service

### Description
Service d'intégration avec l'ENT Agora. Assure l'export automatique ou manuel des emplois du temps validés vers la plateforme externe. Transforme les données internes au format attendu par l'API Agora (JSON/XML). Implémente un système de retry avec gestion d'erreurs robuste. Permet l'import de la liste des étudiants depuis Agora pour synchronisation. Journalise tous les exports pour traçabilité.

### Technologies
- Spring RestTemplate/WebClient, Jackson, Spring Batch, Spring Retry

### Port
`8087`

### Base de Données
PostgreSQL (`agora_db`) : exports_agora, mapping_entites, logs_integration

### Endpoints - Export
- `POST /agora/export/emploi-du-temps/{id}` - Exporter emploi du temps
- `POST /agora/export/schedule` - Planifier export automatique
- `GET /agora/exports/historique` - Historique des exports
- `GET /agora/exports/{id}` - Détails d'un export

### Endpoints - Import
- `POST /agora/import/etudiants` - Importer étudiants depuis Agora
- `GET /agora/sync/status` - Vérifier statut synchronisation

### Endpoints - Configuration
- `PUT /agora/config` - Configurer paramètres API Agora
- `GET /agora/health` - Tester connexion API Agora

---

## 📊 Tableau Récapitulatif

| Service                  | Port | Base de Données              | Responsabilité Principale           | Technologies Clés                  |
|--------------------------|------|------------------------------|-------------------------------------|------------------------------------|
| **API Gateway**          | 8080 | Redis                        | Routage et sécurité                 | Spring Cloud Gateway, Resilience4j |
| **Eureka Server**        | 8761 | Aucune                       | Découverte de services              | Spring Cloud Netflix Eureka        |
| **Auth Service**         | 8081 | PostgreSQL (auth_db)         | Authentification JWT                | Spring Security, JWT, BCrypt       |
| **User Service**         | 8082 | PostgreSQL (user_db)         | Gestion utilisateurs/disponibilités | Spring Data JPA, MapStruct         |
| **Planning Service**     | 8083 | PostgreSQL (planning_db)     | Génération emplois du temps         | Algorithmes heuristiques           |
| **Booking Service**      | 8084 | PostgreSQL (booking_db)      | Réservations salles/cours           | Spring Data JPA, Redis             |
| **Notification Service** | 8085 | PostgreSQL (notification_db) | Notifications multi-canal           | Spring Mail, Twilio API            |
| **Report Service**       | 8086 | PostgreSQL (report_db)       | Rapports et statistiques            | Apache POI, iText                  |
| **Agora Integration**    | 8087 | PostgreSQL (agora_db)        | Export vers ENT                     | RestTemplate, Spring Batch         |

---

## 🔄 Flux de Communication Entre Services

### Scénario 1 : Génération d'un Emploi du Temps

```
1. Client (Admin) 
   ↓ POST /api/planning/plannings/generate
2. API Gateway (8080)
   ↓ Validation JWT + Routage
3. Planning Service (8083)
   ↓ GET /users/{id}/disponibilites (pour chaque enseignant)
4. User Service (8082)
   ↓ Retourne disponibilités
5. Planning Service (8083)
   ↓ GET /cours (tous les cours à planifier)
6. Booking Service (8084)
   ↓ Retourne liste cours
7. Planning Service (8083)
   ↓ GET /salles/disponibles?creneau={...} (pour chaque cours)
8. Booking Service (8084)
   ↓ Retourne salles disponibles
9. Planning Service (8083)
   → Applique algorithme de génération
   → Détecte conflits potentiels
   → Crée emploi du temps (statut: BROUILLON)
   ↓ POST /reservations (pour chaque cours planifié)
10. Booking Service (8084)
    ↓ Crée réservations
11. Planning Service (8083)
    ↓ Retourne emploi du temps généré
12. API Gateway → Client
    ↓ Response: emploi avec liste conflits détectés
```

**Résultat :** Emploi du temps créé en statut BROUILLON avec conflits identifiés

---

### Scénario 2 : Publication d'un Emploi du Temps

```
1. Client (Admin)
   ↓ POST /api/planning/plannings/{id}/publish
2. API Gateway (8080)
   ↓ Validation JWT + Routage
3. Planning Service (8083)
   → Vérifie statut emploi (doit être VALIDE)
   → Change statut → PUBLIE
   → Déclenche événement "EmploiDuTempsPublieEvent"
   ↓ POST /notifications/send-bulk
4. Notification Service (8085)
   ↓ GET /users/{id} (pour chaque enseignant concerné)
5. User Service (8082)
   ↓ Retourne emails/téléphones enseignants
6. Notification Service (8085)
   → Envoie emails (Thymeleaf + SMTP)
   → Envoie SMS (Twilio API)
   → Enregistre historique
7. Planning Service (8083)
   ↓ POST /agora/export/emploi-du-temps/{id}
8. Agora Integration Service (8087)
   ↓ GET /plannings/{id} (détails complets)
9. Planning Service (8083)
   ↓ Retourne données emploi du temps
10. Agora Integration Service (8087)
    → Transforme au format Agora
    → POST vers API Agora externe
    → Journalise export (succès/échec)
11. API Gateway → Client
    ↓ Response: publication réussie
```

**Résultat :** Emploi du temps publié + Notifications envoyées + Export Agora effectué

---

### Scénario 3 : Consultation Emploi du Temps (Enseignant)

```
1. Client (Enseignant)
   ↓ GET /api/planning/plannings/search?enseignantId={id}&semaine=2024-W38
2. API Gateway (8080)
   ↓ GET /validate (vérifier JWT)
3. Auth Service (8081)
   ↓ Valide token + Retourne userId et permissions
4. API Gateway (8080)
   ↓ Vérifie que userId correspond à enseignantId (ou role=ADMIN)
   ↓ Routage vers Planning Service
5. Planning Service (8083)
   ↓ GET /reservations?enseignantId={id}&semaine={...}
6. Booking Service (8084)
   → Retourne réservations avec détails (cours, salle, groupe)
7. Planning Service (8083)
   → Construit emploi du temps personnalisé
   ↓ Retourne JSON avec planning
8. API Gateway → Client
   ↓ Response: emploi du temps enseignant
```

**Résultat :** Enseignant visualise son emploi du temps personnel

---

### Scénario 4 : Génération Rapport Utilisation Salles

```
1. Client (Admin)
   ↓ POST /api/reports/generate
   Body: {type: "UTILISATION_SALLES", dateDebut, dateFin, ecoleId}
2. API Gateway (8080)
   ↓ Validation JWT + Routage
3. Report Service (8086)
   ↓ GET /salles (liste salles école)
4. Booking Service (8084)
   ↓ Retourne salles avec caractéristiques
5. Report Service (8086)
   ↓ GET /reservations?ecoleId={...}&periode={...}
6. Booking Service (8084)
   ↓ Retourne toutes les réservations période
7. Report Service (8086)
   → Calcule statistiques:
     - Taux occupation par salle
     - Heures utilisées vs disponibles
     - Répartition par type cours
   → Génère graphiques
   → Export PDF (iText) ou Excel (Apache POI)
   ↓ POST /notifications/send (envoyer rapport par email)
8. Notification Service (8085)
   → Envoie email avec pièce jointe PDF
9. API Gateway → Client
   ↓ Response: rapportId + URL téléchargement
```

**Résultat :** Rapport généré et envoyé par email

---

## 🔐 Sécurité et Authentification

### Flow JWT Simplifié
```
1. Login → Auth Service génère JWT + Refresh Token
2. Client inclut JWT dans toutes les requêtes (Header: Authorization: Bearer {token})
3. API Gateway valide JWT via Auth Service (/validate)
4. Si valide → routage vers service cible
5. Si expiré → Client utilise Refresh Token (/refresh) pour nouveau JWT
6. Logout → Token ajouté à blacklist Redis
```

### Permissions par Rôle
- **ADMINISTRATEUR :** Accès complet (CRUD utilisateurs, planification, validation, publication, rapports)
- **ENSEIGNANT :** Lecture emplois du temps personnels, gestion disponibilités, consultation cours/salles

---

## 🗄️ Stratégie de Base de Données

### Pattern Database per Service
Chaque microservice possède sa propre base de données PostgreSQL avec un schéma dédié :

- **auth_db :** Utilisateurs, rôles, permissions, refresh_tokens
- **user_db :** Enseignants, administrateurs, disponibilités, affectations
- **planning_db :** Emplois du temps, créneaux, conflits
- **booking_db :** Écoles, filières, classes, cours, salles, équipements, réservations, étudiants, événements
- **notification_db :** Notifications, templates, historique_envois
- **report_db :** Rapports, KPI historiques, exports
- **agora_db :** Logs intégration, mapping entités, exports

### Gestion de la Cohérence
- **API Calls synchrones** pour lectures (acceptable car idempotent)
- **Events asynchrones** pour synchronisation (Spring Events)
- **Saga Pattern** pour transactions distribuées complexes (génération emploi du temps)

---

## 🐳 Architecture de Déploiement Docker

### Structure docker-compose.yml
```
Services Infrastructure:
- eureka-server (8761)
- postgres (5432) - 7 bases de données
- redis (6379)

Microservices:
- api-gateway (8080) → depend: eureka, redis
- auth-service (8081) → depend: eureka, postgres, redis
- user-service (8082) → depend: eureka, postgres
- planning-service (8083) → depend: eureka, postgres
- booking-service (8084) → depend: eureka, postgres, redis
- notification-service (8085) → depend: eureka, postgres, redis
- report-service (8086) → depend: eureka, postgres
- agora-integration-service (8087) → depend: eureka, postgres

Network: iusjc-network (bridge)
Volumes: postgres-data (persistance)
```

### Ordre de Démarrage
1. Infrastructure (Postgres, Redis, Eureka)
2. Services fondamentaux (Auth, User)
3. Services métier (Planning, Booking)
4. Services auxiliaires (Notification, Report, Agora)
5. API Gateway (dernier, car dépend de tous)

---

## 🚀 CI/CD et DevOps

### Pipeline GitHub Actions
```
1. Push sur branche develop/main
2. Tests automatisés (mvn test) - tous services
3. Build Docker images (docker-compose build)
4. [Si main] Deploy sur VPS:
   - SSH vers VPS
   - Git pull
   - docker-compose down
   - docker-compose up -d
5. Notifications Slack/Discord (succès/échec)
```

### Monitoring
- **Health Checks :** `/actuator/health` sur chaque service
- **Logs :** Centralisés (recommandation: ELK Stack ou Grafana Loki)
- **Métriques :** Prometheus + Grafana (dashboards)

---

## ALGORITHMES CLÉS

### Algorithme 1 : Détection de Conflits

**Objectif :** Identifier tous les conflits lors d'une tentative de réservation

**Entrée :** Une réservation (cours, enseignant, salle, groupe, créneau)  
**Sortie :** Liste des conflits détectés avec type et description

**Pseudo-code :**
```
FONCTION detecterConflits(reservation):
    conflits = []
    
    // 1. Conflit Enseignant
    reservationsEnseignant = rechercherReservations(
        enseignantId = reservation.enseignant,
        creneau = reservation.creneau
    )
    SI reservationsEnseignant NON VIDE ALORS:
        conflits.ajouter(
            type: "ENSEIGNANT_OCCUPE",
            description: "Enseignant déjà en cours à ce créneau",
            reservationConflictuelle: reservationsEnseignant[0]
        )
    
    // 2. Conflit Salle
    reservationsSalle = rechercherReservations(
        salleId = reservation.salle,
        creneau = reservation.creneau
    )
    SI reservationsSalle NON VIDE ALORS:
        conflits.ajouter(
            type: "SALLE_OCCUPEE",
            description: "Salle déjà réservée",
            reservationConflictuelle: reservationsSalle[0]
        )
    
    // 3. Conflit Groupe
    reservationsGroupe = rechercherReservations(
        groupeId = reservation.groupe,
        creneau = reservation.creneau
    )
    SI reservationsGroupe NON VIDE ALORS:
        conflits.ajouter(
            type: "GROUPE_OCCUPE",
            description: "Groupe a déjà cours",
            reservationConflictuelle: reservationsGroupe[0]
        )
    
    // 4. Capacité Salle Insuffisante
    SI reservation.groupe.effectif > reservation.salle.capacite ALORS:
        conflits.ajouter(
            type: "CAPACITE_INSUFFISANTE",
            description: "Effectif " + groupe.effectif + " > Capacité salle " + salle.capacite
        )
    
    // 5. Équipements Manquants
    equipementsRequis = reservation.cours.equipementsRequis
    equipementsSalle = reservation.salle.equipements
    SI NON equipementsSalle.contientTous(equipementsRequis) ALORS:
        conflits.ajouter(
            type: "EQUIPEMENTS_MANQUANTS",
            description: "Salle ne possède pas: " + equipementsManquants
        )
    
    RETOURNER conflits
FIN FONCTION
```

**Complexité :** O(n) où n = nombre de réservations existantes à vérifier

---

### Algorithme 2 : Assignation Automatique de Salle

**Objectif :** Trouver la salle optimale pour un cours donné à un créneau précis

**Entrée :** Cours, créneau, capacité requise, équipements requis  
**Sortie :** Salle assignée (ou null si aucune trouvée)

**Pseudo-code :**
```
FONCTION assignerSalleAutomatique(cours, creneau, capaciteRequise, equipementsRequis):
    // 1. Filtrer salles disponibles au créneau
    sallesDisponibles = rechercherSallesDisponibles(creneau)
    
    // 2. Filtrer par type compatible
    SI cours.typeCours == "CM" ALORS:
        sallesDisponibles = filtrer(sallesDisponibles, type IN ["AMPHITHEATRE", "SALLE_COURS"])
    SINON SI cours.typeCours == "TD" ALORS:
        sallesDisponibles = filtrer(sallesDisponibles, type == "SALLE_COURS")
    SINON SI cours.typeCours == "TP" ALORS:
        sallesDisponibles = filtrer(sallesDisponibles, type == "LABORATOIRE")
    FIN SI
    
    // 3. Filtrer par capacité suffisante
    sallesDisponibles = filtrer(sallesDisponibles, capacite >= capaciteRequise)
    
    // 4. Filtrer par équipements requis
    SI equipementsRequis NON VIDE ALORS:
        sallesDisponibles = filtrer(sallesDisponibles, 
            POUR CHAQUE equipement IN equipementsRequis:
                salle.possede(equipement)
        )
    FIN SI
    
    // 5. Si aucune salle trouvée
    SI sallesDisponibles VIDE ALORS:
        RETOURNER null
    FIN SI
    
    // 6. Optimisation: choisir salle avec capacité la plus proche (éviter gaspillage)
    salleOptimale = null
    ecartMinimal = INFINI
    
    POUR CHAQUE salle IN sallesDisponibles:
        ecart = salle.capacite - capaciteRequise
        SI ecart < ecartMinimal ALORS:
            ecartMinimal = ecart
            salleOptimale = salle
        FIN SI
    FIN POUR
    
    RETOURNER salleOptimale
FIN FONCTION
```

**Optimisations appliquées :**
- Filtrage progressif (early elimination)
- Sélection de la salle avec capacité la plus proche (minimise gaspillage)
- Cache Redis des disponibilités pour éviter requêtes répétées

**Complexité :** O(s × log s) où s = nombre de salles (tri pour optimisation)

---

### Algorithme 3 : Génération Automatique d'Emploi du Temps

**Objectif :** Générer un emploi du temps complet en planifiant tous les cours tout en minimisant les conflits

**Entrée :** Liste des cours à planifier, période (dates début/fin), écoles concernées  
**Sortie :** Emploi du temps avec réservations créées et liste des cours non planifiés

**Approche :** Heuristique Greedy (glouton) avec priorisation

**Pseudo-code :**
```
FONCTION genererEmploiDuTemps(coursAPlanifier, dateDebut, dateFin, ecoles):
    emploi = nouvelEmploiDuTemps(dateDebut, dateFin)
    coursNonPlanifies = []
    
    // 1. Trier cours par priorité (stratégie greedy)
    // Priorité: CM > TD > TP, puis volume horaire décroissant
    coursAPlanifier.trier(
        PAR typeCours (CM=1, TD=2, TP=3) CROISSANT,
        PUIS volumeHoraire DÉCROISSANT
    )
    
    // 2. Planifier chaque cours
    POUR CHAQUE cours IN coursAPlanifier:
        planifie = FAUX
        
        // 3. Obtenir disponibilités de l'enseignant
        disponibilites = obtenirDisponibilites(cours.enseignant, ecoles)
        
        // 4. Générer créneaux possibles basés sur disponibilités
        creneauxPossibles = genererCreneaux(
            disponibilites,
            dateDebut,
            dateFin,
            cours.volumeHoraire
        )
        
        // 5. Essayer chaque créneau jusqu'à succès
        POUR CHAQUE creneau IN creneauxPossibles:
            
            // 6. Trouver salle appropriée
            salle = assignerSalleAutomatique(
                cours,
                creneau,
                cours.groupe.effectif,
                cours.equipementsRequis
            )
            
            // Si aucune salle trouvée, passer au créneau suivant
            SI salle == null ALORS:
                CONTINUER
            FIN SI
            
            // 7. Créer réservation provisoire
            reservation = nouvelleReservation(
                cours,
                creneau,
                salle,
                cours.enseignant,
                cours.groupe
            )
            
            // 8. Vérifier conflits
            conflits = detecterConflits(reservation)
            
            // 9. Si pas de conflit, valider la réservation
            SI conflits VIDE ALORS:
                emploi.ajouterReservation(reservation)
                planifie = VRAI
                SORTIR DE LA BOUCLE // Cours planifié, passer au suivant
            FIN SI
            
        FIN POUR
        
        // 10. Si cours non planifié après tous les essais
        SI NON planifie ALORS:
            coursNonPlanifies.ajouter(cours)
            emploi.ajouterAvertissement(
                "Cours non planifié: " + cours.intitule,
                "Aucun créneau/salle disponible"
            )
        FIN SI
        
    FIN POUR
    
    // 11. Calculer statistiques
    emploi.nbCoursPlannifies = coursAPlanifier.taille - coursNonPlanifies.taille
    emploi.nbCoursNonPlanifies = coursNonPlanifies.taille
    emploi.tauxReussite = (nbCoursPlannifies / coursAPlanifier.taille) × 100
    emploi.statut = "BROUILLON"
    
    RETOURNER emploi
FIN FONCTION

// Fonction auxiliaire: générer créneaux à partir des disponibilités
FONCTION genererCreneaux(disponibilites, dateDebut, dateFin, volumeHoraire):
    creneaux = []
    
    // Pour chaque semaine de la période
    semaine = dateDebut
    TANT QUE semaine <= dateFin:
        
        // Pour chaque disponibilité de l'enseignant
        POUR CHAQUE dispo IN disponibilites:
            
            // Calculer date exacte (jour de la semaine + semaine courante)
            dateCreneau = semaine + dispo.jourSemaine
            
            // Créer créneau
            creneau = nouveauCreneau(
                dateCreneau,
                dispo.heureDebut,
                dispo.heureFin,
                recurrent: VRAI
            )
            
            // Vérifier que durée créneau correspond au cours
            dureeCreneau = dispo.heureFin - dispo.heureDebut
            SI dureeCreneau >= cours.dureeSeance ALORS:
                creneaux.ajouter(creneau)
            FIN SI
            
        FIN POUR
        
        semaine = semaine + 7 jours // Passer à la semaine suivante
    FIN TANT QUE
    
    RETOURNER creneaux
FIN FONCTION
```

**Stratégies d'optimisation :**
1. **Priorisation :** Cours magistraux d'abord (moins flexibles), puis TD/TP
2. **Greedy local :** Premier créneau valide trouvé est sélectionné
3. **Early stopping :** Dès qu'un cours est planifié, on passe au suivant
4. **Filtrage progressif :** Disponibilités → Créneaux → Salles → Conflits

**Limites et améliorations possibles :**
- Algorithme greedy ne garantit pas l'optimum global
- Amélioration possible : Backtracking si trop de cours non planifiés
- Amélioration possible : Algorithmes génétiques pour optimisation globale
- Amélioration possible : Contraintes de préférence (enseignant préfère matinée)

**Complexité :** O(c × d × s) où :
- c = nombre de cours
- d = nombre de disponibilités par enseignant
- s = nombre de salles

**Performance typique :**
- 200 cours, 50 enseignants, 100 salles → ~5-10 secondes
- Avec cache Redis → ~2-3 secondes

---

## 📝 Notes d'Implémentation

### Gestion des Transactions Distribuées
Pour la génération d'emploi du temps (qui implique Planning Service + Booking Service), utilisation du **Saga Pattern** :

1. Planning Service crée l'emploi (statut BROUILLON)
2. Pour chaque cours planifié → Booking Service crée réservation
3. Si échec : Compensation automatique (suppression réservations créées)
4. Si succès : Emploi passe à VALIDE après validation manuelle

### Cache Strategy
**Redis utilisé pour :**
- Disponibilités des salles (TTL: 5 minutes)
- Sessions JWT actives
- Rate limiting API Gateway
- File d'attente notifications

**Invalidation du cache :**
- Après création/modification/suppression de réservation
- Après modification disponibilités enseignant
- Après changement statut salle (maintenance)

### Gestion des Erreurs
**Stratégie globale :**
- API Gateway : Capture toutes les exceptions, retourne JSON standardisé
- Chaque service : `@ControllerAdvice` pour gestion centralisée
- Codes HTTP appropriés : 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 409 (Conflict), 500 (Server Error)

**Retry automatique :**
- Notifications (max 3 tentatives, délai exponentiel)
- Export Agora (max 3 tentatives, 5s entre chaque)
- Appels inter-services (Circuit Breaker après 5 échecs)

---

## 🔒 Sécurité Supplémentaire

### Protection Endpoints
- Tous les endpoints (sauf `/login`, `/register`) nécessitent JWT valide
- Validation des permissions via `@PreAuthorize("hasAuthority('...')")`
- Rate limiting : 100 requêtes/minute par utilisateur (Gateway)
- CORS configuré pour domaines autorisés uniquement

### Audit Trail
Le service Report génère des logs d'audit pour :
- Création/modification/suppression utilisateurs
- Publication d'emplois du temps
- Modifications manuelles de créneaux
- Exports vers Agora

**Stocké dans :** Table `historique_modifications` avec :
- Utilisateur effectuant l'action
- Type d'action (CREATE/UPDATE/DELETE)
- Timestamp
- Valeur avant/après (JSON)

---

## 📚 Documentation API (Swagger)

Chaque microservice expose sa documentation OpenAPI à :
- `http://localhost:{PORT}/swagger-ui.html`
- `http://localhost:{PORT}/v3/api-docs` (JSON)

**Documentation consolidée accessible via API Gateway :**
- `http://localhost:8080/swagger-ui.html` (agrégation de tous les services)

**Incluant :**
- Description de chaque endpoint
- Paramètres requis/optionnels
- Exemples de requêtes/réponses
- Codes d'erreur possibles
- Schémas des objets (DTO)

---

## ✅ Points Clés de l'Architecture

### Avantages
✅ **Scalabilité horizontale** : Chaque service peut être dupliqué indépendamment  
✅ **Isolation des pannes** : Failure d'un service n'impacte pas les autres (Circuit Breaker)  
✅ **Technologie adaptée** : Chaque service utilise la stack optimale pour son besoin  
✅ **Déploiement indépendant** : Mise à jour d'un service sans redéployer tout le système  
✅ **Maintenabilité** : Code organisé, responsabilités claires, équipes peuvent travailler en parallèle  
✅ **Testabilité** : Tests unitaires et d'intégration par service

### Défis Anticipés
⚠️ **Complexité opérationnelle** : Plus de services = plus d'infrastructure à gérer  
⚠️ **Latence réseau** : Communication inter-services ajoute de la latence  
⚠️ **Debugging distribué** : Tracer une erreur à travers plusieurs services  
⚠️ **Cohérence des données** : Transactions distribuées complexes (Saga Pattern)  
⚠️ **Courbe d'apprentissage** : Technologies multiples (Spring Cloud, Docker, etc.)

### Stratégies de Mitigation
- **Logging centralisé** : ELK Stack pour agréger tous les logs
- **Tracing distribué** : Spring Cloud Sleuth + Zipkin pour tracer requêtes
- **Monitoring** : Prometheus + Grafana pour métriques temps réel
- **Health checks** : Eureka + Actuator pour détecter services down
- **Documentation** : Swagger pour chaque API + README par service

---

## 🎯 Recommandations pour la Phase d'Implémentation

### Phase 1 : Fondations (Semaines 7-8)
1. Setup infrastructure (Eureka, PostgreSQL, Redis)
2. Développer Auth Service + User Service
3. Configurer API Gateway avec routage basique
4. Tests d'intégration Auth + Gateway

### Phase 2 : Cœur Métier (Sprints 1-4)
1. Développer Booking Service (salles, cours, réservations)
2. Développer Planning Service (génération emploi du temps)
3. Intégrer algorithmes de détection conflits et assignation salles
4. Tests end-to-end : génération emploi du temps complet

### Phase 3 : Services Auxiliaires (Sprints 5-7)
1. Développer Notification Service (email, SMS)
2. Développer Report Service (rapports PDF/Excel)
3. Développer Agora Integration Service
4. Intégration complète du workflow

### Phase 4 : Optimisation et Déploiement (Sprint 8 + Mai)
1. Optimisation performances (cache, requêtes)
2. Tests de charge et stress tests
3. Configuration CI/CD GitHub Actions
4. Déploiement sur VPS de production
5. Documentation utilisateur finale

### Tests Prioritaires
- **Unitaires** : Algorithmes (détection conflits, assignation salles, génération)
- **Intégration** : Communication inter-services (Planning ↔ Booking ↔ User)
- **End-to-end** : Scénario complet (login → génération emploi → publication → notification)
- **Performance** : Génération emploi du temps avec 200+ cours en <10s

---

## 📦 Livrables Associés à cette Architecture

### Documents Techniques
- Cahier de conception (présent document)
- Documentation API complète (Swagger)
- Guides d'installation et déploiement
- Diagrammes UML (composants, déploiement, séquence)

### Code Source
- 9 repositories Git (un par microservice)
- Scripts Docker Compose
- Configuration CI/CD (GitHub Actions)
- Tests automatisés (unitaires, intégration)

### Infrastructure
- Serveurs PostgreSQL (7 bases)
- Serveur Redis
- VPS de production configuré
- Monitoring et logs centralisés

---

**FIN DU DOCUMENT - Architecture Microservices IUSJC**

*Document de conception technique pour le projet de système de gestion des emplois du temps et réservations de salles*

*Version : 1.0 | Date : Octobre 2024 | Équipe : ISI 3ème Année*