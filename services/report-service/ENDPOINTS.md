# Report Service - Endpoints REST

## Base URL
- **Port**: 8096
- **Base Path**: `/api/reports`

## Rapports Endpoints

### POST /api/reports
Génère un nouveau rapport

**Authorization**: `ROLE_ADMIN`, `ROLE_TEACHER`

**Request Body**:
```json
{
  "typeRapport": "OCCUPATION_SALLES",
  "titre": "Rapport d'occupation Janvier 2026",
  "description": "Analyse complète de l'occupation des salles",
  "dateDebut": "2026-01-01",
  "dateFin": "2026-01-31",
  "ecoleId": "uuid",
  "format": "PDF",
  "parametresRapport": {
    "includeWeekends": false,
    "detailLevel": "HIGH"
  }
}
```

**Response**: `201 CREATED`
```json
{
  "id": "uuid",
  "typeRapport": "OCCUPATION_SALLES",
  "titre": "Rapport d'occupation Janvier 2026",
  "description": "Analyse complète de l'occupation des salles",
  "dateGeneration": "2026-02-09T00:00:00",
  "dateDebut": "2026-01-01",
  "dateFin": "2026-01-31",
  "ecoleId": "uuid",
  "format": "PDF",
  "cheminFichier": "/reports/occupation_salles/occupation_salles_2026-02-09T00-00-00.pdf",
  "utilisateurCreateur": "john.doe@example.com",
  "parametresRapport": {
    "includeWeekends": false,
    "detailLevel": "HIGH"
  },
  "createdAt": "2026-02-09T00:00:00",
  "updatedAt": "2026-02-09T00:00:00"
}
```

---

### GET /api/reports
Récupère tous les rapports

**Authorization**: `ROLE_ADMIN`, `ROLE_TEACHER`

**Response**: `200 OK`
```json
[
  {
    "id": "uuid",
    "typeRapport": "OCCUPATION_SALLES",
    "titre": "Rapport d'occupation Janvier 2026",
    ...
  }
]
```

---

### GET /api/reports/{id}
Récupère un rapport par son ID

**Authorization**: `ROLE_ADMIN`, `ROLE_TEACHER`

**Path Parameters**:
- `id` (UUID): ID du rapport

**Response**: `200 OK`
```json
{
  "id": "uuid",
  "typeRapport": "OCCUPATION_SALLES",
  ...
}
```

---

### GET /api/reports/ecole/{ecoleId}
Récupère tous les rapports d'une école

**Authorization**: `ROLE_ADMIN`, `ROLE_TEACHER`

**Path Parameters**:
- `ecoleId` (UUID): ID de l'école

**Response**: `200 OK`
```json
[
  {
    "id": "uuid",
    "typeRapport": "OCCUPATION_SALLES",
    "ecoleId": "uuid",
    ...
  }
]
```

---

### GET /api/reports/utilisateur/{utilisateur}
Récupère tous les rapports créés par un utilisateur

**Authorization**: `ROLE_ADMIN`, `ROLE_TEACHER`

**Path Parameters**:
- `utilisateur` (String): Nom d'utilisateur ou email du créateur

**Response**: `200 OK`
```json
[
  {
    "id": "uuid",
    "utilisateurCreateur": "john.doe@example.com",
    ...
  }
]
```

---

### DELETE /api/reports/{id}
Supprime un rapport

**Authorization**: `ROLE_ADMIN`

**Path Parameters**:
- `id` (UUID): ID du rapport

**Response**: `204 NO CONTENT`

---

## Exports Endpoints

### POST /api/reports/exports
Crée un nouvel export d'un rapport existant

**Authorization**: `ROLE_ADMIN`, `ROLE_TEACHER`

**Query Parameters**:
- `rapportId` (UUID): ID du rapport à exporter
- `format` (FormatExport): Format de l'export (PDF, EXCEL, CSV)

**Response**: `201 CREATED`
```json
{
  "id": "uuid",
  "rapportId": "uuid",
  "format": "EXCEL",
  "dateExport": "2026-02-09T00:00:00",
  "utilisateur": "john.doe@example.com",
  "cheminFichier": "/exports/occupation_salles/uuid_2026-02-09T00-00-00.xlsx",
  "statut": "EN_COURS",
  "messageErreur": null,
  "createdAt": "2026-02-09T00:00:00",
  "updatedAt": "2026-02-09T00:00:00"
}
```

---

### GET /api/reports/exports/{id}
Récupère un export par son ID

**Authorization**: `ROLE_ADMIN`, `ROLE_TEACHER`

**Path Parameters**:
- `id` (UUID): ID de l'export

**Response**: `200 OK`
```json
{
  "id": "uuid",
  "rapportId": "uuid",
  "format": "EXCEL",
  ...
}
```

---

### GET /api/reports/exports/rapport/{rapportId}
Récupère tous les exports d'un rapport

**Authorization**: `ROLE_ADMIN`, `ROLE_TEACHER`

**Path Parameters**:
- `rapportId` (UUID): ID du rapport

**Response**: `200 OK`
```json
[
  {
    "id": "uuid",
    "rapportId": "uuid",
    "format": "PDF",
    "statut": "TERMINE",
    ...
  }
]
```

---

### GET /api/reports/exports/utilisateur/{utilisateur}
Récupère tous les exports d'un utilisateur

**Authorization**: `ROLE_ADMIN`, `ROLE_TEACHER`

**Path Parameters**:
- `utilisateur` (String): Nom d'utilisateur ou email

**Response**: `200 OK`
```json
[
  {
    "id": "uuid",
    "utilisateur": "john.doe@example.com",
    ...
  }
]
```

---

### GET /api/reports/exports/statut/{statut}
Récupère tous les exports par statut

**Authorization**: `ROLE_ADMIN`

**Path Parameters**:
- `statut` (StatutExport): Statut de l'export (EN_COURS, TERMINE, ERREUR)

**Response**: `200 OK`
```json
[
  {
    "id": "uuid",
    "statut": "EN_COURS",
    ...
  }
]
```

---

### PATCH /api/reports/exports/{id}/statut
Met à jour le statut d'un export

**Authorization**: `ROLE_ADMIN`

**Path Parameters**:
- `id` (UUID): ID de l'export

**Query Parameters**:
- `statut` (StatutExport): Nouveau statut (EN_COURS, TERMINE, ERREUR)
- `messageErreur` (String, optional): Message d'erreur si statut = ERREUR

**Response**: `204 NO CONTENT`

---

### DELETE /api/reports/exports/{id}
Supprime un export

**Authorization**: `ROLE_ADMIN`

**Path Parameters**:
- `id` (UUID): ID de l'export

**Response**: `204 NO CONTENT`

---

## Enums

### TypeRapport
- `OCCUPATION_SALLES`
- `PERFORMANCE_ENSEIGNANTS`
- `FREQUENTATION_COURS`
- `STATISTIQUES_RESERVATIONS`
- `TABLEAU_BORD`

### FormatExport
- `PDF`
- `EXCEL`
- `CSV`

### StatutExport
- `EN_COURS`
- `TERMINE`
- `ERREUR`

---

## Error Responses

### 404 Not Found
```json
{
  "timestamp": "2026-02-09T00:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Rapport non trouvé avec l'id: {id}",
  "path": "/api/reports/{id}"
}
```

### 401 Unauthorized
```json
{
  "timestamp": "2026-02-09T00:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Token JWT invalide ou expiré"
}
```

### 403 Forbidden
```json
{
  "timestamp": "2026-02-09T00:00:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Accès refusé"
}
```

### 400 Bad Request
```json
{
  "timestamp": "2026-02-09T00:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Le type de rapport est obligatoire",
  "path": "/api/reports"
}
```
