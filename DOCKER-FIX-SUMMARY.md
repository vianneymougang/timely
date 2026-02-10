# Corrections Docker - Timely Microservices

## 🔧 Problème identifié

**Erreur**: `dependency failed to start: container timely-user-service is unhealthy`

### Causes racines

1. **Curl manquant** : Les images `eclipse-temurin:21-jre` ne contiennent pas `curl` par défaut
2. **Timeouts trop courts** : Les services Spring Boot prennent du temps à démarrer
3. **Dépendances circulaires** : `auth-service` → `user-service` → `api-gateway` → `discovery-server`
4. **Retries insuffisants** : Seulement 5 tentatives avec 10s d'intervalle

## ✅ Corrections appliquées

### 1. Installation de curl dans tous les Dockerfiles

**Fichiers modifiés** :
- `services/auth-service/Dockerfile`
- `services/user-service/Dockerfile`
- `services/api-gateway/Dockerfile`
- `services/config-server/Dockerfile`
- `services/discovery-server/Dockerfile`
- `services/notification-service/Dockerfile`

**Modification** :
```dockerfile
FROM eclipse-temurin:21-jre AS runner

# Installer curl pour le healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app
# ...
```

### 2. Amélioration des healthchecks

**Avant** :
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8092/actuator/health"]
  interval: 10s
  timeout: 5s
  retries: 5
```

**Après** :
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8092/actuator/health"]
  interval: 30s          # Augmenté de 10s à 30s
  timeout: 10s           # Augmenté de 5s à 10s
  retries: 10            # Augmenté de 5 à 10
  start_period: 60s      # Ajouté: période de grâce de 60s
```

### 3. Suppression des dépendances circulaires

**user-service** :
- ❌ Supprimé : dépendance sur `api-gateway`
- ✅ Conservé : `user-service-db`, `discovery-server`, `config-server`

**auth-service** :
- ❌ Supprimé : dépendance sur `api-gateway`
- ✅ Conservé : `auth-service-db`, `user-service`, `rabbitmq`, `discovery-server`, `config-server`

## 📊 Ordre de démarrage optimisé

```
1. Bases de données (PostgreSQL, MongoDB)
   ↓
2. RabbitMQ
   ↓
3. Config Server (8888)
   ↓
4. Discovery Server (8761)
   ↓
5. API Gateway (8090)
   ↓
6. User Service (8092)
   ↓
7. Auth Service (8091)
   ↓
8. Notification Service (8093)
```

## 🚀 Scripts de gestion

### Reconstruction complète
```bash
rebuild-docker-services.bat
```
- Arrête tous les conteneurs
- Supprime les anciennes images
- Reconstruit avec `--no-cache`
- Démarre les services
- Affiche l'état

### Surveillance des logs
```bash
watch-docker-logs.bat
```
- Menu interactif pour choisir le service
- Affichage en temps réel des logs

### Vérification de santé
```bash
check-docker-health.bat
```
- Vérifie l'état de tous les conteneurs
- Teste les endpoints `/actuator/health`
- Affiche les erreurs

## 🔍 Vérification manuelle

### Vérifier l'état des conteneurs
```bash
docker-compose ps
```

### Voir les logs d'un service
```bash
docker-compose logs -f user-service
```

### Redémarrer un service spécifique
```bash
docker-compose restart user-service
```

### Reconstruire un service spécifique
```bash
docker-compose build --no-cache user-service
docker-compose up -d user-service
```

## 🌐 URLs des services

| Service | URL | Description |
|---------|-----|-------------|
| Config Server | http://localhost:8888 | Configuration centralisée |
| Discovery Server | http://localhost:8761 | Eureka - Service registry |
| API Gateway | http://localhost:8090 | Point d'entrée principal |
| Auth Service | http://localhost:8091 | Authentification |
| User Service | http://localhost:8092 | Gestion des utilisateurs |
| Notification Service | http://localhost:8093 | Notifications |
| RabbitMQ Management | http://localhost:15672 | admin/password |
| PgAdmin | http://localhost:5050 | Gestion PostgreSQL |
| Mongo Express | http://localhost:8081 | Gestion MongoDB |
| Mailtrap | http://localhost:1080 | Test emails |

## ⏱️ Temps de démarrage estimés

- **Config Server** : ~30-40 secondes
- **Discovery Server** : ~40-50 secondes
- **API Gateway** : ~50-60 secondes
- **User Service** : ~60-90 secondes
- **Auth Service** : ~70-100 secondes
- **Notification Service** : ~60-80 secondes

**Total** : ~5-7 minutes pour un démarrage complet

## 🐛 Dépannage

### Si un service reste "unhealthy"

1. Vérifier les logs :
   ```bash
   docker-compose logs user-service
   ```

2. Vérifier si le port est accessible :
   ```bash
   curl http://localhost:8092/actuator/health
   ```

3. Redémarrer le service :
   ```bash
   docker-compose restart user-service
   ```

4. Si le problème persiste, reconstruire :
   ```bash
   docker-compose build --no-cache user-service
   docker-compose up -d user-service
   ```

### Erreurs communes

**"Connection refused"** : Le service n'a pas encore démarré, attendre plus longtemps

**"Flyway migration failed"** : Base de données non initialisée, vérifier les logs de PostgreSQL

**"Unable to connect to Eureka"** : Discovery Server pas encore prêt, attendre

**"Config server not found"** : Config Server pas encore prêt, attendre

## ✅ Validation finale

Après le démarrage complet, vérifier :

1. ✅ Tous les conteneurs sont "healthy" : `docker-compose ps`
2. ✅ Discovery Server affiche tous les services : http://localhost:8761
3. ✅ API Gateway répond : http://localhost:8090/actuator/health
4. ✅ User Service répond : http://localhost:8092/actuator/health
5. ✅ Auth Service répond : http://localhost:8091/actuator/health

## 📝 Notes importantes

- Les healthchecks ont maintenant une période de grâce de 60 secondes (`start_period`)
- Les services ont 10 tentatives au lieu de 5 pour devenir "healthy"
- L'intervalle entre les checks est de 30 secondes au lieu de 10
- Les dépendances circulaires ont été supprimées pour éviter les deadlocks
