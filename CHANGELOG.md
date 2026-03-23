# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

---

## [Non publié]

### A implémenter
- Algorithme de génération automatique d'emplois du temps (planning-service)
- Export PDF et iCalendar des emplois du temps (planning-service)
- Affectations enseignant-école/cours et charge horaire (user-service)
- Auto-assign salle et génération auto groupes (booking-service)
- Planification rapports automatiques (report-service)
- Import étudiants depuis Agora (agora-service)

---

## [0.4.0] - 2026-02-09

### Ajouté - PHASE 1 : Infrastructure & Sécurité ✅

- **api-gateway** : Routes complètes pour tous les services
  - Refactorisation avec méthode générique `forwardToService()`
  - Routes ajoutées : `/api/bookings/**`, `/api/planning/**`, `/api/notifications/**`, `/api/reports/**`, `/api/agora/**`

- **api-gateway** : Rate Limiting avec Redis & Bucket4j
  - Limitation : 100 requêtes/minute par utilisateur ou IP
  - Configuration Bucket4j avec clé resolver intelligent (userId JWT > IP)
  - Filtre servlet `RateLimitingFilter` avec ordre 1
  - Headers de réponse : `X-Rate-Limit-Remaining`, `X-Rate-Limit-Retry-After-Seconds`
  - Dépendances : `bucket4j-core:8.14.0`, `bucket4j-redis:8.14.0`

- **api-gateway** : Circuit Breaker avec Resilience4j
  - Protection contre échecs en cascade
  - Configuration par service (authService, userService, bookingService, planningService, notificationService, reportService, agoraService)
  - Seuils : 5 échecs → circuit ouvert pendant 30s
  - Timeout : 5s par requête
  - Fallback automatique : 503 Service Unavailable avec message JSON
  - `ServiceCallService` : wrapper RestTemplate avec circuit breaker
  - Dépendances : `resilience4j-spring-boot3:2.2.0`, `resilience4j-circuitbreaker`, `resilience4j-timelimiter`

- **auth-service** : Blacklist JWT Redis
  - Révocation de tokens JWT lors du logout
  - `TokenBlacklistService` avec méthodes : `blacklistToken()`, `isTokenBlacklisted()`, `removeFromBlacklist()`, `getBlacklistTTL()`
  - Stockage Redis avec clé `blacklist:token:{token}`
  - TTL automatique = durée restante du token
  - Modification `POST /api/auth/logout` : extraction de l'access token depuis l'en-tête Authorization
  - Modification `GET /api/auth/validate` : vérification blacklist avant validation JWT
  - Dépendance : `spring-boot-starter-data-redis`

### Modifié
- **api-gateway** : `JwtUtil.java` ajout méthode `extractUserId()`
- **api-gateway** : Configuration Redis dans `application.yaml`
- **auth-service** : Configuration Redis dans `application.yaml`
- **api-gateway** : Actuator expose maintenant les circuit breakers (`/actuator/circuitbreakers`)

---

## [0.3.0] - 2026-02-09

### Ajouté
- **agora-service** : Implémentation complète (Phases A0-A5)
  - Correction typo package `agora_ervice` → `agoraservice`
  - Export vers API Agora (JSON/XML) avec retry automatique
  - Gestion des mappings d'entités Timely ↔ Agora
  - Logging d'intégration complet
  - Listener RabbitMQ pour export auto à la publication
  - Client Feign vers planning-service
- **report-service** : Implémentation complète (Phases R1-R5)
  - Entités Rapport, Export, KPIHistorique avec Flyway
  - Dashboard et calcul KPIs (utilisation salles, charge enseignants, répartition cours)
  - Génération fichiers PDF (Flying Saucer), Excel (Apache POI), CSV
  - Clients Feign vers booking-service, user-service, planning-service
  - Endpoints statistiques et téléchargement

---

## [0.2.0] - 2026-02-08

### Ajouté
- **booking-service** : Implémentation complète (Phases B1-B7)
  - 11 entités JPA : Ecole, Filiere, Classe, Etudiant, UE, Cours, Salle, Equipement, GroupeEtudiant, Reservation, Evenement
  - 10 enums métier
  - CRUD complet avec validation métier (chevauchement horaire, capacité salle, compatibilité type)
  - Migration Flyway V1
  - Sécurité JWT par service
- **planning-service** : Implémentation CRUD (Phases P1-P5)
  - Entités EmploiDuTemps, Creneau, Conflit
  - Workflow validate/publish avec changement de statut
  - Détection avancée de conflits (enseignant, salle, groupe, disponibilités)
  - Clients Feign vers booking-service et user-service
  - Publication événements RabbitMQ (planning.published, planning.conflict.detected)
- **notification-service** : Fonctionnalités complètes
  - Envoi multi-canal : email (SMTP/Thymeleaf), SMS, push notifications
  - Envoi unitaire, bulk, et différé (schedule)
  - Templates CRUD avec prévisualisation
  - Historique d'envoi et retry automatique
  - Listeners RabbitMQ (user.created, password.reset, planning.published, planning.conflict)
  - Cache Redis pour file d'attente

---

## [0.1.0] - 2026-02-07

### Ajouté
- **Infrastructure** : Setup initial de l'architecture microservices
  - config-server (port 8888) avec configuration centralisée native
  - discovery-server Eureka (port 8761)
  - api-gateway Spring Cloud Gateway (port 8090) avec JWT filter et CORS
- **auth-service** (port 8091)
  - Authentification JWT (login, refresh, logout, validate)
  - Gestion des rôles (ADMINISTRATEUR, ENSEIGNANT)
  - Reset de mot de passe avec événement RabbitMQ
  - Client Feign vers user-service
- **user-service** (port 8092)
  - CRUD utilisateurs (enseignants, administrateurs)
  - Gestion des disponibilités enseignants (CRUD)
  - Endpoints internes pour communication inter-services
  - Publication événements RabbitMQ (user.created)
- **Docker Compose** : Orchestration complète
  - PostgreSQL (7 bases de données)
  - MongoDB (notification-service)
  - Redis (cache)
  - RabbitMQ (messaging)
  - Mailtrap (dev SMTP)
  - pgAdmin, Mongo Express (administration)
