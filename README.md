# ⏳ Timely

Timely est une application moderne basée sur des microservices, conçue pour une gestion efficace des emplois de temps des salles et professeurs de l'Université Saint Jean. Ce dépôt contient le code source des microservices backend et de l'application frontend.

## 🚀 Stack Technique

### Frontend

- **Framework**: Angular 20
- **Style**: TailwindCSS
- **Icônes**: Lucide Angular
- **Langage**: TypeScript

### Backend

- **Framework**: Spring Boot 3
- **Architecture Microservices**: Spring Cloud (Gateway, Eureka Discovery, Config Server)
- **Langage**: Java 21
- **Outil de Build**: Maven

### Infrastructure & Données

- **Bases de données**: PostgreSQL, MongoDB
- **Conteneurisation**: Docker, Docker Compose
- **Outils**: pgAdmin, Mongo Express, MailDev

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre machine :

- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** : Pour exécuter les services backend et les bases de données.
- **[Node.js](https://nodejs.org/)** (v18+ recommandé) : Pour exécuter le frontend localement.
- **[Git](https://git-scm.com/)** : Pour cloner le dépôt.

---

## 🛠️ Installation et Configuration

### 1. Cloner le Dépôt

```bash
git clone <url-du-dépôt>
cd Timely
```

### 2. Configuration Backend (Docker)

Les services backend sont conteneurisés. Vous pouvez démarrer toute l'infrastructure en utilisant Docker Compose.

1. Naviguez vers le répertoire racine.
2. Exécutez la commande suivante pour construire et démarrer les services :

   ```bash
   docker-compose up -d --build
   ```

   _Cela peut prendre quelques minutes la première fois car il télécharge les images et compile les applications Java._

3. Vérifiez le statut des conteneurs :

   ```bash
   docker-compose ps
   ```

### 3. Configuration Frontend

Le frontend est une application Angular qui s'exécute localement.

1. Naviguez vers le répertoire du frontend :

   ```bash
   cd timely-frontend
   ```

2. Installez les dépendances :

   ```bash
   npm install
   ```

3. Démarrez le serveur de développement :

   ```bash
   npm start
   ```

   L'application sera accessible à l'adresse `http://localhost:4200`.

---

## 🏗️ Vue d'ensemble de l'Architecture

Le projet suit une architecture microservices. Voici les principaux services et leurs ports :

| Service              | Description                             | Port   | URL                                            |
| :------------------- | :-------------------------------------- | :----- | :--------------------------------------------- |
| **API Gateway**      | Point d'entrée pour toutes les requêtes | `8090` | [http://localhost:8090](http://localhost:8090) |
| **Auth Service**     | Authentification & Autorisation         | `8091` | Interne                                        |
| **Discovery Server** | Registre de Services Eureka             | `8761` | [http://localhost:8761](http://localhost:8761) |
| **Config Server**    | Configuration Centralisée               | `8888` | [http://localhost:8888](http://localhost:8888) |
| **Frontend**         | Application Web Angular                 | `4200` | [http://localhost:4200](http://localhost:4200) |

### Services d'Infrastructure

| Service           | Description                   | Port    | Identifiants (User/Pass)        |
| :---------------- | :---------------------------- | :------ | :------------------------------ |
| **PostgreSQL**    | Base de données Relationnelle | `5432`  | `admin` / `password`            |
| **pgAdmin**       | Interface UI PostgreSQL       | `5050`  | `pgadmin@pgadmin.org` / `admin` |
| **MongoDB**       | Base de données NoSQL         | `27017` | `admin` / `password`            |
| **Mongo Express** | Interface UI MongoDB          | `8081`  | `admin` / `password`            |
| **MailDev**       | Outil de Test d'Email         | `1080`  | N/A                             |

---

## 💡 Conseils Utiles

### Commandes Docker

- **Arrêter tous les services** :

  ```bash
  docker-compose down
  ```

- **Voir les logs d'un service spécifique** (ex: api-gateway) :

  ```bash
  docker-compose logs -f api-gateway
  ```

- **Redémarrer un service spécifique** :

  ```bash
  docker-compose restart <nom-du-service>
  ```

### Accès aux Bases de Données

- **PostgreSQL** : Vous pouvez accéder à la base de données Postgres via **pgAdmin** à l'adresse `http://localhost:5050`.
  - **Nom d'hôte/adresse** dans pgAdmin lors de l'exécution dans Docker : `auth-service-db` (ou le nom du conteneur).
- **MongoDB** : Vous pouvez accéder à la base de données Mongo via **Mongo Express** à l'adresse `http://localhost:8081`.

### Dépannage

- **Découverte de Services** : Si les services ne se trouvent pas entre eux, vérifiez le Tableau de Bord Eureka (`http://localhost:8761`) pour vous assurer que tous les services sont enregistrés (statut UP).
- **Config Server** : Assurez-vous que le Config Server est opérationnel avant les autres services, car ils en dépendent pour leur configuration. Docker Compose gère l'ordre de démarrage via `depends_on`, mais parfois un redémarrage manuel des services dépendants aide s'ils tombent en timeout.

---

## 🤝 Contribuer

1. Créez une nouvelle branche pour votre fonctionnalité ou correctif.
2. Committez vos changements avec des messages descriptifs.
3. Poussez votre branche et ouvrez une Pull Request.
