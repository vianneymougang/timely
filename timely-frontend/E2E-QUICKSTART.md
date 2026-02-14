# Tests E2E Timely - Guide de Démarrage Rapide

## Setup Initial (5 minutes)

### 1. Installation

```bash
cd timely-frontend

# Installer les dépendances (inclut Playwright)
npm install

# Installer le navigateur Chromium
npx playwright install chromium
```

### 2. Démarrer les services

**Option A: Docker Compose (Recommandé)**
```bash
# Depuis la racine du projet
docker-compose up -d
```

**Option B: Manuel**
```bash
# Terminal 1: Frontend
cd timely-frontend
npm start

# Terminal 2: Gateway + Microservices
cd services
./start-all-services.sh
```

### 3. Vérifier que tout fonctionne

```bash
# Tester la connectivité
curl http://localhost:4200
curl http://localhost:8090/actuator/health
```

## Exécuter les tests

### Tests Smoke (< 1 minute)

Les tests smoke vérifient que l'application est fonctionnelle:

```bash
npm run e2e:smoke
```

Ces tests doivent **toujours passer** avant de travailler sur d'autres tests.

### Tests Complets (~ 15 minutes)

```bash
# Tous les tests E2E
npm run e2e

# Voir le rapport après exécution
npm run e2e:report
```

### Tests par Suite

```bash
# Tests d'authentification
npm run e2e:auth

# Tests de gestion des utilisateurs
npm run e2e:users

# Tests de planning
npm run e2e:planning

# Tests de rapports
npm run e2e:reports
```

## Mode Développement

### Exécuter avec interface visible

```bash
# Voir les tests s'exécuter dans le navigateur
npm run e2e:headed
```

### Mode Debug

```bash
# Pause à chaque étape pour debugging
npm run e2e:debug
```

### Mode UI (Interface Interactive)

```bash
# Interface graphique Playwright
npm run e2e:ui
```

Dans l'UI, vous pouvez:
- Sélectionner et exécuter des tests spécifiques
- Voir les étapes en temps réel
- Re-exécuter des tests qui ont échoué
- Inspecter les traces

## Workflow Recommandé

### Avant de coder

```bash
# 1. Vérifier que les tests smoke passent
npm run e2e:smoke

# 2. Si smoke OK, l'application est fonctionnelle
```

### Après avoir modifié le frontend

```bash
# 1. Tester la suite affectée
npm run e2e:auth        # Si modification de l'auth
npm run e2e:users       # Si modification des users
npm run e2e:planning    # Si modification du planning
npm run e2e:reports     # Si modification des rapports

# 2. Si tous les tests passent, exécuter la suite complète
npm run e2e
```

### En cas d'échec

1. **Consulter le rapport HTML**
   ```bash
   npm run e2e:report
   ```

2. **Voir les screenshots et vidéos**
   - `e2e/screenshots/` - Screenshots des échecs
   - `e2e/videos/` - Vidéos des échecs

3. **Re-exécuter en mode debug**
   ```bash
   npm run e2e:debug
   ```

4. **Vérifier les logs**
   - Console du navigateur
   - Logs des services backend

## Commandes Avancées

### Exécuter un test spécifique

```bash
# Par nom de fichier
npx playwright test e2e/tests/smoke.spec.ts

# Par nom de test (pattern)
npx playwright test --grep "Login admin"
npx playwright test --grep "création utilisateur"
```

### Options utiles

```bash
# Exécuter avec retry (2 tentatives en cas d'échec)
npx playwright test --retries=2

# Exécuter en parallèle (4 workers)
npx playwright test --workers=4

# Exécuter sur Firefox
npx playwright test --project=firefox

# Augmenter le timeout
npx playwright test --timeout=60000
```

## Troubleshooting Rapide

### Erreur: "Timeout waiting for locator"

**Cause**: Élément non trouvé dans la page

**Solutions**:
1. Vérifier que le frontend est démarré (`http://localhost:4200`)
2. Vérifier que le `data-testid` existe dans le composant Angular
3. Attendre que la page soit chargée avant d'interagir

### Erreur: "Target page, context or browser has been closed"

**Cause**: Services backend non disponibles ou lents

**Solutions**:
1. Vérifier que le gateway répond: `curl http://localhost:8090/actuator/health`
2. Vérifier que les microservices sont actifs: `docker-compose ps`
3. Redémarrer les services si nécessaire

### Erreur: "Cannot find module '@playwright/test'"

**Cause**: Playwright non installé

**Solution**:
```bash
npm install
npx playwright install chromium
```

### Tests flaky (passent parfois, échouent parfois)

**Causes communes**:
- Services backend lents
- Race conditions dans le code
- Données de test conflictuelles

**Solutions**:
1. Augmenter les timeouts dans `playwright.config.ts`
2. Ajouter des `waitFor` explicites
3. S'assurer que chaque test nettoie ses données

## Structure des Données de Test

### Utilisateurs par défaut

Deux utilisateurs de test doivent exister:

```typescript
// Admin
Email: admin@iusjc.edu
Password: admin123

// Teacher
Email: teacher@iusjc.edu
Password: teacher123
```

### Générer des données uniques

Pour éviter les conflits entre tests:

```typescript
import { generateUniqueEmail } from '../fixtures/test-data';

const email = generateUniqueEmail('teacher'); // teacher-1708012345@iusjc.test
```

## Bonnes Pratiques

### ✅ DO

- Exécuter `npm run e2e:smoke` avant de commencer à travailler
- Utiliser `data-testid` pour tous les éléments interactifs
- Nettoyer les données créées pendant les tests
- Attendre explicitement les éléments et actions
- Écrire des tests indépendants

### ❌ DON'T

- Ne pas utiliser `waitForTimeout()` (flaky)
- Ne pas utiliser des sélecteurs CSS fragiles (`.btn-primary`)
- Ne pas laisser des données de test dans la DB
- Ne pas commit un test qui échoue
- Ne pas skip des tests sans raison

## Intégration CI/CD

Les tests E2E sont exécutés automatiquement:
- À chaque push sur `main`
- À chaque Pull Request
- Avant chaque déploiement

Pour simuler le CI en local:

```bash
# Mode CI (1 worker, 2 retries)
CI=true npm run e2e
```

## Ressources Utiles

- **Documentation complète**: `e2e/README.md`
- **Configuration**: `playwright.config.ts`
- **Page Objects**: `e2e/page-objects/`
- **Helpers**: `e2e/helpers/`
- **Fixtures**: `e2e/fixtures/test-data.ts`

## Commandes Mémo

```bash
# Installation initiale
npm install && npx playwright install chromium

# Tests smoke (rapide)
npm run e2e:smoke

# Tests complets
npm run e2e

# Mode debug
npm run e2e:debug

# Mode UI
npm run e2e:ui

# Rapport
npm run e2e:report

# Test spécifique
npx playwright test --grep "Login admin"
```

## Support

En cas de problème:
1. Consulter `e2e/README.md` (documentation complète)
2. Vérifier les issues GitHub
3. Contacter l'équipe QA

---

**Prêt à commencer?** Exécutez:

```bash
npm run e2e:smoke
```

Si les 10 tests smoke passent, vous êtes prêt! 🚀
