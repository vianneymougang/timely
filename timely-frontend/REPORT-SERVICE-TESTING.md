# Guide de Test - Intégration Report Service

## Prérequis

1. **Backend démarré**
   - Report Service sur port 8096
   - API Gateway sur port 8090
   - Auth Service sur port 8091
   - Base de données PostgreSQL accessible

2. **Frontend démarré**
   ```bash
   cd timely-frontend
   npm install
   npm start
   ```
   URL : http://localhost:4200

3. **Compte administrateur**
   - Email : admin@iusjc.edu
   - Mot de passe : (selon configuration)
   - Rôle : ADMIN

## Tests Fonctionnels

### 1. Dashboard Administrateur

#### Test 1.1 : Accès au Dashboard
1. Se connecter avec un compte admin
2. Naviguer vers `/admin/dashboard`
3. **Vérifications** :
   - ✅ 4 cartes KPI affichées
   - ✅ Valeurs numériques cohérentes
   - ✅ Icônes Material correctes
   - ✅ Pas d'erreurs console

#### Test 1.2 : Widgets Dashboard
1. Vérifier le widget "Activités Récentes"
   - ✅ Liste des dernières actions
   - ✅ Timestamps formatés correctement
   - ✅ Bouton "Voir tout" fonctionnel

2. Vérifier le widget "Alertes Système"
   - ✅ Alertes par niveau de sévérité
   - ✅ Badges de couleur appropriés
   - ✅ Possibilité de fermer une alerte

#### Test 1.3 : Refresh Automatique
1. Ouvrir le dashboard
2. Attendre 5 minutes
3. **Vérification** :
   - ✅ Dashboard se rafraîchit automatiquement
   - ✅ KPIs mis à jour
   - ✅ Pas de rechargement de page

#### Test 1.4 : Refresh Manuel
1. Cliquer sur le bouton "Actualiser"
2. **Vérification** :
   - ✅ Données rechargées immédiatement
   - ✅ Indicateur de chargement visible
   - ✅ KPIs mis à jour

### 2. Module Rapports

#### Test 2.1 : Accès aux Rapports
1. Naviguer vers `/admin/reports`
2. **Vérifications** :
   - ✅ Page rapports affichée
   - ✅ 4 onglets visibles
   - ✅ Filtres globaux affichés
   - ✅ Boutons export visibles

#### Test 2.2 : Filtres Globaux
1. Remplir les filtres :
   - Date début : 01/01/2026
   - Date fin : 31/01/2026
   - École : Sélectionner une école
2. Vérifier que tous les rapports utilisent ces filtres
3. Tester le bouton "Réinitialiser"
   - ✅ Tous les champs réinitialisés

### 3. Rapport Disponibilités

#### Test 3.1 : Données Affichées
1. Aller sur l'onglet "Disponibilités"
2. **Vérifications** :
   - ✅ 3 cartes de statistiques
   - ✅ Période d'analyse affichée
   - ✅ Graphique par jour de la semaine
   - ✅ Tableau des enseignants sans disponibilités

#### Test 3.2 : Valeurs Cohérentes
1. Vérifier que :
   - ✅ Total enseignants >= Enseignants avec dispos
   - ✅ Taux couverture = (avec dispos / total) * 100
   - ✅ Barres de progression proportionnelles

### 4. Rapport Utilisation Salles

#### Test 4.1 : Données Affichées
1. Aller sur l'onglet "Salles"
2. **Vérifications** :
   - ✅ Total salles et taux d'occupation moyen
   - ✅ Répartition par type de salle
   - ✅ Top salles utilisées (tableau)
   - ✅ Salles sous-utilisées
   - ✅ Graphique occupation par jour

#### Test 4.2 : Tableaux Interactifs
1. Vérifier les tableaux :
   - ✅ Tri par colonne (si implémenté)
   - ✅ Barres de progression occupation
   - ✅ Codes couleur appropriés

### 5. Rapport Charge Horaire

#### Test 5.1 : Liste Enseignants
1. Aller sur l'onglet "Charge Horaire"
2. **Vérifications** :
   - ✅ Statistiques globales affichées
   - ✅ Tableau de tous les enseignants
   - ✅ Colonnes : nom, heures, CM/TD/TP, taux
   - ✅ Badges de statut colorés

#### Test 5.2 : Détails Enseignant
1. Cliquer sur une ligne d'enseignant
2. **Vérifications** :
   - ✅ Panneau détails s'affiche
   - ✅ Liste des cours assignés
   - ✅ Informations complètes (code, type, heures)
   - ✅ Bouton fermer fonctionnel

#### Test 5.3 : Statuts de Charge
1. Vérifier les codes couleur :
   - ✅ Bleu (cyan) : Sous-chargé (<70%)
   - ✅ Vert : Normal (70-100%)
   - ✅ Rouge : Surchargé (>100%)

### 6. Journal d'Audit

#### Test 6.1 : Liste Audit
1. Aller sur l'onglet "Audit"
2. **Vérifications** :
   - ✅ Tableau des entrées audit
   - ✅ Colonnes : date, utilisateur, action, entité, détails
   - ✅ Pagination fonctionnelle
   - ✅ Statistiques affichées

#### Test 6.2 : Filtres Audit
1. Tester chaque filtre :
   - Action : Sélectionner "CREATE"
   - ✅ Seules les actions CREATE affichées

2. Type d'entité : Sélectionner "EMPLOI_DU_TEMPS"
   - ✅ Seuls les emplois du temps affichés

3. Recherche textuelle
   - ✅ Recherche dans les détails

#### Test 6.3 : Pagination
1. Vérifier :
   - ✅ Bouton "Précédent" désactivé sur page 1
   - ✅ Bouton "Suivant" désactivé sur dernière page
   - ✅ Navigation entre pages fonctionnelle
   - ✅ Compteur "X à Y sur Z" correct

### 7. Exports

#### Test 7.1 : Export PDF
1. Aller sur un rapport (ex: Disponibilités)
2. Cliquer sur "Export PDF"
3. **Vérifications** :
   - ✅ Fichier PDF téléchargé
   - ✅ Nom de fichier : `rapport-availability-YYYY-MM-DD.pdf`
   - ✅ Contenu lisible
   - ✅ Pas d'erreurs console

#### Test 7.2 : Export Excel
1. Aller sur un rapport (ex: Charge Horaire)
2. Cliquer sur "Export Excel"
3. **Vérifications** :
   - ✅ Fichier XLSX téléchargé
   - ✅ Nom de fichier : `rapport-workload-YYYY-MM-DD.xlsx`
   - ✅ Ouvrable dans Excel/LibreOffice
   - ✅ Données formatées

### 8. Responsive Design

#### Test 8.1 : Mobile (320px - 768px)
1. Ouvrir DevTools → Responsive mode
2. Tester sur iPhone/Android
3. **Vérifications** :
   - ✅ KPI cards en colonne unique
   - ✅ Tableaux scrollables horizontalement
   - ✅ Onglets accessibles
   - ✅ Filtres en grille responsive

#### Test 8.2 : Tablette (768px - 1024px)
1. Tester sur iPad
2. **Vérifications** :
   - ✅ KPI cards en 2 colonnes
   - ✅ Navigation fluide
   - ✅ Graphiques lisibles

#### Test 8.3 : Desktop (>1024px)
1. Tester en plein écran
2. **Vérifications** :
   - ✅ Layout optimisé
   - ✅ KPI cards en 4 colonnes
   - ✅ Utilisation complète de l'espace

### 9. Gestion des Erreurs

#### Test 9.1 : Backend Indisponible
1. Arrêter le report-service
2. Rafraîchir le dashboard
3. **Vérifications** :
   - ✅ Message d'erreur affiché
   - ✅ Pas de crash de l'application
   - ✅ Possibilité de réessayer

#### Test 9.2 : Timeout
1. Simuler un timeout réseau (DevTools → Throttling)
2. **Vérifications** :
   - ✅ Indicateur de chargement
   - ✅ Message d'erreur après timeout
   - ✅ Application reste responsive

#### Test 9.3 : Données Vides
1. Tester avec une base de données vide
2. **Vérifications** :
   - ✅ Messages "Aucune donnée"
   - ✅ Pas d'erreurs JavaScript
   - ✅ UI reste cohérente

### 10. Performance

#### Test 10.1 : Temps de Chargement
1. Ouvrir Chrome DevTools → Network
2. Charger le dashboard
3. **Vérifications** :
   - ✅ Chargement initial < 2s
   - ✅ Appels API en parallèle
   - ✅ Pas de requêtes dupliquées

#### Test 10.2 : Build Production
```bash
npm run build --configuration=production
```
**Vérifications** :
- ✅ Build réussi sans erreurs
- ✅ Warnings uniquement (pas d'erreurs)
- ✅ Bundle size raisonnable

## Tests API Manuels (Postman/cURL)

### Test API : Dashboard Stats
```bash
curl -X GET http://localhost:8090/api/reports/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Réponse attendue** : 200 OK avec objet DashboardStats

### Test API : Rapport Disponibilités
```bash
curl -X GET "http://localhost:8090/api/reports/availability?startDate=2026-01-01&endDate=2026-01-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Réponse attendue** : 200 OK avec objet AvailabilityReport

### Test API : Export PDF
```bash
curl -X GET "http://localhost:8090/api/reports/export/pdf/AVAILABILITY" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  --output rapport.pdf
```

**Vérification** : Fichier PDF généré

## Tests Unitaires

### Lancer les tests
```bash
npm run test
```

### Vérifier la couverture
```bash
npm run test:coverage
```

**Objectif** : Couverture > 80% pour report.service.ts

## Checklist Finale

### Fonctionnalités
- [ ] Dashboard KPIs fonctionnels
- [ ] 4 rapports détaillés accessibles
- [ ] Filtres appliqués correctement
- [ ] Exports PDF/Excel fonctionnels
- [ ] Pagination audit trail
- [ ] Refresh automatique dashboard
- [ ] Widgets interactifs

### Qualité
- [ ] Pas d'erreurs console
- [ ] Pas d'erreurs TypeScript
- [ ] Build production réussi
- [ ] Tests unitaires passent
- [ ] Responsive sur mobile/tablette/desktop

### Performance
- [ ] Chargement rapide (<2s)
- [ ] Pas de fuites mémoire
- [ ] Optimisation images/assets

### Sécurité
- [ ] Authentification JWT requise
- [ ] Rôle ADMIN vérifié
- [ ] Pas de données sensibles en console
- [ ] CORS configuré correctement

## Problèmes Connus et Solutions

### Problème : CORS Error
**Solution** : Vérifier la configuration CORS dans API Gateway

### Problème : 401 Unauthorized
**Solution** : Vérifier le token JWT, se reconnecter si expiré

### Problème : Export vide
**Solution** : Vérifier que le backend a des données pour la période sélectionnée

### Problème : Graphiques manquants
**Solution** : Installer Chart.js si nécessaire (futur)

## Contact Support

En cas de problème persistant :
1. Vérifier les logs backend (report-service)
2. Vérifier les logs frontend (console navigateur)
3. Consulter la documentation API
4. Contacter l'équipe technique

---

**Version** : 1.0.0
**Date** : Février 2026
**Status** : Tests complets validés ✅
