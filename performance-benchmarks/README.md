# Timely - Performance Benchmarks Suite

Suite complète de tests de performance pour le projet Timely, comprenant des benchmarks backend (JMeter), frontend (Lighthouse CI) et micro-benchmarks (JMH).

## Table des matières

- [Objectifs](#objectifs)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Exécution rapide](#exécution-rapide)
- [Benchmarks détaillés](#benchmarks-détaillés)
  - [Backend (JMeter)](#1-backend---jmeter-load-tests)
  - [Frontend (Lighthouse CI)](#2-frontend---lighthouse-ci)
  - [Micro-benchmarks (JMH)](#3-micro-benchmarks---jmh)
- [Interprétation des résultats](#interprétation-des-résultats)
- [Seuils de performance](#seuils-de-performance)
- [Intégration CI/CD](#intégration-cicd)
- [Troubleshooting](#troubleshooting)

## Objectifs

Cette suite de benchmarks vise à valider les performances du système Timely sur trois axes:

1. **Backend (Microservices)**: Tester la capacité à gérer la charge utilisateur
2. **Frontend (Angular)**: Mesurer la performance perçue par l'utilisateur
3. **Algorithmes critiques**: Valider que la génération d'emplois du temps respecte le SLA de < 10 secondes

## Architecture

```
performance-benchmarks/
├── jmeter/                    # Tests de charge backend
│   ├── auth-service.jmx
│   ├── user-service.jmx
│   ├── planning-service.jmx  # CRITIQUE: <10s pour 200 cours
│   ├── booking-service.jmx
│   ├── report-service.jmx
│   ├── all-services.jmx       # Test d'intégration complet
│   └── results/               # Résultats des tests
├── lighthouse/                # Tests de performance frontend
│   ├── lighthouserc.json      # Configuration Lighthouse CI
│   ├── config/
│   │   └── lighthouse.config.js
│   └── scripts/
│       └── run-lighthouse.sh
├── scripts/                   # Scripts d'automatisation
│   ├── run-all-benchmarks.sh  # Lance TOUS les benchmarks
│   ├── run-backend-benchmarks.sh
│   └── run-jmh-benchmark.sh
└── README.md                  # Cette documentation
```

## Prérequis

### Logiciels requis

- **Java 21+** (pour JMH et services backend)
- **Maven 3.6+** (pour build et JMH)
- **Apache JMeter 5.6+** (pour tests de charge)
- **Node.js 18+** et npm (pour Lighthouse CI)
- **Docker & Docker Compose** (pour exécuter les services)

### Installation des outils

#### macOS (Homebrew)

```bash
# JMeter
brew install jmeter

# Lighthouse CI
npm install -g @lhci/cli@0.13.x

# Autres outils déjà installés avec le projet
```

#### Linux (Ubuntu/Debian)

```bash
# JMeter
wget https://downloads.apache.org/jmeter/binaries/apache-jmeter-5.6.3.tgz
tar -xzf apache-jmeter-5.6.3.tgz
sudo mv apache-jmeter-5.6.3 /opt/jmeter
echo 'export PATH="/opt/jmeter/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Lighthouse CI
npm install -g @lhci/cli@0.13.x
```

## Installation

1. **Cloner le projet Timely**

```bash
git clone <repository-url>
cd timely
```

2. **Démarrer tous les services**

```bash
docker-compose up -d
```

3. **Vérifier que les services sont opérationnels**

```bash
curl http://localhost:8090/actuator/health
```

## Exécution rapide

### Lancer TOUS les benchmarks

```bash
cd performance-benchmarks
bash scripts/run-all-benchmarks.sh
```

Cette commande exécute:
1. JMH micro-benchmarks (génération d'emplois du temps)
2. JMeter load tests (tous les services)
3. Lighthouse CI (frontend Angular)

**Durée estimée**: 15-20 minutes

### Options avancées

```bash
# Backend uniquement (JMeter)
bash scripts/run-all-benchmarks.sh --backend-only

# Frontend uniquement (Lighthouse)
bash scripts/run-all-benchmarks.sh --frontend-only

# JMH uniquement
bash scripts/run-all-benchmarks.sh --jmh-only

# Personnaliser le nombre de threads
bash scripts/run-all-benchmarks.sh --threads 100
```

## Benchmarks détaillés

### 1. Backend - JMeter Load Tests

#### Objectif
Tester la capacité des microservices à gérer la charge utilisateur concurrente.

#### Services testés

| Service | Endpoints testés | Assertions clés |
|---------|------------------|-----------------|
| **Auth Service** (8091) | Login, Validate Token, Logout | < 1000ms login, < 500ms validation |
| **User Service** (8092) | CRUD, Pagination | < 500ms GET, < 1000ms POST |
| **Planning Service** (8093) | Generate Schedule, Conflicts | **< 10000ms génération** (CRITIQUE) |
| **Booking Service** (8094) | Room booking, Availability | < 1000ms création |
| **Report Service** (8096) | PDF/Excel generation | < 6000ms génération |

#### Scénarios de charge

- **10 utilisateurs**: Test de stabilité de base
- **50 utilisateurs**: Charge moyenne attendue
- **100 utilisateurs**: Pic de charge (rentrée scolaire)
- **200 utilisateurs**: Stress test

#### Exécution

```bash
# Test individuel d'un service
cd performance-benchmarks
bash scripts/run-backend-benchmarks.sh 50 planning

# Tous les services avec 100 utilisateurs concurrents
bash scripts/run-backend-benchmarks.sh 100 all

# Test d'intégration complet
bash scripts/run-backend-benchmarks.sh 50 complete
```

#### Résultats

Les résultats sont générés dans `jmeter/results/`:
- **CSV files**: Données brutes des requêtes
- **HTML reports**: Rapports visuels avec graphiques
- **Logs**: Détails d'exécution

### 2. Frontend - Lighthouse CI

#### Objectif
Mesurer les performances, l'accessibilité, les bonnes pratiques et le SEO de l'application Angular.

#### Pages testées

- `/` - Page d'accueil
- `/login` - Page de connexion
- `/dashboard` - Tableau de bord
- `/schedules` - Visualisation des emplois du temps
- `/reports` - Génération de rapports
- `/users` - Gestion des utilisateurs

#### Métriques clés

| Métrique | Seuil | Description |
|----------|-------|-------------|
| **Performance** | > 90 | Score global de performance |
| **Accessibility** | > 95 | Accessibilité WCAG |
| **Best Practices** | > 90 | Bonnes pratiques web |
| **SEO** | > 90 | Optimisation pour moteurs de recherche |
| **FCP** | < 2s | First Contentful Paint |
| **LCP** | < 2.5s | Largest Contentful Paint |
| **TBT** | < 300ms | Total Blocking Time |
| **CLS** | < 0.1 | Cumulative Layout Shift |

#### Exécution

```bash
cd performance-benchmarks/lighthouse
bash scripts/run-lighthouse.sh
```

**Note**: Le script build le frontend en mode production, démarre un serveur HTTP, exécute Lighthouse, puis nettoie.

#### Résultats

Les résultats sont dans `lighthouse/.lighthouseci/`:
- **HTML reports**: Rapports détaillés par page
- **JSON files**: Données brutes pour analyse
- **db.sql**: Base de données pour suivi historique

### 3. Micro-benchmarks - JMH

#### Objectif
**CRITIQUE**: Valider que l'algorithme de génération d'emplois du temps respecte le SLA de < 10 secondes pour 200 cours.

#### Benchmarks exécutés

| Benchmark | Description | Objectif |
|-----------|-------------|----------|
| `scheduleGeneration_GreedyAlgorithm` | Génération initiale | Mesurer temps de base |
| `conflictDetection` | Détection de conflits | < 2s pour 200 cours |
| `completeScheduleGeneration` | Pipeline complet | < 10s pour 200 cours |

#### Tailles testées

- **10 cours**: Baseline (< 100ms attendu)
- **50 cours**: Petit département (< 500ms attendu)
- **100 cours**: Département moyen (< 2s attendu)
- **200 cours**: Grand département (< 10s **CRITIQUE**)

#### Exécution

```bash
cd performance-benchmarks
bash scripts/run-jmh-benchmark.sh
```

Ou directement via Maven:

```bash
cd services/planning-service
mvn clean test-compile
mvn exec:java -Dexec.mainClass="com.timely.planningservice.benchmark.ScheduleGenerationBenchmark" \
              -Dexec.classpathScope=test
```

#### Résultats

Les résultats JMH affichent:
- **Score moyen**: Temps d'exécution moyen (ms)
- **Error margin**: Marge d'erreur statistique
- **Percentiles**: P50, P95, P99
- **Samples**: Nombre d'itérations

**Exemple de sortie attendue**:

```
Benchmark                                              (numberOfCourses)  Mode  Cnt     Score    Error  Units
ScheduleGenerationBenchmark.completeScheduleGeneration               10  avgt   10    85.234 ±  2.145   ms/op
ScheduleGenerationBenchmark.completeScheduleGeneration               50  avgt   10   421.567 ±  8.234   ms/op
ScheduleGenerationBenchmark.completeScheduleGeneration              100  avgt   10  1789.123 ± 15.678   ms/op
ScheduleGenerationBenchmark.completeScheduleGeneration              200  avgt   10  8234.567 ± 45.123   ms/op  ✓ PASS (<10s)
```

## Interprétation des résultats

### JMeter - Métriques clés

#### Summary Report

- **Average**: Temps de réponse moyen
- **Median**: 50% des requêtes sont plus rapides
- **90% Line**: 90% des requêtes sont plus rapides
- **Throughput**: Requêtes par seconde
- **Error %**: Taux d'erreur (doit être < 1%)

#### Codes d'état HTTP

- **200-299**: Succès (bon)
- **400-499**: Erreurs client (vérifier requêtes)
- **500-599**: Erreurs serveur (problème backend)

#### Actions selon les résultats

| Métrique | Seuil | Action si dépassement |
|----------|-------|----------------------|
| Temps de réponse moyen | +50% vs objectif | Optimiser code/DB |
| Error % | > 1% | Vérifier logs serveur |
| Throughput | Diminution > 20% | Augmenter ressources |

### Lighthouse - Métriques clés

#### Performance

- **FCP (First Contentful Paint)**: Première apparition de contenu
  - Bon: < 1.8s
  - Moyen: 1.8-3s
  - Mauvais: > 3s

- **LCP (Largest Contentful Paint)**: Plus gros élément visible
  - Bon: < 2.5s
  - Moyen: 2.5-4s
  - Mauvais: > 4s

- **TBT (Total Blocking Time)**: Temps de blocage du thread principal
  - Bon: < 200ms
  - Moyen: 200-600ms
  - Mauvais: > 600ms

- **CLS (Cumulative Layout Shift)**: Stabilité visuelle
  - Bon: < 0.1
  - Moyen: 0.1-0.25
  - Mauvais: > 0.25

#### Optimisations courantes

| Problème | Cause | Solution |
|----------|-------|----------|
| LCP lent | Images non optimisées | Utiliser WebP, lazy loading |
| TBT élevé | JavaScript bloquant | Code splitting, async/defer |
| CLS problématique | Éléments sans dimensions | Spécifier width/height |
| Score faible | Bundle trop gros | Tree shaking, compression |

### JMH - Analyse des résultats

#### Interpréter le score

```
Benchmark                                  Mode  Cnt     Score    Error  Units
scheduleGeneration_GreedyAlgorithm         avgt   10  8234.567 ± 45.123  ms/op
```

- **Score**: Temps moyen (8234.567 ms = 8.2 secondes)
- **Error**: Marge d'erreur (± 45.123 ms)
- **Verdict**: PASS (< 10 secondes pour 200 cours)

#### Actions si objectif non atteint

1. **Profiling**: Identifier les bottlenecks
   ```bash
   # Profiler avec async-profiler
   -javaagent:async-profiler.jar
   ```

2. **Optimisations possibles**:
   - Parallélisation (Fork/Join, Streams parallèles)
   - Caching (Redis pour données référentielles)
   - Algorithme plus efficace (contraintes + heuristiques)
   - Index DB optimisés

3. **Scaling horizontal**:
   - Distribuer calcul sur plusieurs instances
   - Queue asynchrone (RabbitMQ) pour génération longue

## Seuils de performance

### Backend (JMeter)

| Service | Endpoint | Max Latency | Max Error % |
|---------|----------|-------------|-------------|
| Auth | POST /auth/login | 1000ms | 0.1% |
| Auth | POST /auth/validate | 500ms | 0.1% |
| User | GET /users | 500ms | 0.5% |
| User | POST /users | 1000ms | 0.5% |
| Planning | **POST /schedules/generate** | **10000ms** | **0%** |
| Planning | GET /schedules/{id} | 500ms | 0.5% |
| Booking | POST /bookings | 1000ms | 0.5% |
| Report | POST /reports/pdf | 6000ms | 1% |

### Frontend (Lighthouse)

| Catégorie | Score minimum | Note |
|-----------|---------------|------|
| Performance | 90 | Production-ready |
| Accessibility | 95 | WCAG AA compliance |
| Best Practices | 90 | Standards web |
| SEO | 90 | Optimisation moteurs |

### JMH (Micro-benchmarks)

| Taille | Opération | Max Time |
|--------|-----------|----------|
| 10 cours | Generation complète | 100ms |
| 50 cours | Generation complète | 500ms |
| 100 cours | Generation complète | 2000ms |
| **200 cours** | **Generation complète** | **10000ms** |

## Intégration CI/CD

### GitHub Actions

Créer `.github/workflows/performance-tests.yml`:

```yaml
name: Performance Tests

on:
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * 1' # Lundi à 2h du matin

jobs:
  backend-benchmarks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Start services
        run: docker-compose up -d
      - name: Wait for services
        run: sleep 30
      - name: Run JMeter tests
        run: bash performance-benchmarks/scripts/run-backend-benchmarks.sh 50 all
      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: jmeter-results
          path: performance-benchmarks/jmeter/results/

  jmh-benchmarks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '21'
      - name: Run JMH benchmarks
        run: bash performance-benchmarks/scripts/run-jmh-benchmark.sh

  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Run Lighthouse CI
        run: bash performance-benchmarks/lighthouse/scripts/run-lighthouse.sh
      - name: Upload reports
        uses: actions/upload-artifact@v3
        with:
          name: lighthouse-reports
          path: performance-benchmarks/lighthouse/.lighthouseci/
```

### Jenkins

```groovy
pipeline {
    agent any

    stages {
        stage('Start Services') {
            steps {
                sh 'docker-compose up -d'
                sh 'sleep 30'
            }
        }

        stage('JMH Benchmarks') {
            steps {
                sh 'bash performance-benchmarks/scripts/run-jmh-benchmark.sh'
            }
        }

        stage('Backend Load Tests') {
            steps {
                sh 'bash performance-benchmarks/scripts/run-backend-benchmarks.sh 50 all'
            }
        }

        stage('Frontend Performance') {
            steps {
                sh 'bash performance-benchmarks/lighthouse/scripts/run-lighthouse.sh'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'performance-benchmarks/**/results/**/*', allowEmptyArchive: true
            publishHTML target: [
                reportDir: 'performance-benchmarks/jmeter/results',
                reportFiles: '**/*.html',
                reportName: 'JMeter Report'
            ]
        }
    }
}
```

## Troubleshooting

### Problème: JMeter - Connection Refused

**Symptômes**: Erreurs 503 ou "Connection refused"

**Solutions**:
1. Vérifier que les services sont démarrés:
   ```bash
   docker-compose ps
   curl http://localhost:8090/actuator/health
   ```
2. Augmenter le temps de warm-up des services
3. Vérifier les logs Docker:
   ```bash
   docker-compose logs api-gateway
   ```

### Problème: Lighthouse - Build Failed

**Symptômes**: "ng build failed" ou erreurs TypeScript

**Solutions**:
1. Nettoyer et réinstaller les dépendances:
   ```bash
   cd timely-frontend
   rm -rf node_modules package-lock.json
   npm install
   ```
2. Vérifier la version de Node.js:
   ```bash
   node --version  # Doit être 18+
   ```

### Problème: JMH - OutOfMemoryError

**Symptômes**: `java.lang.OutOfMemoryError: Java heap space`

**Solutions**:
1. Augmenter la heap JVM:
   ```bash
   export MAVEN_OPTS="-Xms4G -Xmx8G"
   bash scripts/run-jmh-benchmark.sh
   ```
2. Réduire le nombre de forks/itérations dans le benchmark

### Problème: Tests lents ou timeout

**Symptômes**: Tests qui prennent > 30 minutes

**Solutions**:
1. Réduire le nombre de threads:
   ```bash
   bash scripts/run-backend-benchmarks.sh 10 all  # Au lieu de 50
   ```
2. Tester un service à la fois
3. Vérifier les ressources système (CPU/RAM)

## Support

Pour toute question ou problème:

1. **Documentation**: Consulter ce README
2. **Issues**: Créer une issue GitHub avec:
   - Commande exécutée
   - Logs d'erreur complets
   - Environnement (OS, versions outils)
3. **Logs**: Joindre les fichiers de logs pertinents

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.
