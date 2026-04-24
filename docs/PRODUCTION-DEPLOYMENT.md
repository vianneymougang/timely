# Plan de mise en production — Timely sur AWS EC2 + Dokploy

> Référence de travail à suivre étape par étape. Domaine : **timely.yondrfit.com**

---

## Vue d'ensemble

```
git push → GitLab CI → registry.gitlab.com (images)
                                │
                         docker pull ↓
Internet (HTTPS 443)             │
        │               ┌────────▼────────────────────┐
    ┌───▼───────────┐   │  EC2 — Dokploy              │
    │  Traefik SSL  │   │                             │
    │               │   │  timely.yondrfit.com        │
    │  /      → frontend container (nginx)            │
    │  /api/* → api-gateway :8090 (interne)           │
    └───────────────┴─────────────────────────────────┘
```

**Stack déployée :** 9 microservices Spring Boot, 6 PostgreSQL, 1 MongoDB, Redis, RabbitMQ, Angular (container nginx routé par Traefik)
**Images buildées par :** GitLab CI → GitLab Container Registry

---

## Phase 0 — Prérequis ✅ Terminé

- [x] `feature/ui-redesign` mergée sur `main`, tag `v1.0.0` créé
- [x] `environment.prod.ts` pointe vers `/api` (chemin relatif)
- [x] Fallback `JWT_SECRET` supprimé — la variable est obligatoire au démarrage
- [x] Aucun secret commité en clair
- [x] `docker-compose.prod.yml` prêt avec labels Traefik + références registry GitLab
- [x] `.gitlab-ci.yml` prêt — build parallèle des 11 images + push vers GitLab Registry
- [x] `scripts/backup.sh` prêt
- [x] `timely-frontend/Dockerfile` + `nginx.conf` prêts

---

## Phase 1 — DNS (Hostinger)

Se connecter à Hostinger → Zone DNS de `yondrfit.com` et ajouter :

| Type | Nom | Valeur | TTL |
|---|---|---|---|
| A | `timely` | `<Elastic IP de l'EC2>` | 300 |

> Faire ça en premier — la propagation prend quelques minutes à ~1h.

---

## Phase 2 — Provisioning AWS

### 2.1 Instance EC2

| Paramètre | Valeur |
|---|---|
| Type | `t3.xlarge` (4 vCPU, 16 GB) |
| OS | Ubuntu Server 24.04 LTS |
| Stockage root | 30 GB gp3 |
| Stockage données | Volume EBS séparé, 50 GB gp3, monté sur `/data` |
| Elastic IP | Oui — associer avant de configurer le DNS |
| Région | `eu-west-3` (Paris) |

### 2.2 Security Group `timely-prod-sg`

| Protocole | Port | Source |
|---|---|---|
| TCP | 22 | Ton IP uniquement |
| TCP | 80 | 0.0.0.0/0 |
| TCP | 443 | 0.0.0.0/0 |
| TCP | 3000 | Ton IP uniquement (UI Dokploy) |

> Tous les autres ports restent fermés — communication interne Docker uniquement.

---

## Phase 3 — Préparation du serveur

```bash
# Mise à jour système
sudo apt update && sudo apt upgrade -y

# Docker
curl -fsSL https://get.docker.com | sudo bash
sudo usermod -aG docker $USER
# Se déconnecter / reconnecter
```

> Les données PostgreSQL, MongoDB, Redis et RabbitMQ sont stockées dans des **volumes Docker nommés** sur le volume racine (30 GiB gp3). Pas de volume EBS séparé nécessaire.

---

## Phase 4 — Installation de Dokploy

```bash
curl -sSL https://dokploy.com/install.sh | sh
```

Dokploy installe Docker Compose, Traefik et son UI en une seule commande. L'UI est accessible sur `http://<IP>:3000`.

> **Créer le compte admin** à la première connexion — cette fenêtre n'est ouverte que quelques minutes après l'installation.

---

## Phase 4b — Déclenchement du build CI

Avant de configurer Dokploy, les images doivent exister dans le registry.

```bash
# Pousser main déclenche automatiquement le pipeline GitLab CI
git push origin main
```

Suivre l'avancement : GitLab → **CI/CD → Pipelines**. Les 11 jobs tournent en parallèle, durée estimée ~10-15 min (wall time). Compute minutes consommées : ~100-120 min.

> **Cache inline activé** (`BUILDKIT_INLINE_CACHE=1`) — les runs suivants réutilisent les layers Maven déjà buildés, durée réduite à ~3-5 min par service.

---

## Phase 5 — Configuration Dokploy

### 5.1 Domaine du serveur

Dans l'UI Dokploy → **Settings** → **Server Domain** : saisir `timely.yondrfit.com`.

Dokploy va obtenir automatiquement le certificat Let's Encrypt.

### 5.2 Créer le projet

UI Dokploy → **Projects** → **New Project** → nom : `timely`

### 5.3 Configurer le registry GitLab (images privées)

Dokploy → **Settings** → **Registries** → **Add Registry** :

| Champ | Valeur |
|---|---|
| Registry URL | `registry.gitlab.com` |
| Username | Ton username GitLab |
| Password | Deploy Token GitLab (`read_registry`) |

> Créer le Deploy Token : GitLab → **Settings → Repository → Deploy tokens** → scope `read_registry`.

### 5.4 Ajouter la stack Compose

Dans le projet → **New Service** → **Docker Compose** :

- **Source** : Git repository → URL du repo, branche `main`
- **Compose file** : `docker-compose.yml`
- **Override file** : `docker-compose.prod.yml`

### 5.5 Variables d'environnement

Dans la section **Environment** du service Compose, saisir :

```env
JWT_SECRET=<openssl rand -base64 64>
DB_PASSWORD=<openssl rand -base64 32>
RABBITMQ_PASSWORD=<openssl rand -base64 32>
MONGODB_PASSWORD=<openssl rand -base64 32>
MAIL_HOST=email-smtp.eu-west-1.amazonaws.com
MAIL_PORT=587
MAIL_USERNAME=<clé-SES>
MAIL_PASSWORD=<secret-SES>
```

> Générer les secrets avant de les saisir :
> ```bash
> openssl rand -base64 64   # JWT
> openssl rand -base64 32   # DB, RabbitMQ, MongoDB
> ```

---

## Phase 6 — Premier déploiement

Dans l'UI Dokploy → **Deploy**.

Dokploy va :
1. Cloner le repo
2. Builder l'image `frontend` (Angular + nginx, ~5 min)
3. Démarrer tous les services dans l'ordre (healthchecks respectés)
4. Configurer Traefik pour `timely.yondrfit.com` avec SSL Let's Encrypt

### Vérification

```bash
# Depuis le serveur — vérifier que l'api-gateway répond en interne
docker exec timely-api-gateway curl -s http://localhost:8090/actuator/health

# Depuis n'importe où — vérifier le SSL et le frontend
curl -I https://timely.yondrfit.com
curl https://timely.yondrfit.com/api/actuator/health
```

Logs en direct dans l'UI Dokploy ou via :

```bash
docker compose logs -f
```

---

## Phase 7 — Sauvegardes

```bash
# Cloner le repo pour accéder au script
cd /opt/timely
git clone <url-repo> .

# Planifier le backup toutes les nuits à 2h
echo "0 2 * * * /opt/timely/scripts/backup.sh >> /var/log/timely-backup.log 2>&1" | sudo crontab -
```

---

## Checklist finale avant présentation

### Infrastructure
- [ ] EC2 `t3.xlarge` provisionné, Elastic IP associée
- [ ] Volume EBS `/data` monté
- [ ] Security Group : ports 22, 80, 443, 3000 (3000 = ton IP uniquement)
- [ ] Enregistrement DNS `timely.yondrfit.com → <Elastic IP>` propagé

### Dokploy
- [ ] Dokploy installé, compte admin créé
- [ ] Domaine serveur configuré (`timely.yondrfit.com`)
- [ ] Variables d'environnement saisies (vrais secrets, pas "changeme")
- [ ] Déploiement réussi (tous les containers `healthy`)
- [ ] `https://timely.yondrfit.com` accessible avec SSL valide

### Application
- [ ] `https://timely.yondrfit.com/api/actuator/health` répond `UP`
- [ ] Login fonctionnel
- [ ] Script de backup en cron

---

## Procédure de mise à jour (post-présentation)

```bash
# Dans l'UI Dokploy → Redeploy
# ou via git push sur main (si webhook Dokploy configuré)
```
