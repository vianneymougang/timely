# Plan de mise en production — Timely sur AWS EC2

> Référence de travail à suivre étape par étape. Chaque phase est autonome et peut être validée avant de passer à la suivante.

---

## Vue d'ensemble

```
Internet (HTTPS 443)
        │
    ┌───▼────────────────────────────────┐
    │  EC2 — Nginx (reverse proxy + SSL) │
    │                                    │
    │  /          → Angular dist/        │
    │  /api/*     → API Gateway :8090    │
    └────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   Config Server  Discovery     Services
     :8888         :8761       (internes)
```

**Stack déployée :** 9 microservices Spring Boot, 6 PostgreSQL, 1 MongoDB, Redis, RabbitMQ, Angular (statique via Nginx)

---

## Phase 0 — Prérequis avant de toucher l'infra

### 0.1 Code

- [ ] Merger `feature/ui-redesign` → `main` et créer le tag `v1.0.0`
- [ ] Vérifier que `src/environments/environment.prod.ts` existe dans le frontend et pointe vers la bonne URL `/api` (chemin relatif, ou URL absolue du domaine)
- [ ] S'assurer qu'aucun secret (JWT_SECRET, mot de passe DB) n'est commité en clair dans le repo
- [ ] Retirer les `console.error` et `console.log` de debug du code Spring (ou configurer le niveau de log en `WARN` en prod)

### 0.2 Noms de domaine

- [ ] Avoir un nom de domaine pointant vers l'IP de l'EC2 (enregistrement A ou via Route 53)
- [ ] Le domaine doit être résolu avant de configurer Let's Encrypt

### 0.3 Génération des secrets

Générer des secrets forts avant le déploiement et les garder dans un endroit sûr (gestionnaire de mots de passe) :

```bash
# JWT secret (256 bits minimum)
openssl rand -base64 64

# DB password
openssl rand -base64 32

# RabbitMQ password
openssl rand -base64 32
```

---

## Phase 1 — Provisioning AWS

### 1.1 Instance EC2

| Paramètre | Recommandation |
|---|---|
| Type | `t3.xlarge` (4 vCPU, 16 GB) — minimum viable. `t3.2xlarge` si trafic réel attendu |
| OS | Ubuntu Server 24.04 LTS |
| Stockage root | 30 GB gp3 (OS + Docker layers) |
| Stockage données | Volume EBS séparé, 50 GB gp3, monté sur `/data` |
| Elastic IP | Oui — associer une IP fixe à l'instance |
| Région | `eu-west-3` (Paris) si les utilisateurs sont en France |

> **Pourquoi un volume EBS séparé ?** Les données PostgreSQL et MongoDB seront sur `/data`, découplées du volume root. En cas de remplacement d'instance, on re-attache le volume sans perdre les données.

### 1.2 Security Groups

Créer un Security Group `timely-prod-sg` avec ces règles **uniquement** :

| Type | Protocole | Port | Source | Usage |
|---|---|---|---|---|
| SSH | TCP | 22 | Ton IP fixe uniquement | Administration |
| HTTP | TCP | 80 | 0.0.0.0/0 | Redirect vers HTTPS |
| HTTPS | TCP | 443 | 0.0.0.0/0 | Trafic public |

**Tous les autres ports (8090, 8761, 8888, 5432, 27017, 6379, 5672, 15672) restent fermés.** Ils ne communiquent qu'en interne via le réseau Docker.

### 1.3 IAM

Créer un utilisateur IAM `timely-deploy` avec uniquement les permissions nécessaires (pas de root access). Si tu utilises ECR pour stocker les images Docker, ajouter la policy `AmazonEC2ContainerRegistryReadOnly`.

---

## Phase 2 — Préparation du serveur

Se connecter en SSH et exécuter dans cet ordre.

### 2.1 Système de base

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl unzip nginx certbot python3-certbot-nginx
```

### 2.2 Docker

```bash
curl -fsSL https://get.docker.com | sudo bash
sudo usermod -aG docker $USER
# Se déconnecter / reconnecter pour que le groupe prenne effet
```

### 2.3 Montage du volume EBS

```bash
# Trouver le nom du device (ex: /dev/xvdf ou /dev/nvme1n1)
lsblk

# Formater (une seule fois, à la création du volume)
sudo mkfs.ext4 /dev/xvdf

# Créer le point de montage et monter
sudo mkdir -p /data
sudo mount /dev/xvdf /data
sudo chown -R $USER:$USER /data

# Montage permanent (éditer /etc/fstab)
echo "/dev/xvdf /data ext4 defaults,nofail 0 2" | sudo tee -a /etc/fstab
```

### 2.4 Structure des répertoires

```bash
mkdir -p /data/postgres/{auth,user,planning,booking,report,agora}
mkdir -p /data/mongo
mkdir -p /data/redis
mkdir -p /data/rabbitmq
mkdir -p /opt/timely
```

---

## Phase 3 — Configuration Docker pour la production

### 3.1 Cloner le repo

```bash
cd /opt/timely
git clone <url-du-repo> .
git checkout main
```

### 3.2 Fichier `.env` de production

Créer `/opt/timely/.env` (ne jamais committer ce fichier) :

```bash
# Secrets — utiliser les valeurs générées en Phase 0.3
JWT_SECRET=<valeur-générée>
DB_PASSWORD=<valeur-générée>
RABBITMQ_PASSWORD=<valeur-générée>

# SMTP production (exemple AWS SES)
MAIL_HOST=email-smtp.eu-west-1.amazonaws.com
MAIL_PORT=587
MAIL_USERNAME=<clé-SES>
MAIL_PASSWORD=<secret-SES>
MAIL_FROM=noreply@ton-domaine.com

# Domaine public
APP_DOMAIN=https://ton-domaine.com
```

### 3.3 Créer `docker-compose.prod.yml`

Ce fichier **override** le `docker-compose.yml` de base. Il retire les outils dev et adapte les volumes.

```yaml
# docker-compose.prod.yml
# Usage: docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

services:

  # ── Suppression des outils de développement ──────────────────────────────
  pgadmin:
    profiles: ["dev-only"]   # jamais démarré en prod

  mongo-express:
    profiles: ["dev-only"]

  mailtrap:
    profiles: ["dev-only"]

  # ── Volumes sur EBS séparé ────────────────────────────────────────────────
  auth-service-db:
    volumes:
      - /data/postgres/auth:/var/lib/postgresql/data
    ports: []   # supprimer l'exposition externe du port

  user-service-db:
    volumes:
      - /data/postgres/user:/var/lib/postgresql/data
    ports: []

  planning-service-db:
    volumes:
      - /data/postgres/planning:/var/lib/postgresql/data
    ports: []

  booking-service-db:
    volumes:
      - /data/postgres/booking:/var/lib/postgresql/data
    ports: []

  report-service-db:
    volumes:
      - /data/postgres/report:/var/lib/postgresql/data
    ports: []

  agora-service-db:
    volumes:
      - /data/postgres/agora:/var/lib/postgresql/data
    ports: []

  timely_ms_mongo_db:
    volumes:
      - /data/mongo:/data/db
    ports: []

  timely_ms_redis:
    volumes:
      - /data/redis:/data
    ports: []

  timely_ms_rabbitmq:
    volumes:
      - /data/rabbitmq:/var/lib/rabbitmq
    ports: []    # management UI :15672 non exposé publiquement

  # ── Config SMTP production pour notification-service ─────────────────────
  notification-service:
    environment:
      - SPRING_MAIL_HOST=${MAIL_HOST}
      - SPRING_MAIL_PORT=${MAIL_PORT}
      - SPRING_MAIL_USERNAME=${MAIL_USERNAME}
      - SPRING_MAIL_PASSWORD=${MAIL_PASSWORD}
      - SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH=true
      - SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE=true

  # ── API Gateway — ne plus exposer 8090 directement ───────────────────────
  # (Nginx fera le proxy depuis 443 vers 8090 en interne)
  api-gateway:
    ports:
      - "127.0.0.1:8090:8090"   # écoute uniquement en loopback
```

### 3.4 Build des images

Les images sont buildées depuis les sources sur le serveur. Pour un serveur de taille `xlarge`, c'est faisable mais lent (les JVM compilent en parallèle).

```bash
cd /opt/timely
docker compose -f docker-compose.yml -f docker-compose.prod.yml build --parallel
```

> **Alternative plus robuste (à terme) :** builder les images en CI (GitHub Actions) et les pousser sur Amazon ECR. Le serveur ne fait que `docker pull`. Voir Phase 8.

---

## Phase 4 — Build du frontend Angular

```bash
cd /opt/timely/timely-frontend

# Vérifier que environment.prod.ts pointe vers /api (chemin relatif)
# → l'API Gateway sera accessible depuis le même domaine via Nginx

npm install --legacy-peer-deps  # ou: bun install
npx ng build --configuration=production

# Le résultat est dans dist/timely-frontend/browser/
```

---

## Phase 5 — Configuration Nginx

### 5.1 Fichier de configuration

Créer `/etc/nginx/sites-available/timely` :

```nginx
server {
    listen 80;
    server_name ton-domaine.com www.ton-domaine.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ton-domaine.com www.ton-domaine.com;

    ssl_certificate /etc/letsencrypt/live/ton-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ton-domaine.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Frontend Angular (fichiers statiques)
    root /opt/timely/timely-frontend/dist/timely-frontend/browser;
    index index.html;

    # SPA fallback — toutes les routes Angular
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy vers l'API Gateway
    location /api/ {
        proxy_pass http://127.0.0.1:8090/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 10s;
    }

    # Sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
    gzip_min_length 1000;

    # Cache assets Angular (hachés par le build)
    location ~* \.(js|css|woff2?|ttf|eot|png|jpg|svg|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 5.2 Activer et tester

```bash
sudo ln -s /etc/nginx/sites-available/timely /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5.3 Certificat SSL (Let's Encrypt)

```bash
# Le domaine doit déjà pointer vers l'IP de l'EC2
sudo certbot --nginx -d ton-domaine.com -d www.ton-domaine.com

# Vérifier le renouvellement automatique
sudo certbot renew --dry-run
```

---

## Phase 6 — Premier démarrage

### 6.1 Lancer la stack

```bash
cd /opt/timely
docker compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env up -d
```

### 6.2 Vérifier le démarrage dans l'ordre

Les services démarrent séquentiellement grâce aux `depends_on` + `healthcheck`. Surveiller :

```bash
# Logs en direct de tous les services
docker compose logs -f

# État de santé de chaque conteneur
docker compose ps

# Vérifier spécifiquement l'ordre critique
docker compose logs config-server
docker compose logs discovery-server
docker compose logs api-gateway
```

Ordre de démarrage attendu :
1. Bases de données (PostgreSQL, MongoDB, Redis, RabbitMQ)
2. Config Server
3. Discovery Server (Eureka)
4. Tous les microservices en parallèle
5. API Gateway (en dernier, dépend de auth, user, planning)

### 6.3 Vérification de santé

```bash
# API Gateway accessible en local
curl http://127.0.0.1:8090/actuator/health

# Via Nginx (domaine public)
curl https://ton-domaine.com/api/actuator/health
```

---

## Phase 7 — Service systemd (redémarrage automatique)

Créer `/etc/systemd/system/timely.service` pour que la stack redémarre automatiquement au boot du serveur :

```ini
[Unit]
Description=Timely Application Stack
Requires=docker.service
After=docker.service network-online.target
Wants=network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/timely
ExecStart=/usr/bin/docker compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env up -d
ExecStop=/usr/bin/docker compose -f docker-compose.yml -f docker-compose.prod.yml down
TimeoutStartSec=300

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable timely
sudo systemctl start timely
```

---

## Phase 8 — Sauvegardes

### 8.1 Script de backup PostgreSQL

Créer `/opt/timely/scripts/backup.sh` :

```bash
#!/bin/bash
set -euo pipefail

BACKUP_DIR="/data/backups/$(date +%Y-%m-%d)"
mkdir -p "$BACKUP_DIR"

DATABASES=(auth-service-db user-service-db planning-service-db booking-service-db report-service-db agora-service-db)
CONTAINERS=(auth-service-db user-service-db planning-service-db booking-service-db report-service-db agora-service-db)

for i in "${!DATABASES[@]}"; do
  DB="${DATABASES[$i]}"
  CONTAINER="${CONTAINERS[$i]}"
  echo "Backup $DB..."
  docker exec "$CONTAINER" pg_dump -U admin "$DB" | gzip > "$BACKUP_DIR/$DB.sql.gz"
done

# MongoDB
echo "Backup MongoDB..."
docker exec timely_ms_mongo_db mongodump --archive | gzip > "$BACKUP_DIR/mongodb.archive.gz"

# Nettoyer les backups > 7 jours
find /data/backups -type d -mtime +7 -exec rm -rf {} + 2>/dev/null || true

echo "Backup terminé : $BACKUP_DIR"
```

```bash
chmod +x /opt/timely/scripts/backup.sh

# Planifier toutes les nuits à 2h
echo "0 2 * * * /opt/timely/scripts/backup.sh >> /var/log/timely-backup.log 2>&1" | sudo crontab -
```

> **Pour aller plus loin :** copier les backups vers S3 avec `aws s3 cp $BACKUP_DIR s3://ton-bucket-backups/timely/$(date +%Y-%m-%d)/`.

### 8.2 Snapshot EBS

Dans la console AWS, créer une policy de snapshot automatique sur le volume `/data` : snapshot quotidien, rétention 7 jours. C'est la solution la plus robuste contre une défaillance disque.

---

## Phase 9 — Procédure de mise à jour

Pour chaque future mise en production :

```bash
cd /opt/timely

# 1. Récupérer le code
git pull origin main

# 2. Rebuilder uniquement les images modifiées
docker compose -f docker-compose.yml -f docker-compose.prod.yml build --parallel

# 3. Rebuilder le frontend si nécessaire
cd timely-frontend && npx ng build --configuration=production && cd ..

# 4. Redémarrer les services avec zéro downtime possible
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --no-deps --build <service-name>

# Ou redémarrer toute la stack (avec quelques secondes de downtime)
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## Checklist finale avant go-live

### Infrastructure
- [ ] EC2 `t3.xlarge` ou supérieur provisionné
- [ ] Volume EBS `/data` monté et persistant
- [ ] Security Group : seulement ports 22, 80, 443
- [ ] Elastic IP associée

### Sécurité
- [ ] Fichier `.env` présent sur le serveur, absent du repo
- [ ] Secrets générés avec `openssl rand` (pas "changeme")
- [ ] pgAdmin, Mongo Express, Mailtrap absents de la stack prod
- [ ] Ports internes (8761, 8888, 5432, 27017...) non exposés publiquement
- [ ] API Gateway écoute sur `127.0.0.1:8090` uniquement
- [ ] SSH uniquement depuis ton IP (pas 0.0.0.0/0)

### Application
- [ ] Branche `main` à jour, tag de version créé
- [ ] Angular buildé en `--configuration=production`
- [ ] `environment.prod.ts` pointe vers les bonnes URLs
- [ ] SMTP production configuré (pas Mailtrap)
- [ ] Certificat SSL valide (Let's Encrypt)
- [ ] Nginx redirige HTTP → HTTPS

### Exploitation
- [ ] Service systemd configuré (redémarrage au boot)
- [ ] Script de backup PostgreSQL + MongoDB en cron
- [ ] Snapshot EBS planifié
- [ ] Renouvellement Let's Encrypt automatique vérifié (`certbot renew --dry-run`)

---

## Pour aller plus loin (V2)

Ces points ne bloquent pas le lancement mais améliorent la robustesse à terme :

- **CI/CD** : GitHub Actions qui build les images et les pousse sur Amazon ECR au merge sur `main`. Le serveur ne fait que `docker pull + up`.
- **RDS PostgreSQL** : remplacer les PostgreSQL containerisés par RDS (backups gérés, failover, pas de gestion du volume). Coût supplémentaire mais tranquillité d'esprit.
- **Monitoring** : CloudWatch Agent pour les métriques EC2 + Spring Boot Actuator `/metrics` exposé vers un collecteur interne (Prometheus + Grafana en local, ou CloudWatch).
- **Secrets Manager** : AWS Secrets Manager à la place du fichier `.env` — les services récupèrent leurs secrets via l'API AWS au démarrage.
- **Plusieurs instances** : si le trafic croît, séparer les bases de données sur une instance dédiée, et l'API + services sur une autre.
