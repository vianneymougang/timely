# Timely — Plan de Remédiation Complet

> Généré à partir de l'analyse multi-domaines (qualité, sécurité, performance, architecture)
> 16 problèmes identifiés, organisés en 5 phases avec dépendances

---

## Vue d'ensemble

| Phase | Objectif | Problèmes | Priorité | Effort estimé |
|-------|----------|-----------|----------|---------------|
| **Phase 1** | Sécurité critique | 3 | P0 — CRITIQUE | ~2h |
| **Phase 2** | Sécurité haute | 3 | P1 — HAUTE | ~1.5h |
| **Phase 3** | Performance critique | 3 | P1 — HAUTE | ~3h |
| **Phase 4** | Performance moyenne | 4 | P2 — MOYENNE | ~3h |
| **Phase 5** | Qualité & frontend | 3 | P3 — BASSE | ~2h |

---

## Phase 1 — Sécurité Critique (P0)

### 1.1 Externaliser les secrets des fichiers de configuration

**Problème** : Mots de passe BD, secrets JWT et credentials RabbitMQ en dur dans les YAML commités.

**Fichiers à modifier** (12 fichiers) :

| Fichier | Ligne | Secret actuel |
|---------|-------|---------------|
| `services/auth-service/src/main/resources/application.yaml` | 11 | `password: postgres` |
| `services/auth-service/src/main/resources/application.yaml` | 46 | JWT secret en dur |
| `services/auth-service/src/main/resources/application-docker.yaml` | 12 | `password: password` |
| `services/user-service/src/main/resources/application.yaml` | 12 | `password: postgres` |
| `services/user-service/src/main/resources/application-docker.yaml` | 12 | `password: password` |
| `services/booking-service/src/main/resources/application.yaml` | 9 | `password: password` |
| `services/booking-service/src/main/resources/application-docker.yaml` | 12 | `password: password` |
| `services/planning-service/src/main/resources/application.yaml` | 9 | `password: password` |
| `services/planning-service/src/main/resources/application-docker.yaml` | 12 | `password: password` |
| `services/report-service/src/main/resources/application.yaml` | 9 | `password: password` |
| `services/report-service/src/main/resources/application-docker.yaml` | 12 | `password: password` |
| `services/agora-service/src/main/resources/application.yaml` | 9, 93, 100 | DB + JWT + Agora password |
| `services/agora-service/src/main/resources/application-docker.yaml` | 12, 38 | DB + JWT |

**Action** : Dans chaque `application.yaml`, remplacer les valeurs en dur par des variables d'environnement :
```yaml
# AVANT
password: postgres

# APRÈS
password: ${DB_PASSWORD:changeme}
```

Pour le JWT :
```yaml
# AVANT
secret: mySecretKeyForJWT...

# APRÈS
secret: ${JWT_SECRET}  # PAS de valeur par défaut
```

Pour RabbitMQ (tous les services concernés) :
```yaml
# AVANT
username: admin
password: password

# APRÈS
username: ${RABBITMQ_USERNAME:guest}
password: ${RABBITMQ_PASSWORD}
```

**docker-compose.yml** — Centraliser les secrets via un `.env` file :
```yaml
# Ajouter env_file à chaque service
env_file:
  - .env
```

Créer `.env` (ajouté au `.gitignore`) :
```env
DB_PASSWORD=<mot_de_passe_fort>
JWT_SECRET=<clé_256bits_générée>
RABBITMQ_PASSWORD=<mot_de_passe_fort>
```

---

### 1.2 Ajouter l'autorisation sur les endpoints UserController

**Problème** : 5 endpoints sans `@PreAuthorize` permettent un accès non autorisé aux données utilisateur.

**Fichier** : `services/user-service/src/main/java/com/timely/userservice/controller/UserController.java`

| Ligne | Endpoint | Action |
|-------|----------|--------|
| 69-72 | `GET /{id}` | Ajouter `@PreAuthorize("hasAnyRole('ADMIN','ENSEIGNANT')")` |
| 78-81 | `GET /` (getAllUsers) | Ajouter `@PreAuthorize("hasRole('ADMIN')")` |
| 97-100 | `PUT /{id}` | Ajouter `@PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")` |
| 183-186 | `GET /{enseignantId}/ecoles` | Ajouter `@PreAuthorize("hasRole('ADMIN') or #enseignantId == authentication.principal.id")` |
| 219-222 | `GET /{enseignantId}/cours` | Ajouter `@PreAuthorize("hasRole('ADMIN') or #enseignantId == authentication.principal.id")` |
| 231-234 | `GET /{enseignantId}/charge-horaire` | Ajouter `@PreAuthorize("hasRole('ADMIN') or #enseignantId == authentication.principal.id")` |

**Exemple concret** :
```java
// Ligne 69 — AVANT
@GetMapping("/{id}")
public ResponseEntity<UserDto> getUserById(@PathVariable UUID id) {

// APRÈS
@GetMapping("/{id}")
@PreAuthorize("hasAnyRole('ADMIN', 'ENSEIGNANT')")
public ResponseEntity<UserDto> getUserById(@PathVariable UUID id) {
```

---

### 1.3 Ajouter les limites de ressources Docker

**Fichier** : `docker-compose.yml`

**Action** : Ajouter `deploy.resources.limits` à chaque service :

```yaml
# Pour les services métier (auth, user, booking, planning, report, agora)
deploy:
  resources:
    limits:
      memory: 512M
      cpus: '0.5'
    reservations:
      memory: 256M

# Pour les services infra (config-server, discovery-server)
deploy:
  resources:
    limits:
      memory: 384M
      cpus: '0.3'
    reservations:
      memory: 192M

# Pour les bases de données PostgreSQL
deploy:
  resources:
    limits:
      memory: 256M
      cpus: '0.3'

# Pour Redis, RabbitMQ
deploy:
  resources:
    limits:
      memory: 256M
      cpus: '0.25'
```

---

## Phase 2 — Sécurité Haute (P1)

### 2.1 Externaliser la configuration CORS

**Fichier** : `services/auth-service/src/main/java/com/timely/authservice/config/SecurityConfig.java`

**Lignes 77-87** — Remplacer les origines hardcodées par des valeurs configurables :

```java
// AVANT (ligne 79)
configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:4200"));
configuration.setAllowedHeaders(Arrays.asList("*"));

// APRÈS
@Value("${cors.allowed-origins:http://localhost:4200}")
private String[] allowedOrigins;

// Dans corsConfigurationSource() :
configuration.setAllowedOrigins(Arrays.asList(allowedOrigins));
configuration.setAllowedHeaders(Arrays.asList(
    "Authorization", "Content-Type", "Accept", "X-Requested-With"
));
```

Et ajouter dans `application.yaml` :
```yaml
cors:
  allowed-origins: ${CORS_ORIGINS:http://localhost:4200}
```

---

### 2.2 Restreindre les détails Actuator

**Fichiers** :
- `services/discovery-server/src/main/resources/application.yaml` (ligne 25)
- `services/config-server/src/main/resources/application.yaml` (ligne 22)

```yaml
# AVANT
show-details: always

# APRÈS
show-details: when-authorized
```

---

### 2.3 Masquer les messages d'erreur internes

**Fichier** : `services/auth-service/src/main/java/com/timely/authservice/exception/GlobalExceptionHandler.java`

**Ligne 98** — Le `RuntimeException` handler expose `ex.getMessage()` :

```java
// AVANT (ligne 94-100)
ErrorResponse error = ErrorResponse.builder()
        .timestamp(LocalDateTime.now())
        .status(HttpStatus.BAD_REQUEST.value())
        .error("Bad Request")
        .message(ex.getMessage())  // ← DANGER : expose les détails internes
        .path(request.getRequestURI())
        .build();

// APRÈS
ErrorResponse error = ErrorResponse.builder()
        .timestamp(LocalDateTime.now())
        .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .error("Internal Server Error")
        .message("An unexpected error occurred")
        .path(request.getRequestURI())
        .build();
```

**Note** : Appliquer la même correction aux `GlobalExceptionHandler` des autres services qui exposent `ex.getMessage()` dans le handler RuntimeException.

---

## Phase 3 — Performance Critique (P1)

### 3.1 Corriger le FetchType.EAGER → LAZY

**Fichier** : `services/user-service/src/main/java/com/timely/userservice/model/TeacherAvailability.java`

**Ligne 48** :
```java
// AVANT
@OneToMany(mappedBy = "availability", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
private List<AvailabilityTimeSlot> timeSlots = new ArrayList<>();

// APRÈS
@OneToMany(mappedBy = "availability", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
private List<AvailabilityTimeSlot> timeSlots = new ArrayList<>();
```

**Impact** : Vérifier et adapter les services qui accèdent à `timeSlots` pour utiliser un `JOIN FETCH` explicite dans les repositories :
```java
@Query("SELECT ta FROM TeacherAvailability ta LEFT JOIN FETCH ta.timeSlots WHERE ta.teacherId = :teacherId")
Optional<TeacherAvailability> findByTeacherIdWithTimeSlots(@Param("teacherId") UUID teacherId);
```

---

### 3.2 Ajouter la pagination aux endpoints de liste

**Services concernés** : user-service, booking-service, planning-service, agora-service

**Pattern à appliquer** — Exemple pour `UserController` :

```java
// AVANT (ligne 78-81)
@GetMapping
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<List<UserDto>> getAllUsers() {
    List<UserDto> users = userService.getAllUsers();
    return ResponseEntity.ok(users);
}

// APRÈS
@GetMapping
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<Page<UserDto>> getAllUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size) {
    Page<UserDto> users = userService.getAllUsers(PageRequest.of(page, size));
    return ResponseEntity.ok(users);
}
```

**Endpoints prioritaires à paginer** :
| Service | Endpoint | Fichier |
|---------|----------|---------|
| user-service | `GET /api/users` | UserController.java:78 |
| user-service | `GET /api/users/teachers` | UserController.java:87 |
| booking-service | `GET /api/bookings/reservations` | ReservationController |
| booking-service | `GET /api/bookings/salles` | SalleController |
| planning-service | `GET /api/planning/creneaux` | Controllers |

---

### 3.3 Configurer HikariCP

**Action** : Ajouter la configuration du pool dans chaque `application.yaml` des 7 services métier :

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 15
      minimum-idle: 5
      connection-timeout: 20000
      idle-timeout: 300000
      max-lifetime: 1200000
      pool-name: ${spring.application.name}-pool
```

**Fichiers** :
- `services/auth-service/src/main/resources/application.yaml`
- `services/user-service/src/main/resources/application.yaml`
- `services/booking-service/src/main/resources/application.yaml`
- `services/planning-service/src/main/resources/application.yaml`
- `services/report-service/src/main/resources/application.yaml`
- `services/agora-service/src/main/resources/application.yaml`

---

## Phase 4 — Performance Moyenne (P2)

### 4.1 Étendre le caching Redis aux services user et planning

**État actuel** : Seul booking-service implémente Redis caching.

**Action** : Ajouter `RedisConfig.java` + annotations `@Cacheable` dans :

**user-service** — Cacher les lookups fréquents :
```java
// UserServiceImpl.java
@Cacheable(value = "users:details", key = "#id")
public UserDto getUserById(UUID id) { ... }

@Cacheable(value = "users:teachers", key = "'all'")
public List<TeacherDto> getAllTeachers() { ... }

@CacheEvict(value = {"users:details", "users:teachers"}, allEntries = true)
public UserDto updateUser(UUID id, UpdateUserRequest request) { ... }
```

**planning-service** — Cacher les emplois du temps :
```java
@Cacheable(value = "planning:emploi", key = "#ecoleId")
public EmploiDuTemps getEmploiDuTemps(UUID ecoleId) { ... }
```

**Dépendance** : Copier le pattern `RedisConfig.java` du booking-service.

---

### 4.2 Configurer le batch Hibernate

**Action** : Ajouter dans chaque `application.yaml` des services avec imports en masse :

```yaml
spring:
  jpa:
    properties:
      hibernate:
        jdbc:
          batch_size: 25
        order_inserts: true
        order_updates: true
```

**Services prioritaires** : user-service (bulk user creation), agora-service (import Agora)

---

### 4.3 Désactiver show-sql en profil Docker

**Problème** : `show-sql: true` dans les configs de base impacte les performances en production.

**Fichiers** : Tous les `application.yaml` avec `show-sql: true`

```yaml
# AVANT
jpa:
  show-sql: true

# APRÈS
jpa:
  show-sql: ${SHOW_SQL:false}
```

---

### 4.4 Ajouter des JOIN FETCH dans les repositories critiques

**Problème** : Les relations LAZY peuvent causer des N+1 si accédées dans des boucles.

**Fichiers prioritaires** :
- `booking-service/.../repository/ReservationRepository.java`
- `planning-service/.../repository/CreneauRepository.java`

```java
@Query("SELECT r FROM Reservation r " +
       "LEFT JOIN FETCH r.salle " +
       "LEFT JOIN FETCH r.cours " +
       "WHERE r.dateReservation = :date")
List<Reservation> findByDateWithRelations(@Param("date") LocalDate date);
```

---

## Phase 5 — Qualité & Frontend (P3)

### 5.1 Angular — Ajouter OnPush et trackBy

**Pattern** : Dans tous les composants avec des listes :

```typescript
// AVANT
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
})

// APRÈS
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

**trackBy** dans les templates :
```html
<!-- AVANT -->
<tr *ngFor="let room of rooms">

<!-- APRÈS -->
<tr *ngFor="let room of rooms; trackBy: trackById">
```

```typescript
trackById(index: number, item: any): string {
  return item.id;
}
```

**Composants prioritaires** :
- `timely-frontend/src/app/features/admin/room/room.component.ts`
- `timely-frontend/src/app/features/admin/teachers/teachers-list/`
- `timely-frontend/src/app/features/admin/etudiants/`
- `timely-frontend/src/app/features/admin/courses/`

---

### 5.2 Angular — Lazy loading des routes

**Fichier** : `timely-frontend/src/app/app.routes.ts`

```typescript
// AVANT (import direct)
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';

// APRÈS (lazy loading)
{
  path: 'admin',
  loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
}
```

---

### 5.3 Notification-service — Ajouter des tests

**État actuel** : 0 tests pour notification-service (seul service sans tests).

**Action** : Créer au minimum :
- `NotificationServiceTest.java` — Tests unitaires du service d'envoi
- `RabbitMQListenerTest.java` — Tests des listeners d'événements
- `NotificationControllerTest.java` — Tests des endpoints REST

---

## Graphe de dépendances

```
Phase 1 (P0 - Critique)
├── 1.1 Secrets → aucune dépendance
├── 1.2 Authorization → aucune dépendance
└── 1.3 Docker limits → aucune dépendance

Phase 2 (P1 - Haute) — dépend de Phase 1
├── 2.1 CORS config → dépend de 1.1 (même fichiers YAML)
├── 2.2 Actuator → aucune dépendance
└── 2.3 Error messages → aucune dépendance

Phase 3 (P1 - Haute) — indépendant de Phase 2
├── 3.1 FetchType EAGER → aucune dépendance
├── 3.2 Pagination → dépend de 1.2 (mêmes controllers)
└── 3.3 HikariCP → dépend de 1.1 (mêmes fichiers YAML)

Phase 4 (P2 - Moyenne) — dépend de Phase 3
├── 4.1 Redis caching → dépend de 3.3 (config datasource)
├── 4.2 Batch Hibernate → dépend de 3.3 (config JPA)
├── 4.3 show-sql → dépend de 1.1 (mêmes fichiers)
└── 4.4 JOIN FETCH → dépend de 3.1 (FetchType LAZY)

Phase 5 (P3 - Basse) — indépendant
├── 5.1 Angular OnPush → aucune dépendance
├── 5.2 Lazy routes → aucune dépendance
└── 5.3 Tests notification → aucune dépendance
```

---

## Checklist de validation

Après chaque phase, vérifier :

- [ ] **Phase 1** : `docker compose up` fonctionne avec le `.env` file, les endpoints protégés retournent 403 sans token
- [ ] **Phase 2** : CORS fonctionne depuis le frontend Angular, actuator ne révèle plus les détails santé
- [ ] **Phase 3** : Les endpoints paginés retournent `Page<>`, pas de LazyInitializationException
- [ ] **Phase 4** : Vérifier les cache hits dans Redis (`redis-cli MONITOR`), batch inserts visibles dans les logs SQL
- [ ] **Phase 5** : Lighthouse performance score amélioré, tests notification green
