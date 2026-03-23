# Quick Start - Performance Benchmarks

Guide de démarrage rapide pour exécuter les benchmarks de performance Timely.

## Prérequis rapides

```bash
# Vérifier les outils installés
java -version        # Doit afficher Java 21+
mvn -version         # Doit afficher Maven 3.6+
jmeter -version      # Doit afficher JMeter 5.6+
node --version       # Doit afficher Node 18+
lhci --version       # Doit afficher Lighthouse CI
docker --version     # Doit afficher Docker
```

Si un outil manque, consultez le [README.md](README.md#prérequis) pour l'installation.

## Démarrage en 3 étapes

### Étape 1: Démarrer les services Timely

```bash
cd /path/to/timely
docker-compose up -d
```

Attendre ~30 secondes, puis vérifier:

```bash
curl http://localhost:8090/actuator/health
# Doit retourner: {"status":"UP"}
```

### Étape 2: Choisir votre benchmark

#### Option A: Tout exécuter (recommandé pour la première fois)

```bash
cd performance-benchmarks
bash scripts/run-all-benchmarks.sh
```

**Durée**: 15-20 minutes

#### Option B: Backend uniquement (JMeter)

```bash
cd performance-benchmarks
bash scripts/run-backend-benchmarks.sh 50 all
```

**Durée**: 10-12 minutes

#### Option C: Frontend uniquement (Lighthouse)

```bash
cd performance-benchmarks/lighthouse
bash scripts/run-lighthouse.sh
```

**Durée**: 5-7 minutes

#### Option D: JMH uniquement (Micro-benchmarks)

```bash
cd performance-benchmarks
bash scripts/run-jmh-benchmark.sh
```

**Durée**: 3-5 minutes

### Étape 3: Consulter les résultats

#### Résultats JMeter

```bash
# Ouvrir le rapport HTML dans le navigateur
open jmeter/results/*/index.html

# Ou sur Linux
xdg-open jmeter/results/*/index.html
```

#### Résultats Lighthouse

```bash
# Ouvrir le rapport HTML
open lighthouse/.lighthouseci/*.html

# Ou démarrer le serveur Lighthouse CI
lhci server --config=lighthouse/lighthouserc.json
# Puis ouvrir http://localhost:9001
```

#### Résultats JMH

Les résultats s'affichent directement dans le terminal.

## Commandes rapides par service

### JMeter - Tests individuels

```bash
cd performance-benchmarks

# Auth Service (login/logout)
bash scripts/run-backend-benchmarks.sh 50 auth

# User Service (CRUD utilisateurs)
bash scripts/run-backend-benchmarks.sh 50 user

# Planning Service (CRITIQUE - génération emplois du temps)
bash scripts/run-backend-benchmarks.sh 50 planning

# Booking Service (réservations salles)
bash scripts/run-backend-benchmarks.sh 50 booking

# Report Service (génération PDF/Excel)
bash scripts/run-backend-benchmarks.sh 50 report
```

### Variation du nombre d'utilisateurs

```bash
# 10 utilisateurs (test léger)
bash scripts/run-backend-benchmarks.sh 10 all

# 100 utilisateurs (test de charge)
bash scripts/run-backend-benchmarks.sh 100 all

# 200 utilisateurs (stress test)
bash scripts/run-backend-benchmarks.sh 200 all
```

## Vérification des résultats critiques

### 1. Génération d'emplois du temps (CRITIQUE)

**Objectif**: < 10 secondes pour 200 cours

**Vérifier dans JMeter**:
```bash
# Chercher dans jmeter/results/*planning*.csv
grep "POST /schedules/generate" jmeter/results/planning-service-*.csv | awk -F',' '{print $2}'
# Tous les temps doivent être < 10000ms
```

**Vérifier dans JMH**:
```bash
# Chercher la ligne avec 200 cours
# Score doit être < 10000ms
```

### 2. Performance frontend

**Objectif**: Score > 90

```bash
# Vérifier le score dans le rapport HTML
# Ou extraire du JSON
jq '.categories.performance.score' lighthouse/.lighthouseci/lhr-*.json
# Résultat doit être > 0.90
```

## Résolution rapide de problèmes

### Problème: Services ne répondent pas

```bash
# Vérifier que les services sont démarrés
docker-compose ps

# Vérifier les logs
docker-compose logs api-gateway

# Redémarrer si nécessaire
docker-compose restart
```

### Problème: JMeter - Connection Refused

```bash
# Attendre que les services soient prêts
sleep 30

# Vérifier la santé de l'API Gateway
curl http://localhost:8090/actuator/health

# Si toujours en erreur, vérifier les ports
lsof -i :8090
```

### Problème: Lighthouse - Frontend ne build pas

```bash
cd timely-frontend

# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install

# Tester le build
npm run build
```

### Problème: JMH - OutOfMemoryError

```bash
# Augmenter la heap JVM
export MAVEN_OPTS="-Xms4G -Xmx8G"
bash scripts/run-jmh-benchmark.sh
```

## Interprétation rapide des résultats

### JMeter - Rapport HTML

Ouvrir `index.html` et vérifier:

1. **Error %** (colonne Error %) → Doit être < 1%
2. **Average** (colonne Average) → Doit être < objectif du endpoint
3. **90% Line** → 90% des utilisateurs voient ce temps ou moins

**Code couleur mental**:
- Error % = 0% → ✅ Parfait
- Error % < 1% → ✅ Bon
- Error % 1-5% → ⚠️ À surveiller
- Error % > 5% → ❌ Problème

### Lighthouse - Scores

**Seuils Timely**:
- Performance: > 90 ✅
- Accessibility: > 95 ✅
- Best Practices: > 90 ✅
- SEO: > 90 ✅

### JMH - Console

Chercher la ligne avec `200` (courses):

```
completeScheduleGeneration  200  avgt  10  8234.567 ± 45.123  ms/op
                            ^^^           ^^^^^^^^
                            Taille        Temps (ms)
```

**Verdict**: 8234ms < 10000ms → ✅ PASS

## Benchmarks en CI/CD

### GitHub Actions - Quick Setup

Créer `.github/workflows/performance-tests.yml`:

```yaml
name: Performance Tests

on:
  pull_request:
    branches: [main]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Start services
        run: docker-compose up -d && sleep 30
      - name: Run benchmarks
        run: cd performance-benchmarks && bash scripts/run-all-benchmarks.sh
      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: benchmark-results
          path: performance-benchmarks/**/results/
```

### Exécution manuelle GitHub Actions

```bash
# Via gh CLI
gh workflow run performance-tests.yml

# Voir les résultats
gh run list --workflow=performance-tests.yml
gh run view <run-id>
```

## Commandes avancées

### JMeter avec paramètres custom

```bash
# Exécuter avec 100 threads, 60s ramp-up, 180s durée
jmeter -n -t jmeter/planning-service.jmx \
       -Jthreads=100 \
       -Jramp_up=60 \
       -Jduration=180 \
       -l results/custom-test.csv
```

### Lighthouse avec profil mobile

```bash
cd lighthouse

# Modifier lighthouserc.json
# Changer "formFactor": "mobile"
# Changer screenEmulation.mobile: true

bash scripts/run-lighthouse.sh
```

### JMH avec profiling

```bash
cd services/planning-service

# Ajouter profiler async-profiler
mvn exec:java \
  -Dexec.mainClass="com.timely.planningservice.benchmark.ScheduleGenerationBenchmark" \
  -Dexec.classpathScope=test \
  -Dexec.args="-prof async:libPath=/path/to/libasyncProfiler.so"
```

## Checklist avant production

Avant de déployer en production, vérifier:

- [ ] JMeter: Error % < 0.1% pour tous les services
- [ ] JMeter: Temps de réponse < objectifs (voir README)
- [ ] Lighthouse: Performance score > 90
- [ ] Lighthouse: Accessibility score > 95
- [ ] JMH: Génération emplois du temps < 10s pour 200 cours
- [ ] Aucune régression de performance vs baseline
- [ ] Tests passent avec charge 2× attendue

## Ressources supplémentaires

- **Documentation complète**: [README.md](README.md)
- **Guide des résultats**: [RESULTS-GUIDE.md](RESULTS-GUIDE.md)
- **JMeter**: https://jmeter.apache.org/usermanual/index.html
- **Lighthouse**: https://developer.chrome.com/docs/lighthouse/overview/
- **JMH**: https://github.com/openjdk/jmh

## Support

Problèmes ou questions:

1. Consulter la section [Troubleshooting](README.md#troubleshooting) du README
2. Vérifier les logs: `docker-compose logs <service-name>`
3. Créer une issue GitHub avec les détails

---

**Bon benchmarking!** 🚀
