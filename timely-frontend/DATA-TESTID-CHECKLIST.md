# Checklist data-testid pour Tests E2E

## Pourquoi data-testid ?

Les `data-testid` permettent de:
- Avoir des sélecteurs **stables** (ne changent pas avec le style)
- Identifier clairement les éléments **testables**
- Éviter les tests **flaky** (instables)
- Séparer les **concerns** (CSS vs tests)

## Convention de nommage

### Format général

```
data-testid="[context]-[element]-[action/type]"
```

### Exemples

```html
<!-- Buttons -->
<button data-testid="login-button">Login</button>
<button data-testid="add-user-button">Ajouter</button>
<button data-testid="submit-form-button">Soumettre</button>

<!-- Inputs -->
<input data-testid="email-input" type="email">
<input data-testid="password-input" type="password">
<input data-testid="user-firstname-input">

<!-- Selects -->
<select data-testid="user-role-select">
<select data-testid="filter-department-select">

<!-- Links -->
<a data-testid="forgot-password-link">Mot de passe oublié</a>
<a data-testid="nav-users">Utilisateurs</a>

<!-- Containers -->
<div data-testid="user-row" [attr.data-email]="user.email">
<div data-testid="main-content">
<div data-testid="sidebar-navigation">

<!-- Messages -->
<div data-testid="error-message">
<div data-testid="success-message">
<div data-testid="loading-spinner">
```

## Checklist par Page

### Page Login

```html
<!-- Formulaire -->
<input data-testid="email-input" type="email">
<input data-testid="password-input" type="password">
<button data-testid="login-button">Se connecter</button>
<input data-testid="remember-me-checkbox" type="checkbox">

<!-- Messages et liens -->
<div data-testid="error-message"></div>
<a data-testid="forgot-password-link">Mot de passe oublié</a>
```

### Page Dashboard

```html
<!-- Layout -->
<div data-testid="page-title">Dashboard</div>
<div data-testid="sidebar-navigation">
<div data-testid="main-content">
<button data-testid="user-menu-button">Menu</button>
<button data-testid="logout-button">Déconnexion</button>
<button data-testid="refresh-button">Rafraîchir</button>

<!-- Stats -->
<div data-testid="stats-card">
<div data-testid="stat-total-users">
<div data-testid="stat-total-courses">

<!-- Widgets -->
<div data-testid="recent-activities">
  <div data-testid="activity-item"></div>
</div>
<div data-testid="alerts-widget">
  <div data-testid="alert-item"></div>
</div>

<!-- Navigation -->
<a data-testid="nav-users">Utilisateurs</a>
<a data-testid="nav-planning">Planning</a>
<a data-testid="nav-reports">Rapports</a>
<a data-testid="nav-settings">Paramètres</a>
```

### Page Users (Gestion Utilisateurs)

```html
<!-- Header -->
<div data-testid="page-title">Utilisateurs</div>
<button data-testid="add-user-button">Ajouter</button>

<!-- Recherche et filtres -->
<input data-testid="search-input" type="text">
<button data-testid="search-button">Rechercher</button>
<select data-testid="filter-role">
<select data-testid="filter-status">

<!-- Table -->
<table data-testid="users-table">
  <tr data-testid="user-row" [attr.data-email]="user.email">
    <td data-testid="user-firstname">{{ user.firstName }}</td>
    <td data-testid="user-lastname">{{ user.lastName }}</td>
    <td data-testid="user-email">{{ user.email }}</td>
    <td data-testid="user-role">{{ user.role }}</td>
    <td data-testid="user-status">{{ user.status }}</td>
    <td>
      <button data-testid="edit-button">Éditer</button>
      <button data-testid="block-button">Bloquer</button>
      <button data-testid="delete-button">Supprimer</button>
    </td>
  </tr>
</table>

<!-- Pagination -->
<div data-testid="pagination">
  <button data-testid="previous-page-button">Précédent</button>
  <button data-testid="next-page-button">Suivant</button>
</div>

<!-- Modal création/édition -->
<div data-testid="create-user-modal">
  <input data-testid="user-firstname-input">
  <input data-testid="user-lastname-input">
  <input data-testid="user-email-input">
  <input data-testid="user-password-input">
  <select data-testid="user-role-select">
  <button data-testid="submit-user-button">Enregistrer</button>
  <button data-testid="cancel-button">Annuler</button>
</div>

<!-- Modals de confirmation -->
<div data-testid="confirm-dialog">
  <button data-testid="confirm-delete-button">Confirmer</button>
  <button data-testid="confirm-block-button">Confirmer</button>
  <button data-testid="confirm-unblock-button">Confirmer</button>
</div>

<!-- Messages -->
<div data-testid="success-message"></div>
<div data-testid="error-message"></div>
```

### Page Planning (Emploi du Temps)

```html
<!-- Header -->
<div data-testid="page-title">Planning</div>
<button data-testid="generate-schedule-button">Générer</button>

<!-- Configuration -->
<form data-testid="schedule-config-form">
  <select data-testid="semester-select">
  <input data-testid="year-input" type="number">
  <input data-testid="auto-assign-rooms-checkbox" type="checkbox">
  <button data-testid="submit-config-button">Valider</button>
</form>

<!-- Calendrier -->
<div data-testid="schedule-calendar">
  <div data-testid="course-{{ course.code }}"
       [attr.data-day]="course.day"
       [attr.data-time]="course.time">
  </div>
</div>

<!-- Vues -->
<button data-testid="view-week-button">Semaine</button>
<button data-testid="view-month-button">Mois</button>

<!-- Filtres -->
<select data-testid="filter-teacher">
<select data-testid="filter-room">

<!-- Conflits -->
<div data-testid="conflicts-panel">
  <div data-testid="conflict-item">
    <select data-testid="resolution-select">
    <button data-testid="apply-resolution-button">Appliquer</button>
  </div>
</div>

<!-- Actions -->
<div data-testid="schedule-status">{{ status }}</div>
<button data-testid="publish-button">Publier</button>
<button data-testid="export-pdf-button">Export PDF</button>
<button data-testid="export-ical-button">Export iCal</button>

<!-- Messages -->
<div data-testid="generation-success-message">
<div data-testid="conflict-resolved-message">
<div data-testid="publish-success-message">

<!-- Modals -->
<div data-testid="course-details-modal">
  <div data-testid="course-name">
  <div data-testid="course-time">
  <div data-testid="course-room">
  <div data-testid="course-teacher">
</div>

<div data-testid="conflict-details-modal">
```

### Page Reports (Rapports)

```html
<!-- Header -->
<div data-testid="page-title">Rapports</div>

<!-- Configuration rapport -->
<select data-testid="report-type-select">
<input data-testid="date-range-start" type="date">
<input data-testid="date-range-end" type="date">
<select data-testid="filter-department">
<button data-testid="generate-report-button">Générer</button>

<!-- Contenu rapport -->
<div data-testid="report-content">
  <div data-testid="chart-container"></div>
  <table data-testid="report-table">
</div>

<!-- Export -->
<button data-testid="export-pdf-button">PDF</button>
<button data-testid="export-excel-button">Excel</button>

<!-- Statistiques -->
<div data-testid="stat-{{ statName }}">

<!-- Journal d'audit -->
<table data-testid="audit-log-table">
  <tr data-testid="audit-log-entry">
    <td data-testid="audit-action">
    <td data-testid="audit-user">
    <td data-testid="audit-timestamp">
  </tr>
</table>

<select data-testid="audit-action-filter">
<input data-testid="audit-user-filter">
<button data-testid="apply-filter-button">Filtrer</button>

<button data-testid="audit-next-page">

<!-- Modal détails -->
<div data-testid="audit-details-modal">
```

## Comment ajouter data-testid dans Angular

### Approche 1: Statique

```html
<button data-testid="login-button">Se connecter</button>
```

### Approche 2: Dynamique avec [attr.data-testid]

```html
<button [attr.data-testid]="'submit-' + formType + '-button'">
  Soumettre
</button>

<!-- Résultat: data-testid="submit-user-button" -->
```

### Approche 3: Avec données dynamiques

```html
<tr *ngFor="let user of users"
    data-testid="user-row"
    [attr.data-email]="user.email"
    [attr.data-id]="user.id">
  <!-- ... -->
</tr>
```

Usage dans les tests:
```typescript
// Sélectionner une ligne par email
const userRow = page.locator('[data-testid="user-row"][data-email="admin@iusjc.edu"]');

// Sélectionner une ligne par ID
const userRow = page.locator('[data-testid="user-row"][data-id="123"]');
```

### Approche 4: Avec ngIf

```html
<div *ngIf="showError" data-testid="error-message">
  {{ errorMessage }}
</div>
```

## Directive personnalisée (optionnel)

Pour simplifier l'ajout de data-testid:

```typescript
// test-id.directive.ts
import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[testId]'
})
export class TestIdDirective {
  @Input() set testId(value: string) {
    this.el.nativeElement.setAttribute('data-testid', value);
  }

  constructor(private el: ElementRef) {}
}
```

Usage:
```html
<button [testId]="'login-button'">Se connecter</button>
```

## Production vs Development

Si vous voulez retirer les data-testid en production:

```typescript
// test-id.directive.ts
import { Directive, Input, ElementRef, isDevMode } from '@angular/core';

@Directive({
  selector: '[testId]'
})
export class TestIdDirective {
  @Input() set testId(value: string) {
    if (isDevMode()) {
      this.el.nativeElement.setAttribute('data-testid', value);
    }
  }

  constructor(private el: ElementRef) {}
}
```

**Note**: Dans la plupart des cas, garder les data-testid en production n'est pas un problème (quelques Ko supplémentaires seulement).

## Validation

Pour vérifier que tous les éléments interactifs ont un data-testid:

```typescript
// Script de validation (à créer)
const missingTestIds = [];

// Vérifier tous les buttons sans data-testid
document.querySelectorAll('button:not([data-testid])').forEach(btn => {
  missingTestIds.push({
    type: 'button',
    text: btn.textContent,
    class: btn.className,
  });
});

console.table(missingTestIds);
```

## Checklist de vérification

Avant de merger du code:

- [ ] Tous les boutons ont un data-testid
- [ ] Tous les inputs ont un data-testid
- [ ] Tous les selects ont un data-testid
- [ ] Les éléments de navigation ont un data-testid
- [ ] Les messages d'erreur/succès ont un data-testid
- [ ] Les éléments de liste/table ont un data-testid
- [ ] Les modals ont un data-testid
- [ ] Les titres de page ont un data-testid

## Exemples concrets

### Avant (sans data-testid)

```html
<div class="user-card">
  <h3>{{ user.name }}</h3>
  <button class="btn-edit" (click)="edit()">Éditer</button>
  <button class="btn-delete" (click)="delete()">Supprimer</button>
</div>
```

### Après (avec data-testid)

```html
<div class="user-card"
     data-testid="user-card"
     [attr.data-user-id]="user.id">
  <h3 data-testid="user-name">{{ user.name }}</h3>
  <button class="btn-edit"
          data-testid="edit-user-button"
          (click)="edit()">
    Éditer
  </button>
  <button class="btn-delete"
          data-testid="delete-user-button"
          (click)="delete()">
    Supprimer
  </button>
</div>
```

Test correspondant:
```typescript
test('Éditer un utilisateur', async ({ page }) => {
  const userCard = page.locator('[data-testid="user-card"][data-user-id="123"]');
  await userCard.locator('[data-testid="edit-user-button"]').click();

  // Vérifier que le modal s'ouvre
  await expect(page.locator('[data-testid="edit-user-modal"]')).toBeVisible();
});
```

## Ressources

- [Documentation Playwright - Locators](https://playwright.dev/docs/locators)
- [Best Practices - Selectors](https://playwright.dev/docs/selectors#best-practices)

---

**Note importante**: L'ajout de data-testid doit être fait **progressivement** au fur et à mesure du développement. Pas besoin de tout faire d'un coup.
