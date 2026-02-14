# Checklist de vérification - Intégration Planning Service

## Préalables

- [ ] Planning Service backend démarré sur port 8093
- [ ] API Gateway démarré sur port 8090
- [ ] Auth Service démarré sur port 8091
- [ ] User Service démarré sur port 8092
- [ ] Base de données PostgreSQL planning_db accessible
- [ ] Frontend Angular démarré sur port 4200
- [ ] Utilisateur avec rôle ADMIN créé et authentifié

## Tests fonctionnels

### 1. Service Angular (planning.service.ts)

- [ ] Service injecté correctement dans les composants
- [ ] Méthode `generateSchedule()` retourne Observable
- [ ] Méthode `getEmploiDuTempsById()` retourne Observable
- [ ] Méthode `getAllEmploisDuTemps()` gère la pagination
- [ ] Méthode `exportToPDF()` retourne Blob
- [ ] Méthode `exportToICal()` retourne Blob
- [ ] Méthode `getConflitsByEmploi()` retourne liste conflits
- [ ] Headers Authorization JWT présents dans requêtes

### 2. Modèles TypeScript (planning.model.ts)

- [ ] Interface `GeneratePlanningRequest` complète
- [ ] Interface `EmploiDuTempsResponse` complète
- [ ] Interface `CreneauResponse` complète
- [ ] Interface `ConflitResponse` complète
- [ ] Enums `PeriodeEmploi`, `StatutEmploi`, etc. correctes
- [ ] Type `Page<T>` générique fonctionnel
- [ ] Labels français (DayOfWeekLabels, etc.) corrects

### 3. Composant Génération (schedule-generator.component)

- [ ] Formulaire s'affiche correctement
- [ ] Tous les champs requis marqués (*)
- [ ] Validation formulaire fonctionne
- [ ] Valeurs par défaut correctes (6 créneaux, 90 min, etc.)
- [ ] Bouton "Générer" désactivé si formulaire invalide
- [ ] Loading spinner s'affiche pendant génération
- [ ] Résultat de génération s'affiche après succès
- [ ] Taux de réussite coloré selon performance
- [ ] Liste des cours non planifiés affichée si applicable
- [ ] Bouton "Visualiser l'emploi du temps" redirige correctement
- [ ] Bouton "Générer un nouveau" réinitialise le formulaire
- [ ] Messages d'erreur clairs en cas d'échec

### 4. Composant Visualisation (schedule-viewer.component)

- [ ] Emploi du temps se charge avec ID depuis URL
- [ ] Header affiche statut coloré correct
- [ ] Informations (période, dates, créneaux) affichées
- [ ] Grille horaire s'affiche avec jours et heures
- [ ] Créneaux apparaissent dans bonnes cases
- [ ] Détails créneaux visibles (cours, salle, enseignant)
- [ ] Bouton "Détecter les conflits" fonctionne
- [ ] Onglet "Conflits" affiche nombre correct
- [ ] Liste des conflits affichée avec sévérités
- [ ] Bouton "Résoudre" sur conflits non résolus
- [ ] Bouton "Export PDF" télécharge fichier PDF
- [ ] Bouton "Export iCal" télécharge fichier .ics
- [ ] Bouton "Valider" change statut (si DRAFT)
- [ ] Bouton "Publier" change statut (si VALIDATED)
- [ ] Bouton "Retour" revient à la liste
- [ ] Responsive sur mobile (grille scrollable)

### 5. Composant Liste (schedule-list.component)

- [ ] Liste des emplois du temps s'affiche
- [ ] Filtres de recherche fonctionnent
- [ ] Filtre par date début/fin fonctionne
- [ ] Filtre par statut fonctionne
- [ ] Bouton "Rechercher" lance recherche
- [ ] Bouton "Réinitialiser" efface filtres
- [ ] Cards emplois du temps cliquables
- [ ] Badge statut coloré correct sur chaque card
- [ ] Informations (période, dates, créneaux, conflits) affichées
- [ ] Bouton "Voir" ouvre vue détaillée
- [ ] Bouton "Supprimer" supprime (uniquement DRAFT)
- [ ] Confirmation avant suppression
- [ ] Pagination fonctionne (Précédent/Suivant)
- [ ] Nombre total résultats affiché
- [ ] Page courante / total pages affiché
- [ ] Loading spinner pendant chargement

### 6. Composant Principal (schedule.component)

- [ ] Onglets "Générer" et "Liste" visibles
- [ ] Navigation entre onglets fonctionne
- [ ] Onglet actif visuellement distinct
- [ ] Sous-composants se chargent correctement

### 7. Composant Partagé (schedule-grid.component)

- [ ] Grille s'affiche avec créneaux fournis
- [ ] Jours de la semaine personnalisables
- [ ] Événement `creneauClicked` émis au clic
- [ ] Couleurs par statut créneau correctes
- [ ] Responsive sur mobile

### 8. Routes

- [ ] Route `/admin/schedule` accessible
- [ ] Route `/admin/schedule/viewer/:id` accessible
- [ ] Paramètre `id` récupéré correctement
- [ ] Navigation entre routes fonctionne
- [ ] Guards d'authentification appliqués (si configurés)

## Tests d'intégration

### Scénario 1: Génération complète

1. [ ] Naviguer vers `/admin/schedule`
2. [ ] Remplir formulaire génération
3. [ ] Cliquer "Générer l'emploi du temps"
4. [ ] Vérifier résultat génération
5. [ ] Cliquer "Visualiser l'emploi du temps"
6. [ ] Vérifier grille horaire affichée

### Scénario 2: Détection et résolution conflits

1. [ ] Ouvrir emploi du temps existant
2. [ ] Cliquer "Détecter les conflits"
3. [ ] Basculer vers onglet "Conflits"
4. [ ] Vérifier liste conflits
5. [ ] Cliquer "Résoudre" sur un conflit
6. [ ] Entrer résolution
7. [ ] Vérifier statut conflit mis à jour

### Scénario 3: Workflow validation/publication

1. [ ] Générer emploi du temps (statut: DRAFT)
2. [ ] Visualiser emploi du temps
3. [ ] Cliquer "Valider" (statut: VALIDATED)
4. [ ] Vérifier badge statut changé
5. [ ] Cliquer "Publier" (statut: PUBLISHED)
6. [ ] Vérifier badge statut final

### Scénario 4: Export

1. [ ] Ouvrir emploi du temps
2. [ ] Cliquer "Export PDF"
3. [ ] Vérifier téléchargement fichier PDF
4. [ ] Ouvrir PDF et vérifier contenu
5. [ ] Cliquer "Export iCal"
6. [ ] Vérifier téléchargement fichier .ics
7. [ ] Ouvrir .ics dans calendrier et vérifier

### Scénario 5: Liste et recherche

1. [ ] Naviguer vers onglet "Liste"
2. [ ] Vérifier liste emplois du temps
3. [ ] Appliquer filtre date début
4. [ ] Vérifier résultats filtrés
5. [ ] Appliquer filtre statut "PUBLISHED"
6. [ ] Vérifier résultats filtrés
7. [ ] Cliquer "Réinitialiser"
8. [ ] Vérifier liste complète réaffichée

## Tests de performance

- [ ] Temps génération emploi du temps < 5 secondes
- [ ] Temps chargement grille horaire < 2 secondes
- [ ] Temps export PDF < 3 secondes
- [ ] Liste paginée charge 20 éléments en < 1 seconde
- [ ] Pas de memory leaks (vérifier DevTools)
- [ ] Smooth scrolling sur grille horaire

## Tests de régression

- [ ] Autres fonctionnalités admin non affectées
- [ ] Navigation globale fonctionne toujours
- [ ] Authentification toujours fonctionnelle
- [ ] Autres services (User, Booking, etc.) non impactés

## Tests d'accessibilité

- [ ] Labels formulaires présents
- [ ] Navigation clavier possible
- [ ] Contraste couleurs suffisant
- [ ] Textes alternatifs sur images/icônes
- [ ] Tailles police lisibles
- [ ] Focus visible sur éléments interactifs

## Tests de sécurité

- [ ] Token JWT vérifié backend
- [ ] Roles ADMIN requis pour génération
- [ ] Roles ADMIN requis pour validation/publication
- [ ] Roles ADMIN ou TEACHER pour visualisation
- [ ] Pas d'exposition données sensibles dans console
- [ ] Pas d'injection XSS possible dans formulaires

## Tests de compatibilité navigateurs

- [ ] Chrome (dernière version)
- [ ] Firefox (dernière version)
- [ ] Safari (dernière version)
- [ ] Edge (dernière version)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

## Tests responsive

- [ ] Desktop 1920x1080
- [ ] Laptop 1366x768
- [ ] Tablet 768x1024
- [ ] Mobile 375x667
- [ ] Grille horaire scrollable horizontalement sur mobile
- [ ] Formulaires adaptés aux petits écrans
- [ ] Boutons accessibles au doigt sur mobile

## Documentation

- [ ] PLANNING-INTEGRATION.md complet
- [ ] PLANNING-QUICKSTART.md clair
- [ ] Commentaires code suffisants
- [ ] Interfaces TypeScript documentées
- [ ] Tests unitaires planning.service.spec.ts passent

## Déploiement

- [ ] Build production réussit sans erreurs
- [ ] Bundle size acceptable (< 500 KB lazy chunks)
- [ ] Pas de warnings TypeScript critiques
- [ ] Variables d'environnement correctes
- [ ] API URLs correctes (production vs dev)

## Notes

Date vérification: _________________

Testeur: _________________

Environnement:
- Frontend: Angular 19
- Backend: Spring Boot 3.5.x
- Base de données: PostgreSQL

Remarques:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
