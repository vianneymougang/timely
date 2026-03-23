# Scripts PowerShell - Timely

Scripts utilitaires pour faciliter le développement local sur Windows.

---

## 📜 Scripts disponibles

### 1. `start-services-windows.ps1`

**Usage** : Démarre tous les microservices Timely dans le bon ordre.

```powershell
.\start-services-windows.ps1
```

**Fonctionnalités** :
- ✅ Vérifie que les dépendances infrastructure sont lancées (Redis, PostgreSQL, MongoDB, RabbitMQ)
- ✅ Démarre les services dans l'ordre correct :
  1. Config Server (8888)
  2. Discovery Server / Eureka (8761)
  3. API Gateway (8090)
  4. Microservices (8091-8097)
- ✅ Ouvre une fenêtre PowerShell dédiée pour chaque service
- ✅ Attend entre chaque service pour garantir le démarrage complet

**Prérequis** :
- Toutes les dépendances doivent être installées (voir `docs/GUIDE-INSTALLATION-WINDOWS.md`)
- Les services infrastructure doivent être lancés (Redis, PostgreSQL, MongoDB, RabbitMQ)

**Temps d'exécution estimé** : ~3-5 minutes pour démarrer tous les services

---

### 2. `check-services-windows.ps1`

**Usage** : Vérifie l'état de tous les services.

```powershell
.\check-services-windows.ps1
```

**Fonctionnalités** :
- ✅ Teste la connectivité sur tous les ports
- ✅ Vérifie les health checks (`/actuator/health`)
- ✅ Liste les services enregistrés dans Eureka
- ✅ Affichage couleur (✓ vert = OK, ✗ rouge = DOWN)

**Exemples de sortie** :

```
=== INFRASTRUCTURE ===

[Redis] (port 6379)... ✓ OK
[PostgreSQL] (port 5432)... ✓ OK
[MongoDB] (port 27017)... ✓ OK
[RabbitMQ AMQP] (port 5672)... ✓ OK

=== SERVICES SPRING BOOT ===

[Config Server] (port 8888)... ✓ OK
  └─ Health: UP
[Discovery Server (Eureka)] (port 8761)... ✓ OK
  └─ Health: UP

=== ENREGISTREMENT EUREKA ===

Services enregistrés dans Eureka:
  ✓ API-GATEWAY (1 instance(s))
  ✓ AUTH-SERVICE (1 instance(s))
  ✓ USER-SERVICE (1 instance(s))
  ...
```

---

## 🔧 Configuration PowerShell

### Activer l'exécution de scripts

Si vous rencontrez une erreur de politique d'exécution :

```powershell
# Ouvrir PowerShell en administrateur
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Options** :
- `RemoteSigned` : Permet les scripts locaux, mais nécessite signature pour scripts téléchargés
- `Unrestricted` : Permet tous les scripts (moins sécurisé)
- `Bypass` : Aucune restriction (temporaire, pour une session)

### Exécution temporaire (sans modifier la politique)

```powershell
powershell -ExecutionPolicy Bypass -File .\start-services-windows.ps1
```

---

## 🐛 Troubleshooting

### Erreur : "Le terme 'Test-NetConnection' n'est pas reconnu"

**Cause** : Commande disponible uniquement sur Windows 8/Server 2012 et supérieur.

**Solution (alternative)** :
Modifier les scripts pour utiliser `Test-Connection` ou `telnet` à la place.

### Erreur : "Connection refused" lors de la vérification

**Cause** : Service non démarré ou port différent.

**Solutions** :
1. Vérifier que le service est bien lancé
2. Vérifier les logs du service pour erreurs
3. Vérifier la configuration du port dans `application.yaml`

### Les fenêtres PowerShell se ferment immédiatement

**Cause** : Erreur Maven ou service crashe au démarrage.

**Solution** :
Lancer le service manuellement pour voir l'erreur :
```powershell
cd services/auth-service
mvn spring-boot:run
```

### Script prend trop de temps

**Cause** : Temps d'attente entre services.

**Solution** :
Réduire les `WaitSeconds` dans le script si vos services démarrent plus rapidement :
```powershell
Start-Service-Background -ServiceName "Auth Service" -Port 8091 -WaitSeconds 10  # Au lieu de 20
```

---

## 📝 Personnalisation

### Modifier l'ordre de démarrage

Éditer `start-services-windows.ps1` et réorganiser les appels `Start-Service-Background`.

### Ajouter un nouveau service

```powershell
Start-Service-Background `
  -ServiceName "Mon Service" `
  -ServicePath "mon-service" `
  -Port 8098 `
  -WaitSeconds 20
```

### Désactiver un service

Commenter la ligne correspondante avec `#` :

```powershell
# Start-Service-Background -ServiceName "Agora Service" -ServicePath "agora-service" -Port 8097 -WaitSeconds 20
```

---

## 🔗 Ressources

- **Guide d'installation** : `docs/GUIDE-INSTALLATION-WINDOWS.md`
- **Corrections effectuées** : `docs/CORRECTIONS-CONFIG-LOCAL.md`

---

## 💡 Conseils

### Développement d'un seul service

Si vous travaillez sur un seul service, vous n'avez pas besoin de lancer TOUS les services :

**Minimum requis** :
1. Infrastructure (Redis, PostgreSQL, RabbitMQ, etc.)
2. Config Server
3. Discovery Server (Eureka)
4. API Gateway
5. Votre service

**Exemple (travailler sur auth-service)** :
```powershell
# Lancer uniquement l'infrastructure + les 3 services de base
cd services/config-server
mvn spring-boot:run

# Nouvelle fenêtre
cd services/discovery-server
mvn spring-boot:run

# Nouvelle fenêtre
cd services/api-gateway
mvn spring-boot:run

# Nouvelle fenêtre
cd services/auth-service
mvn spring-boot:run
```

### Arrêt propre des services

**Option 1** : Fermer les fenêtres PowerShell

**Option 2** : `Ctrl+C` dans chaque fenêtre

**Option 3** : Script d'arrêt (à créer) :
```powershell
# stop-services-windows.ps1
Get-Process | Where-Object { $_.MainWindowTitle -match "mvn spring-boot:run" } | Stop-Process -Force
```

---

## 📊 Monitoring

### Endpoints utiles

Après avoir lancé les services :

| Service | URL |
|---------|-----|
| **Eureka Dashboard** | http://localhost:8761 |
| **API Gateway Health** | http://localhost:8090/actuator/health |
| **RabbitMQ Management** | http://localhost:15672 (admin/password) |
| **Mailtrap Web UI** | http://localhost:1080 |

### Logs des services

Les logs s'affichent dans les fenêtres PowerShell de chaque service.

**Pour sauvegarder les logs** :
```powershell
mvn spring-boot:run > logs/auth-service.log 2>&1
```

---

## ✨ Améliorations futures

- [ ] Script d'arrêt automatique (`stop-services-windows.ps1`)
- [ ] Script de redémarrage d'un service spécifique
- [ ] Dashboard consolidé pour voir les logs de tous les services
- [ ] Détection automatique de l'ordre de démarrage basé sur les dépendances
- [ ] Mode "dev" pour lancer uniquement les services nécessaires

---

## 📞 Support

En cas de problème avec les scripts :
1. Vérifier que PowerShell est à jour (version 5.1+)
2. Consulter les logs des services dans les fenêtres ouvertes
3. Utiliser `check-services-windows.ps1` pour diagnostiquer
4. Consulter le guide d'installation complet

**Note** : Ces scripts sont conçus pour Windows. Pour Linux/macOS, utilisez Docker ou adaptez les scripts en Bash.
