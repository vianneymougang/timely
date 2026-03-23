# Composants de Gestion des Conflits d'Emploi du Temps

Cette documentation décrit les composants Angular standalone créés pour la gestion professionnelle des conflits d'emplois du temps dans l'application Timely.

## Architecture

### 1. ConflictStatsComponent

**Fichier**: `conflict-stats/conflict-stats.component.ts`

**Description**: Widget de statistiques affichant une vue d'ensemble des conflits détectés.

**Inputs**:
- `conflicts: ConflitResponse[]` - Liste des conflits à analyser

**Fonctionnalités**:
- Affichage du nombre total de conflits
- Répartition par sévérité (CRITIQUE, MOYENNE, MINEURE) avec barres de progression
- Taux de résolution calculé automatiquement
- Statut de résolution (RESOLU, EN_COURS, NON_RESOLU)
- Alerte visuelle si des conflits critiques restent non résolus

**Utilisation**:
```html
<app-conflict-stats [conflicts]="conflits()"></app-conflict-stats>
```

---

### 2. ConflictDetailComponent

**Fichier**: `conflict-detail/conflict-detail.component.ts`

**Description**: Modal de visualisation détaillée d'un conflit.

**Inputs**:
- `conflict: ConflitResponse | null` - Le conflit à afficher
- `isOpen: Signal<boolean>` - État d'ouverture de la modal

**Outputs**:
- `close: EventEmitter<void>` - Émis lors de la fermeture
- `resolve: EventEmitter<string>` - Émis pour résoudre le conflit (renvoie l'ID)

**Fonctionnalités**:
- Affichage détaillé du conflit (type, sévérité, description)
- Suggestion de résolution si disponible
- Timeline de détection et résolution
- Informations complémentaires (IDs)
- Bouton d'action pour résoudre directement

**Utilisation**:
```html
<app-conflict-detail
  [conflict]="selectedConflitForDetail()"
  [isOpen]="showDetailModal"
  (close)="closeDetailModal()"
  (resolve)="resolveConflitFromDetail($event)">
</app-conflict-detail>
```

---

### 3. ConflictResolverComponent

**Fichier**: `conflict-resolver/conflict-resolver.component.ts`

**Description**: Modal de résolution de conflit avec formulaire réactif.

**Inputs**:
- `conflict: ConflitResponse | null` - Le conflit à résoudre
- `isOpen: Signal<boolean>` - État d'ouverture de la modal

**Outputs**:
- `close: EventEmitter<void>` - Émis lors de la fermeture
- `resolve: EventEmitter<ResolutionData>` - Émis avec les données de résolution

**Types de résolution disponibles**:
1. **DEPLACER_SALLE** - Déplacer vers une autre salle
2. **CHANGER_HORAIRE** - Modifier l'horaire du créneau
3. **REASSIGNER_ENSEIGNANT** - Attribuer un autre enseignant
4. **ANNULER_COURS** - Annuler le cours en conflit
5. **MANUEL** - Résolution manuelle avec commentaire

**Structure ResolutionData**:
```typescript
interface ResolutionData {
  type: ResolutionType;
  commentaire: string;        // Obligatoire, min 10 caractères
  nouvelleSalle?: string;     // Requis si type = DEPLACER_SALLE
  nouvelHoraire?: string;     // Requis si type = CHANGER_HORAIRE
  nouvelEnseignant?: string;  // Requis si type = REASSIGNER_ENSEIGNANT
}
```

**Fonctionnalités**:
- Formulaire réactif avec validation
- Champs dynamiques selon le type de résolution
- Prévisualisation de l'impact de la résolution
- Validation stricte des champs obligatoires
- UI responsive et accessible

**Utilisation**:
```html
<app-conflict-resolver
  [conflict]="selectedConflitForResolution()"
  [isOpen]="showResolverModal"
  (close)="closeResolverModal()"
  (resolve)="resolveConflit($event)">
</app-conflict-resolver>
```

---

## Intégration dans schedule-viewer

### Nouveaux Signals

```typescript
// Filtres
filterSeverite = signal<string | null>(null);
filterType = signal<string | null>(null);
filterStatut = signal<string | null>(null);
sortBy = signal<'date' | 'severite' | 'type'>('severite');

// Sélection multiple
selectedConflits = signal<Set<string>>(new Set());

// Modals
showResolverModal = signal(false);
showDetailModal = signal(false);
selectedConflitForResolution = signal<ConflitResponse | null>(null);
selectedConflitForDetail = signal<ConflitResponse | null>(null);

// Toast notifications
toastMessage = signal<string | null>(null);
toastType = signal<'success' | 'error' | 'info'>('success');
```

### Computed Signals

```typescript
// Conflits filtrés et triés
filteredConflits = computed(() => {
  // Applique les filtres et le tri
});

// Vérifie si tous les conflits sont sélectionnés
allSelected = computed(() => {
  // Logique de sélection complète
});
```

### Nouvelles Méthodes

#### Gestion des modals
- `openResolverModal(conflit: ConflitResponse)` - Ouvre la modal de résolution
- `openDetailModal(conflit: ConflitResponse)` - Ouvre la modal de détails
- `closeResolverModal()` - Ferme la modal de résolution
- `closeDetailModal()` - Ferme la modal de détails

#### Résolution de conflits
- `resolveConflit(data: ResolutionData)` - Résout un conflit avec les données du formulaire
- `resolveConflitFromDetail(conflitId: string)` - Ouvre la résolution depuis la vue détaillée

#### Sélection multiple
- `toggleConflitSelection(conflitId: string)` - Toggle la sélection d'un conflit
- `toggleSelectAll()` - Sélectionne/désélectionne tous les conflits

#### Actions groupées
- `markSelectedAsInProgress()` - Marque les conflits sélectionnés comme "En cours"
- `exportConflitsCSV()` - Exporte les conflits en CSV
- `archiveResolvedConflicts()` - Archive les conflits résolus

#### Filtres et tri
- `setFilterSeverite(severite: string | null)` - Filtre par sévérité
- `setFilterType(type: string | null)` - Filtre par type
- `setFilterStatut(statut: string | null)` - Filtre par statut
- `setSortBy(sortBy: 'date' | 'severite' | 'type')` - Change le tri
- `clearFilters()` - Réinitialise tous les filtres

#### Notifications
- `showToast(message: string, type: 'success' | 'error' | 'info')` - Affiche une notification toast

---

## Fonctionnalités implémentées

### ✅ Critères de succès

1. **Modal de résolution professionnelle** - Formulaire réactif complet avec validation
2. **Filtres fonctionnels** - Par sévérité, type et statut
3. **Tri fonctionnel** - Par date, sévérité ou type
4. **Sélection multiple** - Checkboxes avec actions groupées
5. **Vue détaillée** - Modal avec toutes les informations d'un conflit
6. **Statistiques visuelles** - Widget avec graphiques et métriques
7. **Notifications/toasts** - Toast animé après chaque action
8. **Code propre** - TypeScript strict, commenté et organisé
9. **UI responsive** - Design adaptatif mobile-friendly
10. **Accessibilité** - ARIA labels, keyboard navigation, focus visible

### Exports CSV

Le système génère un fichier CSV avec les colonnes suivantes:
- ID du conflit
- Type de conflit
- Sévérité
- Statut de résolution
- Description
- Suggestion de résolution
- Date de détection

### Notifications

Les toasts s'affichent automatiquement pour:
- ✅ Résolution réussie
- ❌ Erreur lors de la résolution
- ℹ️ Informations (aucun conflit sélectionné, etc.)

---

## Style et Design

### Tailwind CSS
Tous les composants utilisent Tailwind CSS pour un style cohérent et responsive.

### Animations
- Slide-up pour les toasts
- Fade-in pour les modals
- Shake pour les erreurs de validation
- Transitions douces sur tous les éléments interactifs

### Accessibilité
- Labels ARIA sur tous les éléments interactifs
- Focus visible avec outline bleu
- Navigation au clavier supportée
- Contraste des couleurs respecté (WCAG AA)

---

## Technologies utilisées

- **Angular 18+** - Framework principal
- **Angular Signals** - Gestion réactive de l'état
- **Reactive Forms** - Formulaires avec validation
- **Tailwind CSS** - Styling et responsive design
- **TypeScript strict** - Type safety complet

---

## Exemple d'utilisation complète

```typescript
// Dans schedule-viewer.component.ts
export class ScheduleViewerComponent implements OnInit {
  // ... autres propriétés

  openResolverModal(conflit: ConflitResponse): void {
    this.selectedConflitForResolution.set(conflit);
    this.showResolverModal.set(true);
  }

  resolveConflit(data: ResolutionData): void {
    const emploi = this.emploiDuTemps();
    const conflit = this.selectedConflitForResolution();
    if (!emploi || !conflit) return;

    // Construire le message de résolution
    let resolution = this.buildResolutionMessage(data);

    this.planningService.resolveConflit(emploi.id, conflit.id, resolution)
      .pipe(catchError(error => {
        this.showToast('Erreur lors de la résolution', 'error');
        return of(null);
      }))
      .subscribe(response => {
        if (response) {
          this.updateConflits(response);
          this.showToast('Conflit résolu avec succès', 'success');
          this.closeResolverModal();
        }
      });
  }
}
```

---

## Maintenance et évolution

### Améliorations futures possibles

1. **Historique de résolution** - Conserver un log de toutes les tentatives
2. **Notifications en temps réel** - WebSocket pour les nouveaux conflits
3. **Graphiques avancés** - Charts.js pour visualisations plus riches
4. **Filtres sauvegardés** - Mémoriser les préférences de filtrage
5. **Résolution par IA** - Suggestions automatiques basées sur l'historique
6. **Export avancé** - PDF, Excel avec formatage

### Tests à implémenter

- Tests unitaires pour chaque composant
- Tests d'intégration pour les interactions
- Tests E2E pour les workflows complets
- Tests d'accessibilité avec axe-core

---

## Support

Pour toute question ou suggestion d'amélioration, contactez l'équipe de développement Timely.
