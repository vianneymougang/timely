# Structure visuelle de l'UI de gestion des conflits

## Arborescence des fichiers

```
timely-frontend/src/app/features/admin/schedule/
│
├── components/                          [NOUVEAU DOSSIER]
│   ├── conflict-stats/                  [NOUVEAU]
│   │   ├── conflict-stats.component.ts       ← Widget de statistiques
│   │   ├── conflict-stats.component.html     ← Template avec barres de progression
│   │   └── conflict-stats.component.scss     ← Styles et animations
│   │
│   ├── conflict-detail/                 [NOUVEAU]
│   │   ├── conflict-detail.component.ts      ← Modal de détails
│   │   ├── conflict-detail.component.html    ← Template avec timeline
│   │   └── conflict-detail.component.scss    ← Styles de la modal
│   │
│   ├── conflict-resolver/               [NOUVEAU]
│   │   ├── conflict-resolver.component.ts    ← Modal de résolution
│   │   ├── conflict-resolver.component.html  ← Formulaire réactif
│   │   └── conflict-resolver.component.scss  ← Styles et validations
│   │
│   ├── index.ts                         [NOUVEAU] ← Exports des composants
│   └── README.md                        [NOUVEAU] ← Documentation technique
│
└── viewer/                              [MODIFIÉ]
    ├── schedule-viewer.component.ts     ← Intégration des composants
    ├── schedule-viewer.component.html   ← UI de gestion des conflits
    └── schedule-viewer.component.scss   ← Animations et responsive

Documentation/
├── IMPLEMENTATION-CONFLICT-UI.md        [NOUVEAU] ← Doc d'implémentation
├── SYNTHESE-UI-CONFLITS.md              [NOUVEAU] ← Synthèse du projet
└── VISUAL-STRUCTURE-CONFLICT-UI.md      [NOUVEAU] ← Ce fichier
```

## Architecture des composants

```
┌─────────────────────────────────────────────────────────────┐
│                  ScheduleViewerComponent                     │
│  (Composant parent - Gestion de l'état global)              │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ConflictStats   │  │ConflictDetail  │  │ConflictResolver│
│Component       │  │Component       │  │Component       │
│                │  │                │  │                │
│ Widget de      │  │ Modal de       │  │ Modal de       │
│ statistiques   │  │ visualisation  │  │ résolution     │
│                │  │ détaillée      │  │ avec formulaire│
└────────────────┘  └────────────────┘  └────────────────┘
```

## Flux de données (Data Flow)

```
                    ┌─────────────────┐
                    │ PlanningService │
                    │   (Backend)     │
                    └────────┬────────┘
                             │
                             │ HTTP Requests
                             │
                             ▼
        ┌────────────────────────────────────────┐
        │    ScheduleViewerComponent (Parent)    │
        │                                        │
        │  ┌──────────────────────────────────┐ │
        │  │ Signals (État réactif)           │ │
        │  │                                  │ │
        │  │ • conflits: ConflitResponse[]    │ │
        │  │ • filterSeverite: string | null  │ │
        │  │ • filterType: string | null      │ │
        │  │ • sortBy: 'date' | 'severite'... │ │
        │  │ • selectedConflits: Set<string>  │ │
        │  │ • toastMessage: string | null    │ │
        │  └──────────────────────────────────┘ │
        │                                        │
        │  ┌──────────────────────────────────┐ │
        │  │ Computed Signals                 │ │
        │  │                                  │ │
        │  │ • filteredConflits() ←─────────┐ │ │
        │  │ • allSelected() ←──────────────┤ │ │
        │  └──────────────────────────────────┘ │
        └───────┬────────────┬─────────────┬────┘
                │            │             │
      ┌─────────┘            │             └─────────┐
      │                      │                       │
      │ [conflicts]          │ [conflict]            │ [conflict]
      │                      │ [isOpen]              │ [isOpen]
      ▼                      ▼                       ▼
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│ConflictStats│      │ConflictDetail│      │ConflictResolver│
│             │      │              │      │              │
│ Input:      │      │ Input:       │      │ Input:       │
│ • conflicts │      │ • conflict   │      │ • conflict   │
│             │      │ • isOpen     │      │ • isOpen     │
│             │      │              │      │              │
│             │      │ Output:      │      │ Output:      │
│             │      │ • close()    │      │ • close()    │
│             │      │ • resolve()  │      │ • resolve()  │
└─────────────┘      └──────────────┘      └──────────────┘
```

## Wireframes / Maquettes ASCII

### Vue principale (Liste des conflits)

```
┌────────────────────────────────────────────────────────────────┐
│ Emploi du temps - Conflits                                     │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ 📊 Statistiques des conflits                               │ │
│ │                                                            │ │
│ │ Conflits détectés: 12         Taux de résolution: 25%     │ │
│ │                                                            │ │
│ │ ████████████ 75% Critiques (9)                            │ │
│ │ ███ 20% Moyens (2)                                        │ │
│ │ █ 5% Mineurs (1)                                          │ │
│ │                                                            │ │
│ │ ⚠️  Attention: 9 conflits critiques non résolus           │ │
│ └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ Filtres: [Sévérité ▼] [Type ▼] [Statut ▼] [Réinitialiser] │ │
│ │ Tri: [Plus critiques ▼]                              🔍   │ │
│ └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ ☑ [Critique] [Salle] [Non résolu]                         │ │
│ │                                                            │ │
│ │   La salle A101 est réservée pour 2 cours en même temps   │ │
│ │   💡 Suggestion: Déplacer vers salle A102                 │ │
│ │   📅 Détecté le: 14/02/2026 à 10:30                       │ │
│ │                                                            │ │
│ │                                      [Détails] [Résoudre] │ │
│ └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ ☐ [Moyen] [Enseignant] [En cours]                         │ │
│ │                                                            │ │
│ │   Prof. Dupont assigné à 2 cours simultanément            │ │
│ │   💡 Suggestion: Réassigner le cours MATH101              │ │
│ │   📅 Détecté le: 14/02/2026 à 09:15                       │ │
│ │                                                            │ │
│ │                                      [Détails] [Résoudre] │ │
│ └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ☑ Tout sélectionner     [Exporter CSV] [Archiver résolus]     │
└────────────────────────────────────────────────────────────────┘
```

### Modal de résolution

```
┌──────────────────────────────────────────────────────────┐
│ ⚠️  Résoudre le conflit                              ✕  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ [Critique] [Salle]                                       │
│                                                          │
│ La salle A101 est réservée pour 2 cours en même temps   │
│ 💡 Suggestion: Déplacer le cours MATH101 à la salle     │
│    A102 disponible au même horaire.                     │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Choisissez une solution                              │ │
│ │                                                      │ │
│ │ ┌────────────────────┐  ┌────────────────────────┐  │ │
│ │ │ ☑ 🏢 Déplacer salle │  │ ○ 🕐 Changer horaire  │  │ │
│ │ │ Vers salle dispo   │  │ Modifier le créneau   │  │ │
│ │ └────────────────────┘  └────────────────────────┘  │ │
│ │                                                      │ │
│ │ ┌────────────────────┐  ┌────────────────────────┐  │ │
│ │ │ ○ 👨‍🏫 Réassigner    │  │ ○ ✕ Annuler cours     │  │ │
│ │ │ Autre enseignant   │  │ Supprimer créneau     │  │ │
│ │ └────────────────────┘  └────────────────────────┘  │ │
│ │                                                      │ │
│ │ ┌────────────────────────────────────────────────┐  │ │
│ │ │ ○ ✏️  Résolution manuelle                       │  │ │
│ │ │ Commentaire personnalisé                       │  │ │
│ │ └────────────────────────────────────────────────┘  │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ Nouvelle salle: [A102________________]                   │
│                                                          │
│ Commentaire de résolution: *                             │
│ ┌────────────────────────────────────────────────────┐   │
│ │ Cours déplacé en A102 car A101 occupée            │   │
│ │                                                    │   │
│ │                                                    │   │
│ └────────────────────────────────────────────────────┘   │
│ 42 caractères                                            │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ 💡 Impact de la résolution                           │ │
│ │                                                      │ │
│ │ • Le cours sera déplacé dans une nouvelle salle     │ │
│ │ • Les étudiants et enseignants seront notifiés      │ │
│ │ • L'ancienne réservation sera annulée               │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│                        [Annuler]  [Appliquer résolution]│
└──────────────────────────────────────────────────────────┘
```

### Modal de détails

```
┌──────────────────────────────────────────────────────────┐
│ ℹ️  Détails du conflit                                ✕ │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ [⚠️  Critique] [Salle] [Non résolu]                      │
│                                                          │
│ 📄 Description                                           │
│ ┌────────────────────────────────────────────────────┐   │
│ │ La salle A101 est réservée pour 2 cours en même   │   │
│ │ temps le lundi à 08h00.                           │   │
│ └────────────────────────────────────────────────────┘   │
│                                                          │
│ 💡 Suggestion de résolution                              │
│ ┌────────────────────────────────────────────────────┐   │
│ │ Déplacer le cours MATH101 à la salle A102         │   │
│ │ disponible au même horaire.                       │   │
│ └────────────────────────────────────────────────────┘   │
│                                                          │
│ 🕐 Timeline                                              │
│                                                          │
│  ●━━━ ⚠️  Conflit détecté                               │
│  │    14/02/2026 à 10:30                               │
│  │                                                      │
│  ●    (Non résolu)                                      │
│                                                          │
│ ℹ️  Informations complémentaires                         │
│ ┌────────────────────────────────────────────────────┐   │
│ │ ID du conflit: conf-12345678-abcd-...             │   │
│ │ ID emploi du temps: edt-87654321-dcba-...         │   │
│ └────────────────────────────────────────────────────┘   │
│                                                          │
│                               [Fermer]  [Résoudre →]    │
└──────────────────────────────────────────────────────────┘
```

### Toast de notification

```
                                    ┌─────────────────────────┐
                                    │ ✅ Conflit résolu avec  │
                                    │    succès            ✕ │
                                    └─────────────────────────┘
```

## Légende des symboles

| Symbole | Signification |
|---------|---------------|
| ⚠️ | Alerte / Conflit critique |
| 💡 | Suggestion / Idée |
| 📊 | Statistiques |
| 📄 | Description |
| 🕐 | Timeline / Horaire |
| ℹ️ | Information |
| ✅ | Succès |
| ❌ | Erreur |
| 🏢 | Salle |
| 👨‍🏫 | Enseignant |
| ✏️ | Édition / Manuel |
| ☑ | Sélectionné |
| ☐ | Non sélectionné |
| ○ | Option radio |
| ● | Point de timeline |

## Palette de couleurs

### Sévérité

```
Critique:  ███████████ #DC2626 (Rouge)
Moyenne:   ███████████ #EAB308 (Jaune)
Mineure:   ███████████ #2563EB (Bleu)
```

### Statut

```
Résolu:     ███████████ #16A34A (Vert)
En cours:   ███████████ #F59E0B (Orange)
Non résolu: ███████████ #DC2626 (Rouge)
```

### Interface

```
Primaire:   ███████████ #2563EB (Bleu)
Succès:     ███████████ #16A34A (Vert)
Erreur:     ███████████ #DC2626 (Rouge)
Info:       ███████████ #3B82F6 (Bleu clair)
Neutre:     ███████████ #6B7280 (Gris)
```

## Responsive Design

### Desktop (> 768px)

```
┌────────────────────────────────────────────────────────┐
│ Header                                                  │
├───────────┬────────────────────────────────────────────┤
│           │ ┌────────────────────────────────────────┐ │
│ Sidebar   │ │ Statistiques                           │ │
│           │ └────────────────────────────────────────┘ │
│           │                                            │
│           │ ┌────────────────────────────────────────┐ │
│           │ │ Filtres et actions                     │ │
│           │ └────────────────────────────────────────┘ │
│           │                                            │
│           │ ┌────────────────────────────────────────┐ │
│           │ │ Liste des conflits                     │ │
│           │ │                                        │ │
│           │ │ Conflit 1  [Détails] [Résoudre]       │ │
│           │ │ Conflit 2  [Détails] [Résoudre]       │ │
│           │ │ Conflit 3  [Détails] [Résoudre]       │ │
│           │ └────────────────────────────────────────┘ │
└───────────┴────────────────────────────────────────────┘
```

### Mobile (< 768px)

```
┌──────────────────────┐
│ ☰  Header            │
├──────────────────────┤
│ ┌──────────────────┐ │
│ │ Stats compactes  │ │
│ └──────────────────┘ │
│                      │
│ [Filtres ▼]          │
│                      │
│ ┌──────────────────┐ │
│ │ Conflit 1        │ │
│ │ [Critique]       │ │
│ │ Description...   │ │
│ │ [Détails →]      │ │
│ │ [Résoudre]       │ │
│ └──────────────────┘ │
│                      │
│ ┌──────────────────┐ │
│ │ Conflit 2        │ │
│ │ [Moyen]          │ │
│ │ Description...   │ │
│ │ [Détails →]      │ │
│ │ [Résoudre]       │ │
│ └──────────────────┘ │
└──────────────────────┘
```

## États de l'interface

### Chargement

```
┌────────────────────────────────────┐
│                                    │
│         ⟳  Chargement...           │
│                                    │
└────────────────────────────────────┘
```

### Aucun conflit

```
┌────────────────────────────────────┐
│                                    │
│          ✅                         │
│     Aucun conflit détecté          │
│                                    │
└────────────────────────────────────┘
```

### Erreur

```
┌────────────────────────────────────┐
│                                    │
│          ❌                         │
│  Erreur lors du chargement         │
│    [Réessayer]                     │
│                                    │
└────────────────────────────────────┘
```

## Interactions utilisateur

### Workflow de résolution

```
1. Utilisateur clique "Détecter les conflits"
   ↓
2. Affichage de la liste des conflits + statistiques
   ↓
3. Utilisateur applique des filtres (optionnel)
   ↓
4. Utilisateur clique "Détails" sur un conflit
   ↓
5. Modal de détails s'ouvre
   ↓
6. Utilisateur clique "Résoudre"
   ↓
7. Modal de résolution s'ouvre
   ↓
8. Utilisateur choisit un type de résolution
   ↓
9. Utilisateur remplit le formulaire
   ↓
10. Utilisateur clique "Appliquer résolution"
    ↓
11. Validation du formulaire
    ↓
12. Appel API au backend
    ↓
13. Mise à jour de la liste
    ↓
14. Toast de succès
```

### Navigation au clavier

```
Tab       → Passer à l'élément suivant
Shift+Tab → Revenir à l'élément précédent
Enter     → Activer le bouton/lien
Escape    → Fermer la modal active
Space     → Toggle checkbox
Arrows    → Navigation dans les select
```

## Conclusion

Cette structure visuelle montre l'organisation claire et modulaire de l'UI de gestion des conflits. L'architecture est:

✅ **Modulaire** - Composants réutilisables et autonomes
✅ **Responsive** - Adapté desktop et mobile
✅ **Accessible** - Navigation clavier et screen readers
✅ **Intuitive** - Workflow clair et guidé
✅ **Performante** - Signals réactifs et optimisations
✅ **Évolutive** - Facile à étendre et maintenir

---

**Version**: 1.0.0
**Date**: 14 février 2026
**Auteur**: Équipe Timely
