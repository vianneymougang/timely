# Exemples de Tests E2E Playwright

Ce document fournit des exemples concrets pour écrire des tests E2E avec Playwright.

## Table des matières

1. [Structure de base d'un test](#structure-de-base)
2. [Authentification](#authentification)
3. [Navigation](#navigation)
4. [Formulaires](#formulaires)
5. [Tableaux et listes](#tableaux-et-listes)
6. [Modals et dialogs](#modals-et-dialogs)
7. [API calls](#api-calls)
8. [Téléchargements](#téléchargements)
9. [Erreurs et validations](#erreurs-et-validations)
10. [Assertions avancées](#assertions-avancées)

---

## Structure de base

### Test simple

```typescript
import { test, expect } from '@playwright/test';

test.describe('Ma Suite de Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Setup avant chaque test
    await page.goto('/');
  });

  test('Mon premier test', async ({ page }) => {
    // Naviguer
    await page.goto('/login');

    // Interagir
    await page.fill('[data-testid="email-input"]', 'test@example.com');

    // Vérifier
    await expect(page.locator('[data-testid="email-input"]')).toHaveValue('test@example.com');
  });
});
```

### Test avec Page Object

```typescript
import { test } from '@playwright/test';
import { LoginPage } from '../page-objects/login.page';

test('Login avec Page Object', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login('admin@iusjc.edu', 'admin123');

  expect(page.url()).toContain('/dashboard');
});
```

---

## Authentification

### Login basique

```typescript
test('Login utilisateur', async ({ page }) => {
  await page.goto('/login');

  await page.fill('[data-testid="email-input"]', 'admin@iusjc.edu');
  await page.fill('[data-testid="password-input"]', 'admin123');
  await page.click('[data-testid="login-button"]');

  await page.waitForURL('/admin/dashboard');
  expect(page.url()).toContain('/dashboard');
});
```

### Login avec helper

```typescript
import { loginAsAdmin } from '../helpers/auth.helper';

test('Test nécessitant auth', async ({ page }) => {
  await loginAsAdmin(page);

  // L'utilisateur est maintenant connecté
  await page.goto('/admin/users');
});
```

### Login via API (plus rapide)

```typescript
import { loginAdminViaAPI } from '../helpers/auth.helper';

test('Login rapide via API', async ({ page }) => {
  const token = await loginAdminViaAPI(page);

  // Token stocké, on peut naviguer directement
  await page.goto('/admin/dashboard');
});
```

### Vérifier l'état d'authentification

```typescript
import { isLoggedIn } from '../helpers/auth.helper';

test('Vérifier auth', async ({ page }) => {
  await page.goto('/');

  const loggedIn = await isLoggedIn(page);
  expect(loggedIn).toBe(false);

  await loginAsAdmin(page);

  const loggedInAfter = await isLoggedIn(page);
  expect(loggedInAfter).toBe(true);
});
```

---

## Navigation

### Navigation simple

```typescript
test('Navigation entre pages', async ({ page }) => {
  await page.goto('/admin/dashboard');
  await page.click('[data-testid="nav-users"]');
  await page.waitForURL('/admin/users');

  expect(page.url()).toContain('/users');
});
```

### Navigation avec vérification

```typescript
test('Navigation avec sidebar', async ({ page }) => {
  await loginAsAdmin(page);

  const dashboardPage = new DashboardPage(page);
  await dashboardPage.navigateTo('users');

  // Vérifier qu'on est bien sur la bonne page
  await expect(page.locator('[data-testid="page-title"]')).toContainText('Utilisateurs');
});
```

### Redirection après action

```typescript
test('Redirection après logout', async ({ page }) => {
  await loginAsAdmin(page);

  await page.click('[data-testid="user-menu-button"]');
  await page.click('[data-testid="logout-button"]');

  // Attendre la redirection
  await page.waitForURL('/login', { timeout: 5000 });
  expect(page.url()).toContain('/login');
});
```

---

## Formulaires

### Remplir un formulaire simple

```typescript
test('Créer un utilisateur', async ({ page }) => {
  await page.goto('/admin/users');
  await page.click('[data-testid="add-user-button"]');

  await page.fill('[data-testid="user-firstname-input"]', 'Jean');
  await page.fill('[data-testid="user-lastname-input"]', 'Dupont');
  await page.fill('[data-testid="user-email-input"]', 'jean.dupont@iusjc.edu');
  await page.fill('[data-testid="user-password-input"]', 'password123');
  await page.selectOption('[data-testid="user-role-select"]', 'TEACHER');

  await page.click('[data-testid="submit-user-button"]');

  // Attendre la confirmation
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
});
```

### Formulaire avec validation

```typescript
test('Validation email invalide', async ({ page }) => {
  await page.goto('/admin/users');
  await page.click('[data-testid="add-user-button"]');

  await page.fill('[data-testid="user-email-input"]', 'not-an-email');
  await page.click('[data-testid="submit-user-button"]');

  // Vérifier le message d'erreur
  await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
  await expect(page.locator('[data-testid="email-error"]')).toContainText('Email invalide');
});
```

### Checkbox et radio buttons

```typescript
test('Sélectionner des options', async ({ page }) => {
  // Checkbox
  await page.check('[data-testid="auto-assign-rooms-checkbox"]');
  expect(await page.isChecked('[data-testid="auto-assign-rooms-checkbox"]')).toBe(true);

  // Radio button
  await page.check('[data-testid="semester-fall-radio"]');
  expect(await page.isChecked('[data-testid="semester-fall-radio"]')).toBe(true);
});
```

### Upload de fichier

```typescript
test('Upload fichier', async ({ page }) => {
  await page.goto('/admin/import');

  // Upload
  await page.setInputFiles('[data-testid="file-input"]', 'path/to/file.csv');

  // Vérifier que le fichier est sélectionné
  const fileName = await page.locator('[data-testid="file-name"]').textContent();
  expect(fileName).toBe('file.csv');
});
```

---

## Tableaux et listes

### Compter les lignes

```typescript
test('Compter les utilisateurs', async ({ page }) => {
  await page.goto('/admin/users');

  const rows = page.locator('[data-testid="user-row"]');
  const count = await rows.count();

  expect(count).toBeGreaterThan(0);
});
```

### Vérifier une ligne spécifique

```typescript
test('Vérifier utilisateur dans liste', async ({ page }) => {
  await page.goto('/admin/users');

  const userRow = page.locator('[data-testid="user-row"][data-email="admin@iusjc.edu"]');

  await expect(userRow).toBeVisible();
  await expect(userRow.locator('[data-testid="user-role"]')).toContainText('ADMIN');
});
```

### Itérer sur les lignes

```typescript
test('Vérifier toutes les lignes', async ({ page }) => {
  await page.goto('/admin/users');

  const rows = page.locator('[data-testid="user-row"]');
  const count = await rows.count();

  for (let i = 0; i < count; i++) {
    const row = rows.nth(i);
    const email = await row.locator('[data-testid="user-email"]').textContent();

    expect(email).toContain('@');
  }
});
```

### Pagination

```typescript
test('Navigation entre pages', async ({ page }) => {
  await page.goto('/admin/users');

  const countPage1 = await page.locator('[data-testid="user-row"]').count();

  // Aller à la page suivante
  await page.click('[data-testid="next-page-button"]');
  await page.waitForLoadState('networkidle');

  const countPage2 = await page.locator('[data-testid="user-row"]').count();

  expect(countPage2).toBeGreaterThan(0);
});
```

---

## Modals et dialogs

### Ouvrir et fermer un modal

```typescript
test('Modal de création', async ({ page }) => {
  await page.goto('/admin/users');

  // Ouvrir le modal
  await page.click('[data-testid="add-user-button"]');

  // Vérifier que le modal est visible
  const modal = page.locator('[data-testid="create-user-modal"]');
  await expect(modal).toBeVisible();

  // Fermer le modal
  await page.click('[data-testid="cancel-button"]');

  // Vérifier que le modal est fermé
  await expect(modal).not.toBeVisible();
});
```

### Confirmation dialog

```typescript
test('Confirmation de suppression', async ({ page }) => {
  await page.goto('/admin/users');

  // Cliquer sur supprimer
  await page.click('[data-testid="delete-user-button"]');

  // Vérifier le dialog de confirmation
  const confirmDialog = page.locator('[data-testid="confirm-dialog"]');
  await expect(confirmDialog).toBeVisible();

  // Confirmer
  await page.click('[data-testid="confirm-delete-button"]');

  // Vérifier que le dialog est fermé
  await expect(confirmDialog).not.toBeVisible();
});
```

### Dialog natif (alert, confirm, prompt)

```typescript
test('Alert native', async ({ page }) => {
  // Écouter les dialogs
  page.on('dialog', async (dialog) => {
    expect(dialog.message()).toContain('Êtes-vous sûr');
    await dialog.accept();
  });

  await page.goto('/admin/users');
  await page.click('[data-testid="dangerous-action-button"]');
});
```

---

## API calls

### Appel API direct

```typescript
test('Créer utilisateur via API', async ({ request }) => {
  const response = await request.post('http://localhost:8090/api/users', {
    data: {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean@iusjc.edu',
      role: 'TEACHER',
    },
    headers: {
      'Authorization': 'Bearer token-here',
    },
  });

  expect(response.ok()).toBeTruthy();

  const data = await response.json();
  expect(data.email).toBe('jean@iusjc.edu');
});
```

### Utiliser les helpers API

```typescript
import { createUser } from '../helpers/api.helper';

test('Créer utilisateur avec helper', async ({ request, page }) => {
  const token = await loginAdminViaAPI(page);

  const user = await createUser(request, {
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'marie@iusjc.edu',
    role: 'TEACHER',
  }, token);

  expect(user.id).toBeTruthy();
});
```

### Intercepter des requêtes réseau

```typescript
test('Intercepter requête API', async ({ page }) => {
  // Intercepter toutes les requêtes vers /api/users
  await page.route('**/api/users', (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([
        { id: 1, email: 'user1@test.com' },
        { id: 2, email: 'user2@test.com' },
      ]),
    });
  });

  await page.goto('/admin/users');

  // La page affichera les données mockées
  await expect(page.locator('[data-testid="user-row"]')).toHaveCount(2);
});
```

---

## Téléchargements

### Télécharger un fichier

```typescript
test('Export PDF', async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto('/admin/reports');

  // Écouter le téléchargement
  const downloadPromise = page.waitForEvent('download');

  await page.click('[data-testid="export-pdf-button"]');

  const download = await downloadPromise;

  // Vérifier le nom du fichier
  expect(download.suggestedFilename()).toMatch(/\.pdf$/);

  // Sauvegarder le fichier
  await download.saveAs('/path/to/save/file.pdf');
});
```

### Vérifier le contenu du fichier

```typescript
test('Vérifier contenu Excel', async ({ page }) => {
  const downloadPromise = page.waitForEvent('download');

  await page.click('[data-testid="export-excel-button"]');

  const download = await downloadPromise;

  // Sauvegarder
  const path = await download.path();

  // Lire et vérifier le contenu
  const fs = require('fs');
  const content = fs.readFileSync(path);

  expect(content.length).toBeGreaterThan(0);
});
```

---

## Erreurs et validations

### Message d'erreur

```typescript
test('Affichage erreur', async ({ page }) => {
  await page.goto('/login');

  await page.fill('[data-testid="email-input"]', 'invalid@test.com');
  await page.fill('[data-testid="password-input"]', 'wrongpassword');
  await page.click('[data-testid="login-button"]');

  // Vérifier le message d'erreur
  const errorMessage = page.locator('[data-testid="error-message"]');
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText('Email ou mot de passe incorrect');
});
```

### Validation de formulaire

```typescript
test('Champs requis', async ({ page }) => {
  await page.goto('/admin/users');
  await page.click('[data-testid="add-user-button"]');

  // Soumettre sans remplir
  await page.click('[data-testid="submit-user-button"]');

  // Vérifier les erreurs de validation
  await expect(page.locator('[data-testid="firstname-error"]')).toBeVisible();
  await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
});
```

### Erreur réseau

```typescript
test('Gérer erreur réseau', async ({ page }) => {
  // Simuler une erreur réseau
  await page.route('**/api/users', (route) => {
    route.abort('failed');
  });

  await page.goto('/admin/users');

  // Vérifier le message d'erreur
  await expect(page.locator('[data-testid="network-error"]')).toBeVisible();
});
```

---

## Assertions avancées

### Visibilité

```typescript
// Élément visible
await expect(page.locator('[data-testid="element"]')).toBeVisible();

// Élément caché
await expect(page.locator('[data-testid="element"]')).toBeHidden();

// Élément n'existe pas
await expect(page.locator('[data-testid="element"]')).not.toBeVisible();
```

### Contenu texte

```typescript
// Contient du texte
await expect(page.locator('[data-testid="title"]')).toContainText('Utilisateurs');

// Texte exact
await expect(page.locator('[data-testid="title"]')).toHaveText('Gestion des Utilisateurs');

// Regex
await expect(page.locator('[data-testid="email"]')).toHaveText(/.*@iusjc\.edu$/);
```

### Attributs

```typescript
// Attribut présent
await expect(page.locator('[data-testid="input"]')).toHaveAttribute('type', 'email');

// CSS class
await expect(page.locator('[data-testid="button"]')).toHaveClass(/active/);

// Valeur input
await expect(page.locator('[data-testid="email-input"]')).toHaveValue('test@test.com');
```

### État

```typescript
// Désactivé
await expect(page.locator('[data-testid="button"]')).toBeDisabled();

// Activé
await expect(page.locator('[data-testid="button"]')).toBeEnabled();

// Coché
await expect(page.locator('[data-testid="checkbox"]')).toBeChecked();
```

### Nombre d'éléments

```typescript
// Compte exact
await expect(page.locator('[data-testid="user-row"]')).toHaveCount(5);

// Au moins N éléments
const count = await page.locator('[data-testid="user-row"]').count();
expect(count).toBeGreaterThan(0);
expect(count).toBeGreaterThanOrEqual(5);

// Au plus N éléments
expect(count).toBeLessThan(10);
expect(count).toBeLessThanOrEqual(10);
```

### URL

```typescript
// Contient
expect(page.url()).toContain('/dashboard');

// Exact
expect(page.url()).toBe('http://localhost:4200/admin/dashboard');

// Regex
expect(page.url()).toMatch(/\/admin\/.*$/);
```

### Screenshot comparison

```typescript
test('Comparaison visuelle', async ({ page }) => {
  await page.goto('/admin/dashboard');

  // Comparer avec le screenshot de référence
  await expect(page).toHaveScreenshot('dashboard.png');
});
```

---

## Conseils pratiques

### Attendre un élément

```typescript
// Attendre qu'un élément soit visible
await page.waitForSelector('[data-testid="element"]', { state: 'visible' });

// Attendre qu'un élément disparaisse
await page.waitForSelector('[data-testid="element"]', { state: 'hidden' });

// Attendre une navigation
await page.waitForURL('/dashboard');

// Attendre que le réseau soit idle
await page.waitForLoadState('networkidle');
```

### Gérer les timeouts

```typescript
// Timeout personnalisé pour une action
await page.click('[data-testid="button"]', { timeout: 10000 });

// Timeout pour une assertion
await expect(page.locator('[data-testid="element"]')).toBeVisible({ timeout: 15000 });
```

### Débug dans les tests

```typescript
test('Debug test', async ({ page }) => {
  await page.goto('/admin/users');

  // Pause le test (mode debug uniquement)
  await page.pause();

  // Log dans la console
  console.log(await page.title());

  // Screenshot
  await page.screenshot({ path: 'debug.png' });

  // HTML de la page
  console.log(await page.content());
});
```

---

**Pour plus d'exemples, consultez:**
- Tests existants dans `e2e/tests/`
- [Documentation Playwright](https://playwright.dev/docs/intro)
