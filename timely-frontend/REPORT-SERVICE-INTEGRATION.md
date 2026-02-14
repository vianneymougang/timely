# Intégration Report Service - Frontend Angular

## Vue d'ensemble

Intégration complète du Report Service dans le frontend Angular de Timely. Cette intégration fournit des rapports détaillés, des statistiques et un tableau de bord interactif pour les administrateurs.

## Architecture

### Structure des fichiers

```
/src/app/
├── core/
│   ├── models/
│   │   └── report.model.ts                 # Modèles TypeScript pour rapports
│   └── services/
│       ├── report.service.ts               # Service principal Report
│       └── report.service.spec.ts          # Tests unitaires
│
└── features/admin/
    ├── dashboard/
    │   ├── dashboard.component.ts          # Dashboard mis à jour
    │   ├── dashboard.component.html
    │   └── widgets/
    │       ├── kpi-card.component.ts       # Widget KPI réutilisable
    │       ├── recent-activity.component.ts # Widget activités récentes
    │       └── alerts-widget.component.ts  # Widget alertes système
    │
    └── reports/
        ├── reports.component.ts            # Composant principal avec onglets
        ├── reports.component.html
        ├── availability/
        │   └── availability-report.component.ts
        ├── workload/
        │   └── workload-report.component.ts
        ├── rooms/
        │   └── room-utilization-report.component.ts
        └── audit/
            └── audit-trail.component.ts
```

## Fonctionnalités

### 1. Dashboard Administrateur (`/admin/dashboard`)

Le dashboard a été amélioré pour afficher :

- **KPIs Globaux** (4 cartes)
  - Total Enseignants
  - Total Salles (avec taux d'occupation)
  - Total Cours (avec cours non planifiés)
  - Conflits Actifs

- **Graphiques de tendances**
  - Occupation des salles par jour
  - Charge des enseignants
  - Utilisation des ressources

- **Widgets interactifs**
  - Activités récentes (journal d'audit)
  - Alertes système avec niveaux de sévérité
  - Refresh automatique toutes les 5 minutes

### 2. Module Rapports (`/admin/reports`)

Page complète avec 4 onglets de rapports :

#### A. Rapport Disponibilités
- Total enseignants vs enseignants avec disponibilités
- Taux de couverture
- Répartition par jour de la semaine
- Liste des enseignants sans disponibilités

#### B. Rapport Utilisation des Salles
- Taux d'occupation moyen
- Répartition par type de salle
- Top salles les plus utilisées
- Salles sous-utilisées
- Occupation par jour et par horaire

#### C. Rapport Charge Horaire
- Statistiques globales de charge
- Tableau détaillé par enseignant
  - Heures CM/TD/TP
  - Taux de charge (avec barre de progression)
  - Statut (sous-chargé, normal, surchargé)
- Détail des cours assignés par enseignant

#### D. Journal d'Audit
- Historique complet des actions
- Filtres avancés (action, entité, recherche)
- Pagination
- Codes couleur par type d'action

### 3. Exports

Chaque rapport peut être exporté en :
- **PDF** (pour impression)
- **Excel** (pour analyse)

## API Endpoints

Le service Report se connecte aux endpoints suivants :

```typescript
GET  /api/reports/availability       - Rapport disponibilités
GET  /api/reports/room-utilization   - Rapport utilisation salles
GET  /api/reports/workload           - Rapports charge horaire
GET  /api/reports/workload/{id}      - Charge horaire enseignant
GET  /api/reports/kpis                - KPIs globaux
GET  /api/reports/dashboard           - Stats dashboard
GET  /api/reports/audit               - Journal d'audit
GET  /api/reports/export/pdf/{type}   - Export PDF
GET  /api/reports/export/excel/{type} - Export Excel
```

## Modèles de Données

### GlobalKPIs
```typescript
{
  totalEnseignants: number
  totalSalles: number
  totalCours: number
  totalReservations: number
  tauxOccupationGlobal: number      // 0-100
  tauxDisponibilite: number         // 0-100
  coursNonPlanifies: number
  conflitsActifs: number
  tauxUtilisationEnseignants: number
  derniereMiseAJour: string
}
```

### AvailabilityReport
```typescript
{
  totalEnseignants: number
  enseignantsAvecDisponibilites: number
  tauxCouverture: number
  disponibilitesParJour: { [jour: string]: number }
  enseignantsSansDisponibilites: UserSummary[]
  periodeAnalyse: { dateDebut: string, dateFin: string }
}
```

### WorkloadReport
```typescript
{
  enseignantId: string
  nom: string
  prenom: string
  totalHeures: number
  heuresCM: number
  heuresTD: number
  heuresTP: number
  tauxCharge: number
  status: 'SOUS_CHARGE' | 'NORMAL' | 'SURCHARGE'
  coursAssignes: CoursAssigne[]
}
```

## Utilisation

### Importer le service

```typescript
import { ReportService } from '@core/services/report.service';

export class MyComponent {
  private reportService = inject(ReportService);

  loadData() {
    this.reportService.getDashboardStats().subscribe(stats => {
      // Utiliser les données
    });
  }
}
```

### Appliquer des filtres

```typescript
const filters: ReportFilterRequest = {
  startDate: '2026-01-01',
  endDate: '2026-01-31',
  ecoleId: 'school-123'
};

this.reportService.getAvailabilityReport(filters).subscribe(...);
```

### Exporter un rapport

```typescript
this.reportService.exportReportPDF('AVAILABILITY', filters).subscribe(blob => {
  const filename = this.reportService.generateExportFilename('AVAILABILITY', 'pdf');
  this.reportService.downloadFile(blob, filename);
});
```

## State Management

Utilisation des **Signals Angular** pour le state management réactif :

```typescript
kpis = signal<GlobalKPIs | null>(null);
isLoading = signal<boolean>(true);
error = signal<string | null>(null);
```

## Patterns Utilisés

1. **Standalone Components** : Tous les composants sont standalone (pas de modules)
2. **Signals** : State management réactif avec Angular Signals
3. **Reactive Programming** : RxJS pour les appels API
4. **Auto-refresh** : Dashboard se rafraîchit automatiquement toutes les 5 minutes
5. **Lazy Loading** : Routes chargées à la demande
6. **TypeScript Strict** : Types stricts pour tous les modèles

## Styles

Utilisation de **Tailwind CSS** pour le styling :
- Composants responsives
- Thème cohérent avec le reste de l'application
- Animations et transitions fluides
- Dark mode ready (structure en place)

## Tests

Tests unitaires pour le service Report :
- Test de chaque méthode API
- Test des filtres et paramètres
- Test des exports PDF/Excel
- Mocking avec HttpClientTestingModule

Lancer les tests :
```bash
npm run test
```

## Routes

Nouvelles routes ajoutées dans `admin.routes.ts` :

```typescript
{
  path: 'reports',
  loadComponent: () => import('./reports/reports.component')
    .then(m => m.ReportsComponent)
}
```

## Dépendances

Aucune dépendance externe supplémentaire requise. Utilise uniquement :
- Angular 20.x
- RxJS
- HttpClient
- Tailwind CSS (déjà configuré)

## Configuration Backend

Le Report Service doit être configuré et accessible sur le port **8096** :

```yaml
# application.yaml du report-service
server:
  port: 8096

spring:
  application:
    name: report-service
```

## Sécurité

- Toutes les requêtes utilisent JWT pour l'authentification
- Seuls les utilisateurs avec rôle ADMIN peuvent accéder aux rapports
- Les exports sont sécurisés et nécessitent une authentification

## Performance

Optimisations implémentées :
- Lazy loading des composants
- Pagination pour grandes listes (audit trail)
- Debouncing sur les recherches
- Caching au niveau du service (auto-refresh)
- Build production optimisé

## Accessibilité

- Attributs ARIA sur les éléments interactifs
- Navigation au clavier
- Contraste de couleurs conforme WCAG
- Labels descriptifs pour tous les champs

## Futures Améliorations

1. **Graphiques avancés** : Intégration de Chart.js ou ngx-charts
2. **Filtres persistants** : Sauvegarde des filtres dans localStorage
3. **Rapports favoris** : Système de favoris pour rapports fréquents
4. **Export planifié** : Génération automatique de rapports
5. **Alertes personnalisées** : Configuration d'alertes par utilisateur
6. **WebSockets** : Mise à jour en temps réel des KPIs

## Checklist de Vérification

- [x] Modèles TypeScript créés (`report.model.ts`)
- [x] Service Report implémenté (`report.service.ts`)
- [x] Tests unitaires du service (`report.service.spec.ts`)
- [x] Dashboard mis à jour avec KPIs
- [x] Widgets dashboard créés
- [x] Composant rapports principal créé
- [x] 4 rapports détaillés implémentés
- [x] Exports PDF/Excel fonctionnels
- [x] Routes configurées
- [x] Build production validé
- [x] Documentation complète

## Support

Pour toute question ou problème :
1. Vérifier les logs du report-service (port 8096)
2. Vérifier les logs de la console navigateur
3. Vérifier que l'API Gateway route correctement vers report-service
4. Vérifier l'authentification JWT

## Auteur

Intégration réalisée pour le projet Timely - IUSJC
Date : Février 2026
Version : 1.0.0
