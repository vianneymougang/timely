import { Page, APIRequestContext } from '@playwright/test';
import { API_ENDPOINTS } from '../fixtures/test-data';

/**
 * Helpers pour les appels API directs dans les tests E2E
 *
 * Ces fonctions permettent de:
 * - Créer des données de test via API (plus rapide que l'UI)
 * - Vérifier l'état du backend
 * - Nettoyer les données après les tests
 */

/**
 * Effectue un appel GET authentifié
 */
export async function apiGet(
  request: APIRequestContext,
  endpoint: string,
  token?: string
): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await request.get(`${API_ENDPOINTS.gateway}${endpoint}`, {
    headers,
  });

  if (!response.ok()) {
    throw new Error(`API GET ${endpoint} failed: ${response.status()}`);
  }

  return await response.json();
}

/**
 * Effectue un appel POST authentifié
 */
export async function apiPost(
  request: APIRequestContext,
  endpoint: string,
  data: any,
  token?: string
): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await request.post(`${API_ENDPOINTS.gateway}${endpoint}`, {
    headers,
    data,
  });

  if (!response.ok()) {
    throw new Error(`API POST ${endpoint} failed: ${response.status()}`);
  }

  return await response.json();
}

/**
 * Effectue un appel PUT authentifié
 */
export async function apiPut(
  request: APIRequestContext,
  endpoint: string,
  data: any,
  token?: string
): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await request.put(`${API_ENDPOINTS.gateway}${endpoint}`, {
    headers,
    data,
  });

  if (!response.ok()) {
    throw new Error(`API PUT ${endpoint} failed: ${response.status()}`);
  }

  return await response.json();
}

/**
 * Effectue un appel DELETE authentifié
 */
export async function apiDelete(
  request: APIRequestContext,
  endpoint: string,
  token?: string
): Promise<void> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await request.delete(`${API_ENDPOINTS.gateway}${endpoint}`, {
    headers,
  });

  if (!response.ok()) {
    throw new Error(`API DELETE ${endpoint} failed: ${response.status()}`);
  }
}

/**
 * Crée un utilisateur via API
 */
export async function createUser(
  request: APIRequestContext,
  userData: any,
  token: string
): Promise<any> {
  return await apiPost(request, `${API_ENDPOINTS.users}`, userData, token);
}

/**
 * Crée un cours via API
 */
export async function createCourse(
  request: APIRequestContext,
  courseData: any,
  token: string
): Promise<any> {
  return await apiPost(request, `${API_ENDPOINTS.planning}/courses`, courseData, token);
}

/**
 * Crée une salle via API
 */
export async function createRoom(
  request: APIRequestContext,
  roomData: any,
  token: string
): Promise<any> {
  return await apiPost(request, `${API_ENDPOINTS.booking}/rooms`, roomData, token);
}

/**
 * Crée une disponibilité enseignant via API
 */
export async function createAvailability(
  request: APIRequestContext,
  availabilityData: any,
  token: string
): Promise<any> {
  return await apiPost(
    request,
    `${API_ENDPOINTS.planning}/availabilities`,
    availabilityData,
    token
  );
}

/**
 * Génère un emploi du temps via API
 */
export async function generateSchedule(
  request: APIRequestContext,
  scheduleConfig: any,
  token: string
): Promise<any> {
  return await apiPost(
    request,
    `${API_ENDPOINTS.planning}/schedules/generate`,
    scheduleConfig,
    token
  );
}

/**
 * Vérifie la santé du gateway
 */
export async function checkGatewayHealth(request: APIRequestContext): Promise<boolean> {
  try {
    const response = await request.get(`${API_ENDPOINTS.gateway}/actuator/health`);
    return response.ok();
  } catch {
    return false;
  }
}

/**
 * Vérifie la santé d'un service spécifique
 */
export async function checkServiceHealth(
  request: APIRequestContext,
  serviceName: string
): Promise<boolean> {
  try {
    const response = await request.get(
      `${API_ENDPOINTS.gateway}/actuator/health/${serviceName}`
    );
    return response.ok();
  } catch {
    return false;
  }
}

/**
 * Récupère les statistiques du dashboard
 */
export async function getDashboardStats(
  request: APIRequestContext,
  token: string
): Promise<any> {
  return await apiGet(request, `${API_ENDPOINTS.reports}/dashboard/stats`, token);
}

/**
 * Récupère la liste paginée des utilisateurs
 */
export async function getUsers(
  request: APIRequestContext,
  token: string,
  page: number = 0,
  size: number = 20
): Promise<any> {
  return await apiGet(request, `${API_ENDPOINTS.users}?page=${page}&size=${size}`, token);
}

/**
 * Récupère la liste des cours
 */
export async function getCourses(
  request: APIRequestContext,
  token: string,
  page: number = 0,
  size: number = 20
): Promise<any> {
  return await apiGet(
    request,
    `${API_ENDPOINTS.planning}/courses?page=${page}&size=${size}`,
    token
  );
}

/**
 * Récupère la liste des salles
 */
export async function getRooms(
  request: APIRequestContext,
  token: string,
  page: number = 0,
  size: number = 20
): Promise<any> {
  return await apiGet(
    request,
    `${API_ENDPOINTS.booking}/rooms?page=${page}&size=${size}`,
    token
  );
}

/**
 * Supprime un utilisateur via API (pour cleanup)
 */
export async function deleteUser(
  request: APIRequestContext,
  userId: string,
  token: string
): Promise<void> {
  await apiDelete(request, `${API_ENDPOINTS.users}/${userId}`, token);
}

/**
 * Supprime un cours via API (pour cleanup)
 */
export async function deleteCourse(
  request: APIRequestContext,
  courseId: string,
  token: string
): Promise<void> {
  await apiDelete(request, `${API_ENDPOINTS.planning}/courses/${courseId}`, token);
}

/**
 * Supprime une salle via API (pour cleanup)
 */
export async function deleteRoom(
  request: APIRequestContext,
  roomId: string,
  token: string
): Promise<void> {
  await apiDelete(request, `${API_ENDPOINTS.booking}/rooms/${roomId}`, token);
}
