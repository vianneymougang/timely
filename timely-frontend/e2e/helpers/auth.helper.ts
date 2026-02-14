import { Page } from '@playwright/test';
import { TEST_USERS } from '../fixtures/test-data';

/**
 * Helpers pour l'authentification dans les tests E2E
 *
 * Ces fonctions facilitent les opérations d'authentification courantes:
 * - Login avec différents rôles (admin, teacher)
 * - Logout
 * - Vérification de l'état d'authentification
 */

/**
 * Connecte un utilisateur administrateur
 */
export async function loginAsAdmin(page: Page): Promise<void> {
  await login(page, TEST_USERS.admin.email, TEST_USERS.admin.password);
}

/**
 * Connecte un utilisateur enseignant
 */
export async function loginAsTeacher(page: Page): Promise<void> {
  await login(page, TEST_USERS.teacher.email, TEST_USERS.teacher.password);
}

/**
 * Connecte un utilisateur avec email et mot de passe personnalisés
 */
export async function login(page: Page, email: string, password: string): Promise<void> {
  // Naviguer vers la page de login
  await page.goto('/login');

  // Attendre que la page soit complètement chargée
  await page.waitForLoadState('networkidle');

  // Remplir le formulaire de connexion
  await page.fill('[data-testid="email-input"]', email);
  await page.fill('[data-testid="password-input"]', password);

  // Soumettre le formulaire
  await page.click('[data-testid="login-button"]');

  // Attendre la redirection vers le dashboard
  // L'URL exacte dépend du rôle (admin ou teacher)
  await page.waitForURL(/\/(admin|teacher)\/dashboard/, { timeout: 10000 });

  // Attendre que le dashboard soit chargé
  await page.waitForLoadState('networkidle');
}

/**
 * Déconnecte l'utilisateur courant
 */
export async function logout(page: Page): Promise<void> {
  // Ouvrir le menu utilisateur
  await page.click('[data-testid="user-menu-button"]');

  // Attendre que le menu soit visible
  await page.waitForSelector('[data-testid="logout-button"]', { state: 'visible' });

  // Cliquer sur le bouton de déconnexion
  await page.click('[data-testid="logout-button"]');

  // Attendre la redirection vers la page de login
  await page.waitForURL('/login', { timeout: 5000 });
}

/**
 * Vérifie si l'utilisateur est connecté
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    // Vérifier la présence d'un élément qui n'existe que quand on est connecté
    const userMenu = await page.locator('[data-testid="user-menu-button"]');
    return await userMenu.isVisible();
  } catch {
    return false;
  }
}

/**
 * Vérifie si l'utilisateur est déconnecté
 */
export async function isLoggedOut(page: Page): Promise<boolean> {
  try {
    const currentUrl = page.url();
    return currentUrl.includes('/login');
  } catch {
    return false;
  }
}

/**
 * Récupère le token d'authentification depuis le localStorage
 * Utile pour faire des appels API directs dans les tests
 */
export async function getAuthToken(page: Page): Promise<string | null> {
  return await page.evaluate(() => {
    return localStorage.getItem('auth_token');
  });
}

/**
 * Définit un token d'authentification dans le localStorage
 * Utile pour configurer rapidement l'état authentifié sans passer par le login UI
 */
export async function setAuthToken(page: Page, token: string): Promise<void> {
  await page.evaluate((authToken) => {
    localStorage.setItem('auth_token', authToken);
  }, token);
}

/**
 * Nettoie toutes les données d'authentification
 */
export async function clearAuthData(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Login rapide via l'API (bypass UI)
 * Utile pour les tests qui ne testent pas le login lui-même
 */
export async function loginViaAPI(
  page: Page,
  email: string,
  password: string
): Promise<string> {
  const response = await page.request.post('http://localhost:8090/api/auth/login', {
    data: {
      email,
      password,
    },
  });

  if (!response.ok()) {
    throw new Error(`Login API failed: ${response.status()}`);
  }

  const data = await response.json();
  const token = data.token;

  // Stocker le token dans le localStorage
  await setAuthToken(page, token);

  return token;
}

/**
 * Login admin rapide via API
 */
export async function loginAdminViaAPI(page: Page): Promise<string> {
  return await loginViaAPI(page, TEST_USERS.admin.email, TEST_USERS.admin.password);
}

/**
 * Login teacher rapide via API
 */
export async function loginTeacherViaAPI(page: Page): Promise<string> {
  return await loginViaAPI(page, TEST_USERS.teacher.email, TEST_USERS.teacher.password);
}
