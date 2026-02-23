# 🚀 Démarrage Rapide - Développement Local Windows

**Guide express pour démarrer le projet Timely sur Windows sans Docker**

---

## ⏱️ Temps estimé : 30-45 minutes

---

## 📋 Checklist d'installation

### Étape 1 : Installer les dépendances (20-30 min)

Suivre le guide complet : [docs/GUIDE-INSTALLATION-WINDOWS.md](docs/GUIDE-INSTALLATION-WINDOWS.md)

**Installations requises** :

- [ ] **Java 21** (Adoptium Temurin)
- [ ] **Maven 3.9+**
- [ ] **Redis** (Memurai ou Redis Stack)
- [ ] **PostgreSQL 16+**
- [ ] **MongoDB Community**
- [ ] **RabbitMQ** (avec Erlang)
- [ ] **Mailtrap Desktop** ou MailHog

---

### Étape 2 : Configurer PostgreSQL (5 min)

Ouvrir **pgAdmin** et exécuter :

```sql
-- Créer les bases de données
CREATE DATABASE "auth-service-db";
CREATE DATABASE "user-service-db";
CREATE DATABASE "booking-service-db";
CREATE DATABASE "planning-service-db";
CREATE DATABASE "agora-service-db";
CREATE DATABASE "report-service-db";

-- Créer l'utilisateur
CREATE USER admin WITH PASSWORD 'password';

-- Donner les permissions
GRANT ALL PRIVILEGES ON DATABASE "auth-service-db" TO admin;
GRANT ALL PRIVILEGES ON DATABASE "user-service-db" TO admin;
GRANT ALL PRIVILEGES ON DATABASE "booking-service-db" TO admin;
GRANT ALL PRIVILEGES ON DATABASE "planning-service-db" TO admin;
GRANT ALL PRIVILEGES ON DATABASE "agora-service-db" TO admin;
GRANT ALL PRIVILEGES ON DATABASE "report-service-db" TO admin;
```

---

### Étape 3 : Configurer MongoDB (2 min)

Ouvrir **MongoDB Compass** ou `mongosh` et exécuter :

```javascript
use notification-service-db

db.createUser({
  user: "admin",
  pwd: "password",
  roles: [{ role: "readWrite", db: "notification-service-db" }]
})
```

---

### Étape 4 : Configurer RabbitMQ (2 min)

Ouvrir **PowerShell en administrateur** :

```powershell
# Activer le plugin de management
rabbitmq-plugins enable rabbitmq_management

# Créer l'utilisateur admin
rabbitmqctl add_user admin password
rabbitmqctl set_user_tags admin administrator
rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
```

Vérifier : http://localhost:15672 (admin/password)

---

### Étape 5 : Vérifier les services infrastructure (2 min)

Ouvrir **PowerShell** dans le dossier du projet :

```powershell
.\scripts\check-services-windows.ps1
```

**Attendu** : Tous les services infrastructure (Redis, PostgreSQL, MongoDB, RabbitMQ) doivent être **✓ OK** (en vert).

---

### Étape 6 : Démarrer les microservices (5 min)

#### Option A : Script automatique (RECOMMANDÉ)

```powershell
.\scripts\start-services-windows.ps1
```

Le script démarre automatiquement tous les services dans le bon ordre.

#### Option B : Démarrage manuel

```powershell
# 1. Config Server
cd services/config-server
mvn spring-boot:run

# 2. Discovery Server (nouvelle fenêtre PowerShell)
cd services/discovery-server
mvn spring-boot:run

# 3. API Gateway (nouvelle fenêtre)
cd services/api-gateway
mvn spring-boot:run

# 4. Services métier (nouvelles fenêtres)
cd services/auth-service
mvn spring-boot:run
# ... répéter pour chaque service
```

---

### Étape 7 : Vérifier le démarrage (2 min)

#### Méthode 1 : Script de vérification

```powershell
.\scripts\check-services-windows.ps1
```

#### Méthode 2 : Dashboard Eureka

Ouvrir : http://localhost:8761

**Attendu** : Voir 7 services enregistrés :
- API-GATEWAY
- AUTH-SERVICE
- USER-SERVICE
- BOOKING-SERVICE
- PLANNING-SERVICE
- NOTIFICATION-SERVICE
- REPORT-SERVICE
- AGORA-SERVICE

#### Méthode 3 : Health checks

```powershell
# Tester un service
curl http://localhost:8091/actuator/health

# Devrait retourner : {"status":"UP"}
```

---

## ✅ Validation complète

### Tests fonctionnels

1. **Eureka** : http://localhost:8761 → Tous les services visibles
2. **RabbitMQ** : http://localhost:15672 → Exchanges créés
3. **API Gateway** : http://localhost:8090/actuator/health → UP

### Tester une API

```powershell
# Exemple : créer un compte
curl -X POST http://localhost:8090/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 🐛 Problèmes fréquents

### "Connection refused" pour Redis

```powershell
# Vérifier Redis
redis-cli ping

# Si erreur, redémarrer
net stop Memurai
net start Memurai
```

### "Port already in use"

```powershell
# Trouver le processus
netstat -ano | findstr :8091

# Tuer le processus (remplacer <PID>)
taskkill /PID <PID> /F
```

### Service ne démarre pas

1. Regarder les logs dans la fenêtre PowerShell
2. Vérifier que les dépendances (Redis, RabbitMQ) sont lancées
3. Vérifier le fichier `application.yaml` du service

### Services ne s'enregistrent pas dans Eureka

1. Vérifier que **config-server** est bien lancé
2. Vérifier que **discovery-server** est bien lancé
3. Attendre 30-60 secondes (enregistrement peut être lent)
4. Vérifier les logs : chercher "Registered application"

---

## 🔗 URLs importantes

| Service | URL | Credentials |
|---------|-----|-------------|
| **Eureka Dashboard** | http://localhost:8761 | - |
| **API Gateway** | http://localhost:8090 | - |
| **RabbitMQ Management** | http://localhost:15672 | admin / password |
| **Mailtrap UI** | http://localhost:1080 | - |

---

## 📚 Documentation complète

- **Guide d'installation détaillé** : [docs/GUIDE-INSTALLATION-WINDOWS.md](docs/GUIDE-INSTALLATION-WINDOWS.md)
- **Corrections effectuées** : [docs/CORRECTIONS-CONFIG-LOCAL.md](docs/CORRECTIONS-CONFIG-LOCAL.md)
- **Scripts PowerShell** : [scripts/README.md](scripts/README.md)

---

## 🎯 Workflow de développement

### Démarrer le projet

```powershell
# Démarrer tous les services
.\scripts\start-services-windows.ps1
```

### Vérifier l'état

```powershell
# Vérifier que tout fonctionne
.\scripts\check-services-windows.ps1
```

### Travailler sur un service

```powershell
# Arrêter le service (fermer sa fenêtre PowerShell)
# Modifier le code
# Relancer le service
cd services/auth-service
mvn spring-boot:run
```

### Arrêter le projet

Fermer toutes les fenêtres PowerShell ouvertes par le script.

---

## 💡 Conseils

### Mode développement rapide

Si vous travaillez sur **un seul service**, pas besoin de lancer TOUS les services :

**Minimum** : config-server + discovery-server + api-gateway + votre service

### Logs et debugging

```powershell
# Activer les logs DEBUG
mvn spring-boot:run -Dspring-boot.run.arguments="--logging.level.com.timely=DEBUG"
```

### Hot reload

Utiliser **Spring DevTools** pour le rechargement automatique :
- Déjà configuré dans les `pom.xml`
- Modifier le code → Sauvegarde → Rechargement automatique

---

## 🆘 Besoin d'aide ?

1. Consulter [docs/GUIDE-INSTALLATION-WINDOWS.md](docs/GUIDE-INSTALLATION-WINDOWS.md)
2. Vérifier les logs des services
3. Utiliser `check-services-windows.ps1` pour diagnostiquer
4. Contacter l'équipe

---

## ✨ Prochaines étapes

Une fois l'environnement opérationnel :

1. **Explorer l'API** : Consulter la documentation Swagger (si configurée)
2. **Tester les fonctionnalités** : Créer des utilisateurs, gérer les plannings, etc.
3. **Développer** : Ajouter de nouvelles fonctionnalités
4. **Tester** : Lancer les tests unitaires et d'intégration

---

**Bon développement ! 🚀**
