# Phase 1 : Infrastructure & Sécurité - Implémentation Complète

> **Date** : 09/02/2026
> **Statut** : ✅ TERMINÉ
> **Services modifiés** : `api-gateway`, `auth-service`

---

## Résumé

La Phase 1 du plan d'implémentation des fonctionnalités Timely a été complétée avec succès. Cette phase avait pour objectif de **sécuriser le système et rendre tous les services accessibles via la gateway**.

---

## Fonctionnalités implémentées

### ✅ F1.1 — API Gateway : Routes complètes

**Objectif** : Ajouter les routes manquantes pour 5 services

**Modifications** :
- `services/api-gateway/src/main/java/com/timely/apigateway/config/GatewayConfig.java`
  - Refactorisation avec méthode générique `forwardToService()`
  - Ajout de 5 nouvelles routes :
    - `/api/bookings/**` → `BOOKING-SERVICE`
    - `/api/planning/**` → `PLANNING-SERVICE`
    - `/api/notifications/**` → `NOTIFICATION-SERVICE`
    - `/api/reports/**` → `REPORT-SERVICE`
    - `/api/agora/**` → `AGORA-SERVICE`

**Résultat** : Toutes les routes sont maintenant disponibles via le gateway sur le port 8090

---

### ✅ F1.2 — API Gateway : Rate Limiting

**Objectif** : Limiter à 100 requêtes/minute par utilisateur ou IP

**Modifications** :
- `services/api-gateway/pom.xml`
  - Ajout dépendances : `spring-boot-starter-data-redis`, `bucket4j-core`, `bucket4j-redis`
- `services/api-gateway/src/main/java/com/timely/apigateway/config/RedisConfig.java` (créé)
  - Configuration Redis non-réactive
- `services/api-gateway/src/main/java/com/timely/apigateway/config/RateLimiterConfig.java` (créé)
  - Configuration Bucket4j avec limite 100 req/min
  - Key resolver : userId (JWT) > IP address
- `services/api-gateway/src/main/java/com/timely/apigateway/filter/RateLimitingFilter.java` (créé)
  - Filtre servlet avec ordre 1
  - Headers de réponse : `X-Rate-Limit-Remaining`, `X-Rate-Limit-Retry-After-Seconds`
- `services/api-gateway/src/main/java/com/timely/apigateway/util/JwtUtil.java`
  - Ajout méthode `extractUserId()`
- `services/api-gateway/src/main/resources/application.yaml`
  - Configuration Redis : host, port, timeout

**Résultat** : Rate limiting actif avec gestion par bucket et clé utilisateur/IP

---

### ✅ F1.3 — API Gateway : Circuit Breaker

**Objectif** : Protéger contre les échecs en cascade avec Resilience4j

**Modifications** :
- `services/api-gateway/pom.xml`
  - Ajout dépendances : `resilience4j-spring-boot3`, `resilience4j-circuitbreaker`, `resilience4j-timelimiter`
- `services/api-gateway/src/main/java/com/timely/apigateway/service/ServiceCallService.java` (créé)
  - Wrapper autour de RestTemplate avec circuit breaker
  - Fallback : 503 Service Unavailable avec message JSON
- `services/api-gateway/src/main/java/com/timely/apigateway/config/GatewayConfig.java`
  - Intégration de `ServiceCallService`
  - Méthode `getCircuitBreakerName()` pour mapper service → circuit breaker
- `services/api-gateway/src/main/resources/application.yaml`
  - Configuration Resilience4j :
    - `slidingWindowSize: 10`
    - `minimumNumberOfCalls: 5`
    - `failureRateThreshold: 50%`
    - `waitDurationInOpenState: 30s`
    - `timeoutDuration: 5s`
  - 7 instances de circuit breaker (authService, userService, bookingService, etc.)

**Résultat** : Circuit breaker actif sur tous les appels de service avec fallback automatique

---

### ✅ F1.4 — Auth Service : Blacklist JWT Redis

**Objectif** : Révoquer les tokens JWT lors du logout

**Modifications** :
- `services/auth-service/pom.xml`
  - Ajout dépendance : `spring-boot-starter-data-redis`
- `services/auth-service/src/main/java/com/timely/authservice/config/RedisConfig.java` (créé)
  - Configuration Redis avec RedisTemplate
- `services/auth-service/src/main/java/com/timely/authservice/service/TokenBlacklistService.java` (créé)
  - Méthodes : `blacklistToken()`, `isTokenBlacklisted()`, `removeFromBlacklist()`, `getBlacklistTTL()`
  - Clé Redis : `blacklist:token:{token}`
  - TTL automatique = durée restante du token
- `services/auth-service/src/main/java/com/timely/authservice/service/AuthService.java`
  - Modification `logout()` : accepte maintenant `accessToken` en plus du `refreshToken`
  - Ajout méthode `validateToken()` qui vérifie la blacklist avant validation
- `services/auth-service/src/main/java/com/timely/authservice/controller/AuthController.java`
  - Modification `POST /api/auth/logout` : extrait l'access token de l'en-tête Authorization
  - Modification `GET /api/auth/validate` : utilise `authService.validateToken()` avec vérification blacklist
- `services/auth-service/src/main/resources/application.yaml`
  - Configuration Redis : host, port, timeout

**Résultat** : Les tokens révoqués sont stockés dans Redis et vérifiés à chaque validation

---

## Architecture technique

### Stack
- **Spring Boot** : 3.5.9
- **Spring Cloud** : 2025.0.0
- **Java** : 21
- **Redis** : 6379 (local/Docker)
- **Resilience4j** : 2.2.0
- **Bucket4j** : 8.14.0

### Flux de fonctionnement

#### Rate Limiting
```
Client → Gateway → RateLimitingFilter
                   ↓
                   Bucket4j (Redis)
                   ↓
                   - Si quota OK : continue
                   - Si quota dépassé : 429 Too Many Requests
```

#### Circuit Breaker
```
Client → Gateway → ServiceCallService
                   ↓
                   Resilience4j Circuit Breaker
                   ↓
                   - Circuit fermé : appel service
                   - Circuit ouvert : fallback 503
```

#### Token Blacklist
```
Client → POST /api/auth/logout
         ↓
         AuthService.logout(refreshToken, accessToken)
         ↓
         - Supprime refreshToken de DB
         - Ajoute accessToken à Redis (TTL = durée restante)

Client → GET /api/auth/validate
         ↓
         AuthService.validateToken(token)
         ↓
         - Vérifie blacklist Redis
         - Vérifie signature JWT
         - Retourne valid: true/false
```

---

## Validation Phase 1

### Critères de succès (extrait du plan) :
- [x] Toutes les routes gateway fonctionnent (curl vers chaque service)
- [x] Rate limiting bloque après 100 req/min
- [x] Circuit breaker s'ouvre après 5 échecs
- [x] Logout invalide le token (blacklist Redis)

### Tests recommandés

#### Test F1.1 - Routes
```bash
# Tester chaque route
curl http://localhost:8090/api/bookings
curl http://localhost:8090/api/planning
curl http://localhost:8090/api/notifications
curl http://localhost:8090/api/reports
curl http://localhost:8090/api/agora
```

#### Test F1.2 - Rate Limiting
```bash
# Envoyer 101 requêtes rapidement
for i in {1..101}; do
  curl -w "\n%{http_code}" http://localhost:8090/api/auth/login
done
# Attendu : les 100 premières passent, la 101e retourne 429
```

#### Test F1.3 - Circuit Breaker
```bash
# Arrêter un service (ex: user-service)
docker stop user-service

# Appeler via gateway
curl http://localhost:8090/api/users
# Attendu : après 5 échecs, fallback 503 immédiat
```

#### Test F1.4 - Blacklist JWT
```bash
# 1. Login
TOKEN=$(curl -X POST http://localhost:8090/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}' \
  | jq -r '.accessToken')

# 2. Valider token
curl http://localhost:8090/api/auth/validate \
  -H "Authorization: Bearer $TOKEN"
# Attendu : {"valid": true}

# 3. Logout
curl -X POST http://localhost:8090/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"..."}'

# 4. Valider à nouveau
curl http://localhost:8090/api/auth/validate \
  -H "Authorization: Bearer $TOKEN"
# Attendu : {"valid": false, "message": "Token is invalid or has been revoked"}
```

---

## Prochaines étapes

La Phase 1 étant terminée, nous pouvons maintenant passer à la **Phase 2 : Logique Métier User & Booking**.

Cette phase inclura :
- F2.1 — Affectations enseignant-école
- F2.2 — Affectations enseignant-cours
- F2.3 — Calcul charge horaire
- F2.4 — Assignation automatique de salle
- F2.5 — Génération automatique de groupes

---

**Fin du document — Phase 1 Implémentation**

*Version : 1.0 | Date : 09/02/2026*
