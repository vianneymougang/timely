# Guide de démarrage rapide - Planning Service Frontend

## Démarrage rapide

### 1. Accéder à l'interface de génération

```
URL: http://localhost:4200/admin/schedule
```

L'interface s'ouvre sur l'onglet "Générer".

### 2. Générer un emploi du temps

#### Formulaire de base:

1. **ID de l'école** (obligatoire)
   - Exemple: `550e8400-e29b-41d4-a716-446655440000`
   - Récupérer depuis l'API User Service

2. **Période** (obligatoire)
   - Options: Semestre 1, Semestre 2, Annuel
   - Défaut: Semestre 1

3. **Date de début** (obligatoire)
   - Format: YYYY-MM-DD
   - Exemple: `2024-09-01`

4. **Date de fin** (obligatoire)
   - Format: YYYY-MM-DD
   - Exemple: `2024-12-31`

#### Configuration avancée (optionnelle):

5. **Créneaux par jour**
   - Défaut: 6
   - Min: 1, Max: 12

6. **Durée du créneau**
   - Défaut: 90 minutes
   - Min: 30, Max: 240 minutes

7. **Heure de début**
   - Défaut: 08:00

8. **Heure de fin**
   - Défaut: 18:00

9. **Pause entre créneaux**
   - Défaut: 15 minutes
   - Min: 0, Max: 60 minutes

#### Cliquer sur "Générer l'emploi du temps"

### 3. Résultat de la génération

Après génération, vous verrez:

- **Taux de réussite** (couleur selon performance)
  - Vert: ≥90%
  - Jaune: ≥70%
  - Rouge: <70%

- **Cours planifiés** / Total

- **Conflits détectés**

- **Durée de génération** (en secondes)

- **Liste des cours non planifiés** (si applicable)
  - Chaque cours avec raison de non-planification

#### Actions après génération:

- **Visualiser l'emploi du temps** - Ouvre la vue détaillée
- **Générer un nouveau** - Réinitialise le formulaire

### 4. Visualiser l'emploi du temps

La vue détaillée contient:

#### Header avec informations:
- Statut (DRAFT, VALIDATED, PUBLISHED, ARCHIVED)
- Période, dates, nombre de créneaux

#### Actions disponibles:
- **Détecter les conflits** - Lance une analyse des conflits
- **Export PDF** - Télécharge le planning en PDF
- **Export iCal** - Télécharge au format calendrier
- **Valider** - Change le statut à VALIDATED (si DRAFT)
- **Publier** - Change le statut à PUBLISHED (si VALIDATED)

#### Onglets:

**1. Grille horaire**
- Tableau hebdomadaire Lundi-Vendredi
- Heures en lignes
- Créneaux colorés avec détails:
  - Horaires
  - ID Cours
  - ID Salle
  - ID Enseignant (si assigné)

**2. Conflits**
- Liste des conflits détectés
- Pour chaque conflit:
  - Type (ENSEIGNANT, SALLE, GROUPE, HORAIRE)
  - Sévérité (MINEURE, MOYENNE, CRITIQUE)
  - Description
  - Suggestion de résolution
  - Statut
  - Date de détection
  - Bouton "Résoudre"

### 5. Liste des emplois du temps

Onglet "Liste" dans `/admin/schedule`:

#### Filtres:
- Date début/fin
- Statut (tous, DRAFT, VALIDATED, PUBLISHED, ARCHIVED)

#### Liste:
- Cards cliquables
- Badge statut coloré
- Période, dates, créneaux, conflits
- Actions:
  - **Voir** - Ouvre la vue détaillée
  - **Supprimer** - Supprime (uniquement DRAFT)

#### Pagination:
- Navigation Précédent/Suivant
- Affichage page courante / total

## Exemples de cas d'usage

### Cas 1: Génération simple pour un semestre

```json
{
  "ecoleId": "550e8400-e29b-41d4-a716-446655440000",
  "dateDebut": "2024-09-01",
  "dateFin": "2024-12-31",
  "periode": "SEMESTRE_1"
}
```

Utilise les valeurs par défaut pour la configuration avancée.

### Cas 2: Génération avec créneaux courts

```json
{
  "ecoleId": "550e8400-e29b-41d4-a716-446655440000",
  "dateDebut": "2024-09-01",
  "dateFin": "2024-12-31",
  "periode": "SEMESTRE_1",
  "creneauxParJour": 8,
  "dureeCreneauMinutes": 60,
  "pauseEntreCreneauxMinutes": 10
}
```

Génère des créneaux de 60 minutes avec 10 minutes de pause.

### Cas 3: Génération avec horaires spécifiques

```json
{
  "ecoleId": "550e8400-e29b-41d4-a716-446655440000",
  "dateDebut": "2024-09-01",
  "dateFin": "2024-12-31",
  "periode": "SEMESTRE_1",
  "heureDebutJournee": "07:30",
  "heureFinJournee": "19:00"
}
```

Génère avec horaires étendus 7h30-19h00.

## Workflow typique

### Workflow administrateur complet:

1. **Génération**
   - Admin génère emploi du temps
   - Résultat: statut DRAFT

2. **Révision**
   - Admin visualise grille horaire
   - Détecte conflits éventuels
   - Résout conflits si nécessaire

3. **Validation**
   - Admin clique "Valider"
   - Résultat: statut VALIDATED

4. **Publication**
   - Admin clique "Publier"
   - Résultat: statut PUBLISHED
   - Visible par enseignants et étudiants

5. **Export**
   - Admin exporte PDF pour impression
   - Admin exporte iCal pour distribution

## Codes couleur

### Statuts emploi du temps:
- **Vert** - PUBLISHED (publié)
- **Bleu** - VALIDATED (validé)
- **Jaune** - DRAFT (brouillon)
- **Gris** - ARCHIVED (archivé)

### Sévérité conflits:
- **Rouge** - CRITIQUE (doit être résolu immédiatement)
- **Jaune** - MOYENNE (à résoudre)
- **Bleu** - MINEURE (peut être ignoré)

### Taux de réussite génération:
- **Vert** - ≥90% (excellent)
- **Jaune** - 70-89% (acceptable)
- **Rouge** - <70% (problématique)

## Dépannage

### Erreur: "L'ID de l'école est obligatoire"
- Assurez-vous de saisir un UUID valide pour l'école

### Erreur: "Impossible de charger l'emploi du temps"
- Vérifiez que le Planning Service est démarré (port 8093)
- Vérifiez que l'API Gateway est accessible (port 8090)
- Vérifiez votre authentification JWT

### Erreur: "Erreur lors de la génération"
- Vérifiez que les dates sont valides et cohérentes
- Vérifiez que l'école existe dans la base de données
- Consultez les logs du Planning Service backend

### Aucun créneau visible après génération
- Vérifiez le taux de réussite
- Consultez la liste des cours non planifiés
- Vérifiez que des cours existent pour l'école

### Export PDF ne fonctionne pas
- Vérifiez que le backend Planning Service a iText configuré
- Vérifiez les logs serveur pour erreurs PDF

## Raccourcis clavier (à venir)

Fonctionnalités futures:
- `Ctrl+G` - Générer emploi du temps
- `Ctrl+E` - Export PDF
- `Ctrl+D` - Détecter conflits

## Support

Pour problèmes techniques:
1. Consulter les logs browser (F12 Console)
2. Consulter les logs Planning Service
3. Vérifier la connexion API Gateway
4. Contacter l'équipe de développement

## Configuration requise

- **Navigateur**: Chrome/Firefox/Edge (dernières versions)
- **Résolution**: Min 1024x768 (recommandé 1920x1080)
- **Backend**: Planning Service démarré
- **Auth**: Token JWT valide avec rôle ADMIN
