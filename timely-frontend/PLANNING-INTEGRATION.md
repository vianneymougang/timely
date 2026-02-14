# Intégration Planning Service - Frontend Angular

## Vue d'ensemble

Intégration complète du Planning Service backend dans le frontend Angular avec génération automatique d'emplois du temps, visualisation en grille, gestion des conflits et exports PDF/iCal.

## Architecture créée

```
timely-frontend/src/app/
├── core/
│   ├── models/
│   │   └── planning.model.ts              # Modèles TypeScript complets
│   └── services/
│       └── planning.service.ts            # Service API Planning
├── features/admin/schedule/
│   ├── schedule.component.ts              # Composant principal avec tabs
│   ├── schedule.component.html
│   ├── schedule.routes.ts                 # Routes configurées
│   ├── generator/
│   │   ├── schedule-generator.component.ts
│   │   ├── schedule-generator.component.html
│   │   └── schedule-generator.component.scss
│   ├── viewer/
│   │   ├── schedule-viewer.component.ts
│   │   ├── schedule-viewer.component.html
│   │   └── schedule-viewer.component.scss
│   └── list/
│       ├── schedule-list.component.ts
│       ├── schedule-list.component.html
│       └── schedule-list.component.scss
└── shared/components/schedule-grid/
    ├── schedule-grid.component.ts         # Composant réutilisable
    ├── schedule-grid.component.html
    └── schedule-grid.component.scss
```

## Fonctionnalités implémentées

### 1. Service Planning (`planning.service.ts`)

**Génération automatique:**
- `generateSchedule(request)` - Génère un emploi du temps automatiquement

**CRUD EmploiDuTemps:**
- `createEmploiDuTemps(request)` - Création manuelle
- `getEmploiDuTempsById(id)` - Récupération par ID
- `getAllEmploisDuTemps(page, size)` - Liste paginée
- `searchEmploisDuTemps(request)` - Recherche avancée
- `updateEmploiDuTemps(id, request)` - Mise à jour
- `deleteEmploiDuTemps(id)` - Suppression
- `validateEmploi(id)` - Validation
- `publishEmploi(id)` - Publication

**CRUD Créneaux:**
- `createCreneau(emploiId, request)` - Création
- `getCreneauxByEmploi(emploiId, page, size)` - Liste
- `getCreneauById(emploiId, creneauId)` - Détail
- `updateCreneau(emploiId, creneauId, request)` - Mise à jour
- `deleteCreneau(emploiId, creneauId)` - Suppression

**Gestion des conflits:**
- `getConflitsByEmploi(emploiId)` - Liste des conflits
- `getConflitById(emploiId, conflitId)` - Détail conflit
- `countNonResolus(emploiId)` - Compte conflits non résolus
- `resolveConflit(emploiId, conflitId, resolution)` - Résolution

**Export:**
- `exportToPDF(id)` - Export PDF
- `exportToICal(id)` - Export iCalendar
- `downloadFile(blob, filename)` - Helper téléchargement

### 2. Modèles TypeScript (`planning.model.ts`)

**Enums:**
- `PeriodeEmploi` - SEMESTRE_1, SEMESTRE_2, ANNUEL
- `StatutEmploi` - DRAFT, VALIDATED, PUBLISHED, ARCHIVED
- `TypeRecurrence` - UNIQUE, HEBDOMADAIRE, BIHEBDOMADAIRE
- `StatutCreneau` - DISPONIBLE, RESERVE, CONFIRME, ANNULE
- `TypeConflit` - ENSEIGNANT, SALLE, GROUPE, HORAIRE
- `Severite` - MINEURE, MOYENNE, CRITIQUE
- `StatutResolution` - NON_RESOLU, EN_COURS, RESOLU, IGNORE

**Interfaces Request:**
- `GeneratePlanningRequest` - Paramètres de génération
- `EmploiDuTempsRequest` - Création emploi du temps
- `CreneauRequest` - Création créneau
- `SearchPlanningRequest` - Recherche avancée

**Interfaces Response:**
- `GeneratePlanningResponse` - Résultat de génération
- `EmploiDuTempsResponse` - Emploi du temps complet
- `CreneauResponse` - Détail créneau
- `ConflitResponse` - Détail conflit
- `Page<T>` - Pagination générique

**Helpers:**
- `DayOfWeekLabels` - Labels en français pour les jours
- `StatutEmploiLabels` - Labels pour statuts
- `TypeConflitLabels` - Labels pour types de conflits
- `SeveriteLabels` - Labels pour sévérités

### 3. Composant Génération (`schedule-generator.component`)

**Formulaire de configuration:**
- ID école (requis)
- Date début/fin (requis)
- Période (SEMESTRE_1, SEMESTRE_2, ANNUEL)
- Créneaux par jour (défaut: 6)
- Heures début/fin journée (défaut: 08:00-18:00)
- Durée créneau (défaut: 90 min)
- Pause entre créneaux (défaut: 15 min)

**Affichage des résultats:**
- Taux de réussite avec couleur (vert >90%, jaune >70%, rouge <70%)
- Cours planifiés / total
- Conflits détectés
- Durée de génération
- Liste des cours non planifiés avec raisons
- Bouton pour visualiser l'emploi du temps généré

**Gestion d'état:**
- Loading spinner pendant génération
- Messages d'erreur clairs
- Validation formulaire
- Réinitialisation formulaire

### 4. Composant Visualisation (`schedule-viewer.component`)

**Grille horaire hebdomadaire:**
- Tableau avec jours en colonnes (Lundi-Vendredi)
- Heures en lignes
- Créneaux colorés par type
- Tooltips avec détails (cours, salle, enseignant)
- Responsive avec scroll horizontal

**Informations emploi du temps:**
- Statut (DRAFT, VALIDATED, PUBLISHED, ARCHIVED)
- Période, dates, nombre de créneaux
- Badge statut coloré

**Actions disponibles:**
- Détecter les conflits
- Export PDF
- Export iCal
- Valider (si DRAFT)
- Publier (si VALIDATED)

**Onglets:**
- Grille horaire
- Conflits (avec badge nombre)

**Gestion des conflits:**
- Liste des conflits avec sévérité
- Type de conflit
- Description et suggestion
- Statut résolution
- Bouton résoudre pour conflits non résolus
- Couleurs par sévérité (rouge=CRITIQUE, jaune=MOYENNE, bleu=MINEURE)

### 5. Composant Liste (`schedule-list.component`)

**Filtres de recherche:**
- Date début/fin
- Statut (tous, DRAFT, VALIDATED, PUBLISHED, ARCHIVED)
- Boutons Rechercher/Réinitialiser

**Liste des emplois du temps:**
- Cards cliquables avec résumé
- Période, dates, nombre créneaux, conflits
- Badge statut coloré
- Bouton "Voir" pour détail
- Bouton "Supprimer" pour brouillons

**Pagination:**
- Contrôles Précédent/Suivant
- Affichage nombre résultats et page courante
- Gestion désactivation boutons

### 6. Composant Réutilisable (`schedule-grid.component`)

**Composant partagé:**
- Input: liste de créneaux
- Input: jours de la semaine à afficher
- Output: événement créneau cliqué
- Génération automatique de la grille
- Couleurs par statut créneau
- Styles responsive

## Endpoints API utilisés

Base URL: `http://localhost:8090/api/planning/plannings`

```
POST   /generate                           # Génération automatique
GET    /{id}                               # Détail emploi du temps
GET    /                                   # Liste paginée
GET    /search                             # Recherche avancée
PUT    /{id}                               # Mise à jour
DELETE /{id}                               # Suppression
PUT    /{id}/validate                      # Validation
PUT    /{id}/publish                       # Publication

POST   /{emploiId}/creneaux                # Créer créneau
GET    /{emploiId}/creneaux                # Liste créneaux
GET    /{emploiId}/creneaux/{creneauId}   # Détail créneau
PUT    /{emploiId}/creneaux/{creneauId}   # Mettre à jour créneau
DELETE /{emploiId}/creneaux/{creneauId}   # Supprimer créneau

GET    /{emploiId}/conflits                # Liste conflits
GET    /{emploiId}/conflits/{conflitId}   # Détail conflit
GET    /{emploiId}/conflits/count-non-resolus  # Compte conflits
PUT    /{emploiId}/conflits/{conflitId}/resolve # Résoudre conflit

GET    /{id}/export/pdf                    # Export PDF
GET    /{id}/export/ical                   # Export iCal
```

## Routes Frontend

```typescript
/admin/schedule              # Composant principal (onglets Générer/Liste)
/admin/schedule/viewer/:id   # Visualisation emploi du temps
```

## Technologies utilisées

- **Angular 19** - Framework standalone components
- **RxJS** - Programmation réactive
- **Signals** - State management moderne
- **Reactive Forms** - Formulaires
- **Tailwind CSS** - Styling
- **HttpClient** - Appels API REST

## Sécurité

- Tous les appels API utilisent les intercepteurs HTTP existants
- Headers Authorization JWT automatiques
- Role-based access control (ADMIN, TEACHER)
- Validation côté client et serveur

## UX/UI

**Design System:**
- Couleurs cohérentes (bleu=principal, vert=succès, rouge=danger, jaune=warning)
- Loading spinners pendant chargements
- Messages d'erreur clairs
- Confirmations pour actions critiques
- États vides avec illustrations

**Responsive:**
- Mobile-first avec Tailwind
- Grilles avec scroll horizontal sur mobile
- Formulaires adaptés aux petits écrans

## État de compilation

- ✅ Compilation production réussie
- ✅ Aucune erreur TypeScript
- ✅ Warnings mineurs non bloquants
- ✅ Bundle size acceptable

## Prochaines étapes suggérées

1. **Tests unitaires** - Créer tests pour planning.service.ts et composants
2. **Tests E2E** - Scenarios de génération et visualisation
3. **Amélioration UX:**
   - Drag & drop pour déplacer créneaux
   - Édition inline des créneaux
   - Vue calendrier mensuel
4. **Fonctionnalités avancées:**
   - Génération par filière/classe spécifique
   - Templates d'emplois du temps
   - Historique des modifications
   - Comparaison de versions
5. **Intégration:**
   - Notifications en temps réel (via WebSocket)
   - Synchronisation avec Google Calendar
   - Import depuis fichiers Excel

## Notes importantes

- Tous les composants sont **standalone** (pas de NgModule)
- Utilisation de **signals** pour le state management
- Compatible avec le **planning-service** sur port 8093
- Authentification via **API Gateway** sur port 8090
- Format dates: ISO 8601 (YYYY-MM-DD)
- Format heures: HH:mm

## Support

Pour toute question ou amélioration, se référer à:
- Documentation Planning Service: `/services/planning-service/README.md`
- Code source backend: `/services/planning-service/src/`
- Code source frontend: `/timely-frontend/src/app/features/admin/schedule/`
