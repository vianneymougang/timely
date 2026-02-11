# Guide d'Installation - Environnement de Développement Windows

## 📋 Vue d'ensemble

Ce guide détaille l'installation de toutes les dépendances nécessaires pour lancer les microservices Timely en local sur Windows **sans Docker**.

---

## 🔧 Prérequis

- **Windows 10/11**
- **Droits administrateur**
- **Java 21** ([Adoptium Temurin](https://adoptium.net/temurin/releases/?version=21))
- **Maven 3.9+** ([Apache Maven](https://maven.apache.org/download.cgi))

---

## 📦 Dépendances à installer

### 1. PostgreSQL

**Usage** : Base de données pour 8 microservices (tous sauf notification-service)

**Installation** :
1. Télécharger [PostgreSQL 16+ pour Windows](https://www.postgresql.org/download/windows/)
2. Lancer l'installeur, configurer :
   - Port : **5432** (défaut)
   - Mot de passe superutilisateur : `postgres`
3. Créer les bases de données :

```sql
-- Ouvrir pgAdmin ou psql
CREATE DATABASE "auth-service-db";
CREATE DATABASE "user-service-db";
CREATE DATABASE "booking-service-db";
CREATE DATABASE "planning-service-db";
CREATE DATABASE "agora-service-db";
CREATE DATABASE "report-service-db";

-- Créer l'utilisateur admin
CREATE USER admin WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE "auth-service-db" TO admin;
GRANT ALL PRIVILEGES ON DATABASE "user-service-db" TO admin;
GRANT ALL PRIVILEGES ON DATABASE "booking-service-db" TO admin;
GRANT ALL PRIVILEGES ON DATABASE "planning-service-db" TO admin;
GRANT ALL PRIVILEGES ON DATABASE "agora-service-db" TO admin;
GRANT ALL PRIVILEGES ON DATABASE "report-service-db" TO admin;
```

**Configuration des ports (spécifique au projet)** :
Les services utilisent des ports PostgreSQL différents selon `application.yaml` :
- `auth-service` : `5432` (port par défaut)
- `user-service` : `5432` (port par défaut)
- `booking-service` : **5004** ⚠️ Port personnalisé
- `planning-service` : **5003** ⚠️ Port personnalisé
- `agora-service` : **5007** ⚠️ Port personnalisé
- `report-service` : **5006** ⚠️ Port personnalisé

**Option 1 : Modifier les configs pour utiliser le port 5432 partout (RECOMMANDÉ)**

Éditer `application.yaml` de chaque service et changer l'URL :
```yaml
datasource:
  url: jdbc:postgresql://localhost:5432/booking-service-db  # Au lieu de 5004
```

**Option 2 : Lancer plusieurs instances PostgreSQL (AVANCÉ)**

Utiliser PostgreSQL comme base mais tunneler les ports ou configurer plusieurs instances.

---

### 2. Redis

**Usage** : Cache et rate limiting pour 4 services (api-gateway, auth-service, booking-service, notification-service)

**Installation Option A - Memurai (RECOMMANDÉ)** :
1. Télécharger [Memurai Developer Edition](https://www.memurai.com/get-memurai) (gratuit)
2. Installer (MSI)
3. Redis démarre automatiquement comme service Windows
4. Port par défaut : **6379**

**Installation Option B - Redis Stack** :
1. Télécharger [Redis Stack pour Windows](https://redis.io/docs/getting-started/install-stack/windows/)
2. Inclut RedisInsight (interface graphique)

**Vérification** :
```powershell
# Ouvrir PowerShell ou CMD
redis-cli ping
# Réponse attendue : PONG
```

---

### 3. MongoDB

**Usage** : Base de données pour notification-service uniquement

**Installation** :
1. Télécharger [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Installer avec les options par défaut
3. Port : **27017** (défaut)

**Configuration** :
```javascript
// Ouvrir MongoDB Compass ou mongosh
use notification-service-db

db.createUser({
  user: "admin",
  pwd: "password",
  roles: [{ role: "readWrite", db: "notification-service-db" }]
})
```

---

### 4. RabbitMQ

**Usage** : Messaging asynchrone pour 6 services (auth, booking, planning, user, notification, report)

**Installation** :
1. **Installer Erlang d'abord** : [Erlang/OTP Windows](https://www.erlang.org/downloads)
2. **Installer RabbitMQ** : [RabbitMQ Windows Installer](https://www.rabbitmq.com/download.html)
3. Port par défaut : **5672** (AMQP), **15672** (Management UI)

**Activer le plugin Management** :
```powershell
# Ouvrir PowerShell en admin
rabbitmq-plugins enable rabbitmq_management
```

**Accéder à l'interface** :
- URL : http://localhost:15672
- Credentials : `admin` / `password` (à configurer après installation)

**Créer l'utilisateur admin** :
```powershell
rabbitmqctl add_user admin password
rabbitmqctl set_user_tags admin administrator
rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
```

---

### 5. Mailtrap (Service SMTP local)

**Usage** : Tester les emails sans envoi réel pour notification-service

**Option A - Mailtrap Desktop (RECOMMANDÉ)** :
1. Télécharger [Mailtrap Desktop](https://mailtrap.io/desktop/)
2. Interface graphique pour voir les emails capturés

**Option B - MailHog** :
1. Télécharger [MailHog Windows](https://github.com/mailhog/MailHog/releases)
2. Lancer `MailHog.exe`
3. Interface : http://localhost:8025
4. SMTP : localhost:1025

---

## 🚀 Ordre de démarrage des services

### 1. Infrastructure d'abord

```powershell
# S'assurer que tous les services sont lancés :
# - PostgreSQL (service Windows)
# - Redis/Memurai (service Windows)
# - MongoDB (service Windows)
# - RabbitMQ (service Windows)
# - Mailtrap/MailHog (application)
```

### 2. Services Spring Boot

**Ordre d'exécution (IMPORTANT)** :

```powershell
# 1. Config Server (port 8888)
cd services/config-server
mvn spring-boot:run

# 2. Discovery Server / Eureka (port 8761)
cd services/discovery-server
mvn spring-boot:run

# 3. API Gateway (port 8090)
cd services/api-gateway
mvn spring-boot:run

# 4. Microservices (ordre flexible)
cd services/auth-service
mvn spring-boot:run      # Port 8091

cd services/user-service
mvn spring-boot:run      # Port 8092

cd services/booking-service
mvn spring-boot:run      # Port 8094

cd services/planning-service
mvn spring-boot:run      # Port 8093

cd services/notification-service
mvn spring-boot:run      # Port 8095

cd services/report-service
mvn spring-boot:run      # Port 8096

cd services/agora-service
mvn spring-boot:run      # Port 8097
```

---

## ✅ Vérification du système

### Health Checks

```powershell
# Eureka Dashboard
http://localhost:8761

# API Gateway Health
http://localhost:8090/actuator/health

# Chaque service
http://localhost:8091/actuator/health  # auth-service
http://localhost:8092/actuator/health  # user-service
# ... etc
```

### RabbitMQ Exchanges

Vérifier que les exchanges sont créés : http://localhost:15672/#/exchanges

Attendus :
- `timely.notifications`
- `timely.user.events`
- `timely.planning.events`

---

## 🐛 Troubleshooting

### Problème : "Connection refused" Redis

**Solution** :
```powershell
# Vérifier que Redis tourne
redis-cli ping

# Si pas de réponse, redémarrer le service
net stop Memurai
net start Memurai
```

### Problème : "Database does not exist"

**Solution** :
Créer les bases manuellement (voir section PostgreSQL ci-dessus)

### Problème : Port déjà utilisé

**Solution** :
```powershell
# Trouver le processus utilisant le port (ex: 8091)
netstat -ano | findstr :8091

# Tuer le processus (remplacer PID)
taskkill /PID <PID> /F
```

### Problème : Services ne se registrent pas dans Eureka

**Vérifier** :
1. Config Server est bien lancé (`localhost:8888`)
2. Discovery Server est lancé (`localhost:8761`)
3. Pas de firewall bloquant les ports
4. Vérifier les logs : `Registered application AUTH-SERVICE with eureka`

---

## 📝 Variables d'environnement (optionnel)

Créer un fichier `.env` ou configurer dans le système :

```bash
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# RabbitMQ
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USERNAME=admin
RABBITMQ_PASSWORD=password

# JWT
JWT_SECRET=mySecretKeyForJWTTokenGenerationThisShouldBeAtLeast256BitsLongForHS256Algorithm
```

**Utilisation** :
```powershell
# Windows PowerShell
$env:REDIS_HOST="localhost"
$env:RABBITMQ_HOST="localhost"

# Puis lancer le service
mvn spring-boot:run
```

---

## 🎯 Configuration complétée

✅ **Redis** : Configuration ajoutée dans tous les services concernés
✅ **RabbitMQ** : Configuration ajoutée dans auth, booking, planning, user, report services
✅ **Variables d'environnement** : Utilisation de fallbacks (`${VAR:default}`)

Les configurations utilisent maintenant des variables d'environnement avec valeurs par défaut adaptées au développement local.

---

## 📞 Support

En cas de problème persistant, vérifier :
1. Les logs de chaque service pour les erreurs de connexion
2. Que tous les services infrastructure sont lancés (PostgreSQL, Redis, MongoDB, RabbitMQ)
3. Les ports ne sont pas bloqués par le firewall Windows

**Logs utiles** :
```powershell
# Voir les logs détaillés
mvn spring-boot:run -Dspring-boot.run.arguments="--logging.level.com.timely=DEBUG"
```
