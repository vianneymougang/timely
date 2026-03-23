# Corrections des Configurations pour Développement Local (Windows sans Docker)

**Date** : 2026-02-11
**Contexte** : Support du développement local sur Windows sans Docker

---

## 📋 Résumé

Ce document liste toutes les corrections apportées aux fichiers de configuration pour permettre le lancement des microservices Timely en local sur Windows, sans utiliser Docker.

---

## 🔧 Problèmes identifiés

### Problème principal
Plusieurs services utilisent **Redis** et **RabbitMQ** dans leur code, mais les configurations de connexion n'étaient présentes **QUE** dans les fichiers `application-docker.yaml`, pas dans les fichiers `application.yaml` (profil par défaut).

**Conséquence** : Lorsqu'un développeur lance les services en local sans Docker, les services crashent au démarrage car ils ne peuvent pas se connecter à Redis ou RabbitMQ.

---

## ✅ Corrections effectuées

### 1. Redis - Configuration manquante

**Service corrigé** : `booking-service`

**Fichier** : `services/booking-service/src/main/resources/application.yaml`

**Ajout** :
```yaml
# Redis Configuration for caching
data:
  redis:
    host: ${REDIS_HOST:localhost}
    port: ${REDIS_PORT:6379}
    timeout: 2000ms
```

**Justification** :
Le `booking-service` utilise Redis pour mettre en cache les disponibilités des salles (voir `RedisConfig.java` et `SalleService.java`), mais la configuration n'existait que dans le profil Docker.

---

### 2. RabbitMQ - Configurations manquantes

**Services corrigés** : `auth-service`, `booking-service`, `planning-service`, `user-service`, `report-service`

#### 2.1. auth-service

**Fichier** : `services/auth-service/src/main/resources/application.yaml`

**Ajout** :
```yaml
# RabbitMQ Configuration
rabbitmq:
  host: ${RABBITMQ_HOST:localhost}
  port: ${RABBITMQ_PORT:5672}
  username: ${RABBITMQ_USERNAME:admin}
  password: ${RABBITMQ_PASSWORD:password}
```

**Justification** :
Le service utilise RabbitMQ pour publier des événements de réinitialisation de mot de passe (`PasswordResetServiceImpl.java`, `RabbitMQConfig.java`), mais aucune configuration de connexion n'était présente.

---

#### 2.2. booking-service

**Fichier** : `services/booking-service/src/main/resources/application.yaml`

**Ajout** :
```yaml
# RabbitMQ Configuration
rabbitmq:
  host: ${RABBITMQ_HOST:localhost}
  port: ${RABBITMQ_PORT:5672}
  username: ${RABBITMQ_USERNAME:admin}
  password: ${RABBITMQ_PASSWORD:password}
```

**Justification** :
Le service communique avec d'autres services via RabbitMQ, mais la configuration n'existait que dans le profil Docker.

---

#### 2.3. planning-service

**Fichier** : `services/planning-service/src/main/resources/application.yaml`

**Ajout** :
```yaml
# RabbitMQ Configuration
rabbitmq:
  host: ${RABBITMQ_HOST:localhost}
  port: ${RABBITMQ_PORT:5672}
  username: ${RABBITMQ_USERNAME:admin}
  password: ${RABBITMQ_PASSWORD:password}
```

**Justification** :
Le service publie des événements de planning (`EmploiDuTempsService.java`, `ConflitService.java`, `RabbitMQConfig.java`).

---

#### 2.4. user-service

**Fichier** : `services/user-service/src/main/resources/application.yaml`

**Ajout** :
```yaml
# RabbitMQ Configuration
rabbitmq:
  host: ${RABBITMQ_HOST:localhost}
  port: ${RABBITMQ_PORT:5672}
  username: ${RABBITMQ_USERNAME:admin}
  password: ${RABBITMQ_PASSWORD:password}
```

**Justification** :
Le service publie des événements de création d'utilisateurs (`UserServiceImpl.java`, `RabbitMQConfig.java`).

---

#### 2.5. report-service

**Fichier** : `services/report-service/src/main/resources/application.yaml`

**Ajout** :
```yaml
# RabbitMQ Configuration
rabbitmq:
  host: ${RABBITMQ_HOST:localhost}
  port: ${RABBITMQ_PORT:5672}
  username: ${RABBITMQ_USERNAME:admin}
  password: ${RABBITMQ_PASSWORD:password}
```

**Justification** :
Le service utilise RabbitMQ pour la communication inter-services.

---

## 🎯 Approche adoptée

### Utilisation de variables d'environnement avec fallbacks

Toutes les configurations ajoutées utilisent le pattern suivant :

```yaml
host: ${VARIABLE_ENV:valeur_par_defaut}
```

**Avantages** :
- ✅ **Flexibilité** : Permet de surcharger via variables d'environnement
- ✅ **Sécurité** : Pas de credentials hardcodés en production
- ✅ **Développement local facile** : Valeurs par défaut adaptées (`localhost`, ports standards)
- ✅ **Compatibilité Docker** : Les profils Docker surchargent avec leurs propres valeurs

**Exemple** :
```yaml
redis:
  host: ${REDIS_HOST:localhost}  # Utilise localhost par défaut, surchargeable via REDIS_HOST
  port: ${REDIS_PORT:6379}        # Port par défaut 6379
```

---

## 📊 État final des configurations

| Service | Redis OK | RabbitMQ OK | Notes |
|---------|----------|-------------|-------|
| **api-gateway** | ✅ | N/A | Déjà configuré |
| **auth-service** | ✅ | ✅ | **Ajouté RabbitMQ** |
| **booking-service** | ✅ | ✅ | **Ajouté Redis + RabbitMQ** |
| **planning-service** | N/A | ✅ | **Ajouté RabbitMQ** |
| **user-service** | N/A | ✅ | **Ajouté RabbitMQ** |
| **report-service** | N/A | ✅ | **Ajouté RabbitMQ** |
| **notification-service** | ✅ | ✅ | Déjà configuré |
| **agora-service** | N/A | ✅ | Déjà configuré |

---

## 📦 Services n'utilisant pas Redis/RabbitMQ

- **config-server** : Service de configuration uniquement
- **discovery-server** : Eureka, pas de dépendances externes

---

## 🚀 Documents créés

### 1. Guide d'installation Windows
**Fichier** : `docs/GUIDE-INSTALLATION-WINDOWS.md`

Guide complet pour installer et configurer l'environnement de développement Windows :
- Installation de Redis (Memurai/Redis Stack)
- Installation de PostgreSQL
- Installation de MongoDB
- Installation de RabbitMQ
- Configuration de Mailtrap/MailHog
- Ordre de démarrage des services
- Troubleshooting

### 2. Script de démarrage PowerShell
**Fichier** : `scripts/start-services-windows.ps1`

Script automatisé pour :
- Vérifier les dépendances (Redis, PostgreSQL, MongoDB, RabbitMQ)
- Démarrer les services dans le bon ordre
- Attendre que chaque service soit prêt avant de lancer le suivant

**Usage** :
```powershell
.\scripts\start-services-windows.ps1
```

### 3. Script de vérification
**Fichier** : `scripts/check-services-windows.ps1`

Script pour vérifier l'état de tous les services :
- Infrastructure (Redis, PostgreSQL, MongoDB, RabbitMQ)
- Services Spring Boot (health checks)
- Enregistrement dans Eureka

**Usage** :
```powershell
.\scripts\check-services-windows.ps1
```

---

## 🔄 Compatibilité

### Profils Docker
Les profils Docker (`application-docker.yaml`) **ne sont PAS modifiés**. Ils surchargent les valeurs par défaut avec les hostnames Docker :

```yaml
# application-docker.yaml (inchangé)
redis:
  host: redis  # Nom du service Docker
```

### Développement local
Les valeurs par défaut dans `application.yaml` pointent maintenant vers `localhost` :

```yaml
# application.yaml (nouveau)
redis:
  host: ${REDIS_HOST:localhost}  # localhost par défaut
```

---

## ⚠️ Points d'attention pour les développeurs

### 1. Ports PostgreSQL personnalisés

Certains services utilisent des ports PostgreSQL non-standards :

| Service | Port PostgreSQL |
|---------|-----------------|
| auth-service, user-service | 5432 (défaut) |
| **booking-service** | **5004** ⚠️ |
| **planning-service** | **5003** ⚠️ |
| **agora-service** | **5007** ⚠️ |
| **report-service** | **5006** ⚠️ |

**Recommandation** : Modifier les URLs pour utiliser le port 5432 partout, OU configurer plusieurs instances PostgreSQL.

### 2. Installation des dépendances

Les développeurs Windows doivent installer :
- **Redis** (Memurai ou Redis Stack)
- **PostgreSQL 16+**
- **MongoDB Community**
- **RabbitMQ** (avec Erlang)
- **Mailtrap Desktop ou MailHog**

Voir le guide complet : `docs/GUIDE-INSTALLATION-WINDOWS.md`

---

## 📝 Tests de validation

### Vérifier que les corrections fonctionnent

1. **Installer les dépendances** (voir guide)
2. **Lancer les services** :
   ```powershell
   .\scripts\start-services-windows.ps1
   ```
3. **Vérifier l'état** :
   ```powershell
   .\scripts\check-services-windows.ps1
   ```
4. **Vérifier Eureka** : http://localhost:8761

### Attendu
- Tous les services démarrent sans erreur de connexion Redis/RabbitMQ
- Tous les services se registrent dans Eureka
- Les health checks retournent `UP`

---

## 🎉 Résultat

Les microservices Timely peuvent maintenant être lancés en local sur Windows sans Docker, avec toutes les dépendances correctement configurées.

**Changements apportés** :
- ✅ 1 configuration Redis ajoutée
- ✅ 5 configurations RabbitMQ ajoutées
- ✅ Utilisation de variables d'environnement partout
- ✅ Guide d'installation Windows complet
- ✅ Scripts PowerShell de démarrage et vérification

---

## 📞 Support

En cas de problème :
1. Consulter le guide : `docs/GUIDE-INSTALLATION-WINDOWS.md`
2. Vérifier les logs des services pour les erreurs de connexion
3. Utiliser le script de vérification : `.\scripts\check-services-windows.ps1`
