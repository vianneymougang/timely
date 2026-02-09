# Report Service - Phase R3: CRUD Complet Implémenté

## Vue d'ensemble
Implementation complète du CRUD pour le report-service suivant les patterns établis dans booking-service et planning-service.

## Fichiers créés

### 1. Repositories (`/repository`)

#### RapportRepository.java
```java
public interface RapportRepository extends JpaRepository<Rapport, UUID>
```
**Méthodes custom**:
- `findByTypeRapport(TypeRapport)` - Recherche par type de rapport
- `findByEcoleId(UUID)` - Recherche par école
- `findByUtilisateurCreateur(String)` - Recherche par utilisateur créateur
- `findByDateGenerationBetween(LocalDateTime, LocalDateTime)` - Recherche par plage de dates

#### ExportRepository.java
```java
public interface ExportRepository extends JpaRepository<Export, UUID>
```
**Méthodes custom**:
- `findByRapportId(UUID)` - Recherche par rapport
- `findByStatut(StatutExport)` - Recherche par statut
- `findByUtilisateur(String)` - Recherche par utilisateur

---

### 2. DTOs Request (`/dto/request`)

#### GenerateReportRequest.java
**Champs validés**:
- `@NotNull TypeRapport typeRapport`
- `@NotBlank String titre`
- `String description`
- `@NotNull LocalDate dateDebut`
- `@NotNull LocalDate dateFin`
- `@NotNull UUID ecoleId`
- `@NotNull FormatExport format`
- `Map<String, Object> parametresRapport`

---

### 3. DTOs Response (`/dto/response`)

#### RapportResponse.java
**Tous les champs de l'entité Rapport**:
- `UUID id`
- `TypeRapport typeRapport`
- `String titre`
- `String description`
- `LocalDateTime dateGeneration`
- `LocalDate dateDebut`
- `LocalDate dateFin`
- `UUID ecoleId`
- `FormatExport format`
- `String cheminFichier`
- `String utilisateurCreateur`
- `Map<String, Object> parametresRapport`
- `LocalDateTime createdAt`
- `LocalDateTime updatedAt`

#### ExportResponse.java
**Champs de l'entité Export (sans rapport complet)**:
- `UUID id`
- `UUID rapportId` (au lieu de l'objet Rapport complet)
- `FormatExport format`
- `LocalDateTime dateExport`
- `String utilisateur`
- `String cheminFichier`
- `StatutExport statut`
- `String messageErreur`
- `LocalDateTime createdAt`
- `LocalDateTime updatedAt`

---

### 4. Mappers MapStruct (`/mapper`)

#### RapportMapper.java
```java
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
```
**Méthodes**:
- `toResponse(Rapport)` - Entity vers DTO Response
- `toEntity(GenerateReportRequest)` - DTO Request vers Entity
- `updateEntity(GenerateReportRequest, @MappingTarget Rapport)` - Update Entity

**Mappings spéciaux**:
- Ignore `exports`, `cheminFichier`, `dateGeneration` lors de la création/update
- Utilise `NullValuePropertyMappingStrategy.IGNORE` pour les updates

#### ExportMapper.java
```java
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
```
**Méthodes**:
- `toResponse(Export)` - Entity vers DTO Response
- `toEntity(ExportResponse)` - DTO Response vers Entity

**Mappings spéciaux**:
- `@Mapping(source = "rapport.id", target = "rapportId")` - Map l'ID du rapport seulement
- Ignore `rapport`, `dateExport`, `statut` lors de la création

---

### 5. Services (`/service`)

#### ReportService.java
**Méthodes CRUD**:
- `generateReport(GenerateReportRequest, String)` - Génère un nouveau rapport
- `getReportById(UUID)` - Récupère un rapport par ID
- `getAllReports()` - Récupère tous les rapports
- `getReportsByEcoleId(UUID)` - Récupère les rapports par école
- `getReportsByUtilisateur(String)` - Récupère les rapports par utilisateur
- `deleteReport(UUID)` - Supprime un rapport

**Logique métier**:
- Génération automatique du chemin de fichier basé sur le type et le format
- Logging avec SLF4J
- Gestion transactionnelle avec `@Transactional`
- TODO: Implémenter la logique de génération réelle du rapport (Phase R5)

#### ExportService.java
**Méthodes CRUD**:
- `createExport(UUID rapportId, FormatExport, String)` - Crée un nouvel export
- `getExportById(UUID)` - Récupère un export par ID
- `getExportsByRapport(UUID)` - Récupère les exports d'un rapport
- `getExportsByUtilisateur(String)` - Récupère les exports par utilisateur
- `getExportsByStatut(StatutExport)` - Récupère les exports par statut
- `updateExportStatus(UUID, StatutExport, String)` - Met à jour le statut d'un export
- `deleteExport(UUID)` - Supprime un export

**Logique métier**:
- Validation de l'existence du rapport avant création d'export
- Génération automatique du chemin de fichier d'export
- Initialisation du statut à `EN_COURS` par défaut
- Logging et gestion transactionnelle

---

### 6. Controllers REST (`/controller`)

#### ReportController.java
**Base Path**: `/api/reports`

**Endpoints**:
| Méthode | Path | Rôles | Description |
|---------|------|-------|-------------|
| POST | `/` | ADMIN, TEACHER | Génère un nouveau rapport |
| GET | `/` | ADMIN, TEACHER | Liste tous les rapports |
| GET | `/{id}` | ADMIN, TEACHER | Récupère un rapport |
| GET | `/ecole/{ecoleId}` | ADMIN, TEACHER | Rapports d'une école |
| GET | `/utilisateur/{utilisateur}` | ADMIN, TEACHER | Rapports d'un utilisateur |
| DELETE | `/{id}` | ADMIN | Supprime un rapport |

**Sécurité**:
- `@PreAuthorize` sur chaque endpoint
- Récupération automatique de l'utilisateur via `Authentication`
- Validation des DTOs avec `@Valid`

#### ExportController.java
**Base Path**: `/api/reports/exports`

**Endpoints**:
| Méthode | Path | Rôles | Description |
|---------|------|-------|-------------|
| POST | `/` | ADMIN, TEACHER | Crée un nouvel export |
| GET | `/{id}` | ADMIN, TEACHER | Récupère un export |
| GET | `/rapport/{rapportId}` | ADMIN, TEACHER | Exports d'un rapport |
| GET | `/utilisateur/{utilisateur}` | ADMIN, TEACHER | Exports d'un utilisateur |
| GET | `/statut/{statut}` | ADMIN | Exports par statut |
| PATCH | `/{id}/statut` | ADMIN | Met à jour le statut |
| DELETE | `/{id}` | ADMIN | Supprime un export |

---

## Patterns utilisés

### 1. Architecture en couches
```
Controller → Service → Repository → Entity
     ↓           ↓
   DTO       Mapper
```

### 2. Validation
- Jakarta Validation (`@NotNull`, `@NotBlank`, `@Valid`)
- Validation métier dans les services

### 3. Exception handling
- `ResourceNotFoundException` pour les ressources introuvables
- `GlobalExceptionHandler` pour centraliser la gestion des erreurs

### 4. Sécurité
- JWT Authentication via `JwtAuthenticationFilter`
- Authorization avec `@PreAuthorize`
- Récupération de l'utilisateur courant via `Authentication`

### 5. Transactions
- `@Transactional` sur les méthodes de service
- `readOnly = true` pour les opérations de lecture

### 6. Logging
- SLF4J avec Lombok `@Slf4j`
- Logs INFO pour les opérations importantes
- Logs DEBUG pour les opérations de lecture

---

## Configuration MapStruct

Le `pom.xml` contient la configuration correcte pour MapStruct + Lombok:

```xml
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.5.5.Final</version>
</dependency>

<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <configuration>
        <annotationProcessorPaths>
            <path>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
            </path>
            <path>
                <groupId>org.mapstruct</groupId>
                <artifactId>mapstruct-processor</artifactId>
                <version>1.5.5.Final</version>
            </path>
            <path>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok-mapstruct-binding</artifactId>
                <version>0.2.0</version>
            </path>
        </annotationProcessorPaths>
    </configuration>
</plugin>
```

---

## Compilation

✅ **BUILD SUCCESS**
```bash
cd /Users/storzen/DocsNoBackup/timely/services/report-service
mvn clean package -DskipTests
```

---

## Prochaines étapes

### Phase R4 - KPI + Dashboard
- Implémenter le calcul des KPIs
- Créer les endpoints de statistiques
- Implémenter les dashboards

### Phase R5 - Génération PDF/Excel
- Implémenter la génération réelle des rapports PDF
- Implémenter l'export Excel avec Apache POI
- Implémenter l'export CSV
- Gestion asynchrone des exports longs

---

## Documentation

- **ENDPOINTS.md** - Documentation complète des endpoints REST avec exemples
- **CRUD_IMPLEMENTATION.md** - Ce fichier, détails d'implémentation

---

## Structure des packages

```
com.timely.reportservice
├── controller
│   ├── ExportController.java
│   └── ReportController.java
├── dto
│   ├── request
│   │   └── GenerateReportRequest.java
│   └── response
│       ├── ExportResponse.java
│       └── RapportResponse.java
├── entity
│   ├── Export.java
│   ├── Rapport.java
│   └── enums
│       ├── FormatExport.java
│       ├── StatutExport.java
│       └── TypeRapport.java
├── mapper
│   ├── ExportMapper.java
│   └── RapportMapper.java
├── repository
│   ├── ExportRepository.java
│   └── RapportRepository.java
└── service
    ├── ExportService.java
    └── ReportService.java
```
