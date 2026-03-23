import { APIRequestContext } from '@playwright/test';

/**
 * Helpers pour la gestion de la base de données dans les tests E2E
 *
 * Ces fonctions permettent de:
 * - Nettoyer les données de test
 * - Réinitialiser l'état de la base de données
 * - Créer des fixtures de données
 */

/**
 * Nettoie toutes les données de test créées pendant les tests
 * À appeler dans afterEach ou afterAll
 */
export async function cleanupTestData(
  request: APIRequestContext,
  token: string
): Promise<void> {
  // Note: Cette fonction nécessite que le backend expose des endpoints de cleanup
  // Pour l'instant, on fait un cleanup manuel via les endpoints DELETE standards

  console.log('Nettoyage des données de test...');

  // Les cleanups spécifiques doivent être gérés par chaque test
  // car nous ne voulons pas supprimer toutes les données
}

/**
 * Réinitialise la base de données à un état connu
 * ATTENTION: Cette fonction supprime TOUTES les données
 * À utiliser uniquement dans un environnement de test dédié
 */
export async function resetDatabase(request: APIRequestContext): Promise<void> {
  // Note: Cette fonction nécessite un endpoint backend spécifique
  // pour réinitialiser la DB (seulement en mode test)

  console.warn('Reset de la base de données - fonctionnalité à implémenter côté backend');

  // TODO: Implémenter quand le backend expose un endpoint de reset
  // await request.post('http://localhost:8090/api/test/reset-database');
}

/**
 * Crée un jeu de données de test complet (seed data)
 * Utile pour les tests qui nécessitent un état initial complexe
 */
export async function seedTestData(
  request: APIRequestContext,
  token: string
): Promise<void> {
  console.log('Création des données de test initiales...');

  // TODO: Créer les données de base nécessaires pour les tests
  // - Utilisateurs admin et teachers
  // - Cours de base
  // - Salles de base
  // - Etc.
}

/**
 * Vérifie si la base de données est dans un état valide pour les tests
 */
export async function isDatabaseReady(request: APIRequestContext): Promise<boolean> {
  try {
    // Vérifier la connectivité en tentant un simple GET sur health
    const response = await request.get('http://localhost:8090/actuator/health');
    return response.ok();
  } catch (error) {
    console.error('La base de données n\'est pas prête:', error);
    return false;
  }
}

/**
 * Attend que la base de données soit prête
 * Utile dans beforeAll pour s'assurer que tout est opérationnel
 */
export async function waitForDatabaseReady(
  request: APIRequestContext,
  maxAttempts: number = 30,
  delayMs: number = 1000
): Promise<void> {
  console.log('Attente de la disponibilité de la base de données...');

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (await isDatabaseReady(request)) {
      console.log('Base de données prête!');
      return;
    }

    console.log(`Tentative ${attempt}/${maxAttempts} - En attente...`);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  throw new Error('Timeout: La base de données n\'est pas disponible');
}

/**
 * Crée un snapshot de l'état actuel de la base de données
 * Utile pour restaurer un état après des tests
 */
export async function createDatabaseSnapshot(
  request: APIRequestContext,
  snapshotName: string
): Promise<void> {
  console.log(`Création du snapshot: ${snapshotName}`);

  // TODO: Implémenter quand le backend expose cette fonctionnalité
  // await request.post('http://localhost:8090/api/test/snapshots', {
  //   data: { name: snapshotName }
  // });
}

/**
 * Restaure un snapshot précédemment créé
 */
export async function restoreDatabaseSnapshot(
  request: APIRequestContext,
  snapshotName: string
): Promise<void> {
  console.log(`Restauration du snapshot: ${snapshotName}`);

  // TODO: Implémenter quand le backend expose cette fonctionnalité
  // await request.post(`http://localhost:8090/api/test/snapshots/${snapshotName}/restore`);
}

/**
 * Compte le nombre d'enregistrements dans une table
 * Utile pour vérifier les opérations CRUD
 */
export async function countRecords(
  request: APIRequestContext,
  endpoint: string,
  token: string
): Promise<number> {
  try {
    const response = await request.get(`http://localhost:8090${endpoint}?page=0&size=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok()) {
      throw new Error(`Failed to count records: ${response.status()}`);
    }

    const data = await response.json();
    return data.totalElements || 0;
  } catch (error) {
    console.error('Erreur lors du comptage des enregistrements:', error);
    return 0;
  }
}
