# Script PowerShell pour démarrer les services Timely en local (Windows)
# Usage: .\start-services-windows.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Timely - Démarrage des Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Variables
$PROJECT_ROOT = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$SERVICES_DIR = Join-Path $PROJECT_ROOT "services"

# Fonction pour vérifier si un port est utilisé
function Test-Port {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
    return $connection.TcpTestSucceeded
}

# Fonction pour démarrer un service en arrière-plan
function Start-Service-Background {
    param(
        [string]$ServiceName,
        [string]$ServicePath,
        [int]$Port,
        [int]$WaitSeconds = 30
    )

    Write-Host "[INFO] Démarrage de $ServiceName (port $Port)..." -ForegroundColor Yellow

    # Vérifier si le port est déjà utilisé
    if (Test-Port -Port $Port) {
        Write-Host "[WARN] Le port $Port est déjà utilisé. Service $ServiceName probablement déjà lancé." -ForegroundColor Magenta
        return
    }

    # Démarrer le service dans une nouvelle fenêtre PowerShell
    $fullPath = Join-Path $SERVICES_DIR $ServicePath
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$fullPath'; Write-Host 'Starting $ServiceName...' -ForegroundColor Green; mvn spring-boot:run" -WindowStyle Normal

    Write-Host "[INFO] Attente de $WaitSeconds secondes pour le démarrage de $ServiceName..." -ForegroundColor Gray
    Start-Sleep -Seconds $WaitSeconds
}

# Vérifier les dépendances infrastructure
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Vérification des dépendances" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Redis
Write-Host "[CHECK] Redis (port 6379)..." -NoNewline
if (Test-Port -Port 6379) {
    Write-Host " ✓ OK" -ForegroundColor Green
} else {
    Write-Host " ✗ ERREUR" -ForegroundColor Red
    Write-Host "[ERROR] Redis n'est pas lancé. Veuillez démarrer Redis/Memurai." -ForegroundColor Red
    exit 1
}

# PostgreSQL
Write-Host "[CHECK] PostgreSQL (port 5432)..." -NoNewline
if (Test-Port -Port 5432) {
    Write-Host " ✓ OK" -ForegroundColor Green
} else {
    Write-Host " ✗ ERREUR" -ForegroundColor Red
    Write-Host "[ERROR] PostgreSQL n'est pas lancé. Veuillez démarrer PostgreSQL." -ForegroundColor Red
    exit 1
}

# MongoDB
Write-Host "[CHECK] MongoDB (port 27017)..." -NoNewline
if (Test-Port -Port 27017) {
    Write-Host " ✓ OK" -ForegroundColor Green
} else {
    Write-Host " ⚠ WARNING" -ForegroundColor Yellow
    Write-Host "[WARN] MongoDB n'est pas lancé. Nécessaire uniquement pour notification-service." -ForegroundColor Yellow
}

# RabbitMQ
Write-Host "[CHECK] RabbitMQ (port 5672)..." -NoNewline
if (Test-Port -Port 5672) {
    Write-Host " ✓ OK" -ForegroundColor Green
} else {
    Write-Host " ✗ ERREUR" -ForegroundColor Red
    Write-Host "[ERROR] RabbitMQ n'est pas lancé. Veuillez démarrer RabbitMQ." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Démarrage des services Spring Boot" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Config Server
Start-Service-Background -ServiceName "Config Server" -ServicePath "config-server" -Port 8888 -WaitSeconds 30

# 2. Discovery Server (Eureka)
Start-Service-Background -ServiceName "Discovery Server (Eureka)" -ServicePath "discovery-server" -Port 8761 -WaitSeconds 30

# 3. API Gateway
Start-Service-Background -ServiceName "API Gateway" -ServicePath "api-gateway" -Port 8090 -WaitSeconds 25

Write-Host ""
Write-Host "[INFO] Infrastructure de base démarrée. Démarrage des microservices..." -ForegroundColor Green
Write-Host ""

# 4. Microservices
Start-Service-Background -ServiceName "Auth Service" -ServicePath "auth-service" -Port 8091 -WaitSeconds 20
Start-Service-Background -ServiceName "User Service" -ServicePath "user-service" -Port 8092 -WaitSeconds 20
Start-Service-Background -ServiceName "Planning Service" -ServicePath "planning-service" -Port 8093 -WaitSeconds 20
Start-Service-Background -ServiceName "Booking Service" -ServicePath "booking-service" -Port 8094 -WaitSeconds 20
Start-Service-Background -ServiceName "Notification Service" -ServicePath "notification-service" -Port 8095 -WaitSeconds 20
Start-Service-Background -ServiceName "Report Service" -ServicePath "report-service" -Port 8096 -WaitSeconds 20
Start-Service-Background -ServiceName "Agora Service" -ServicePath "agora-service" -Port 8097 -WaitSeconds 20

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Tous les services ont été lancés !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "URLs importantes :" -ForegroundColor Cyan
Write-Host "  - Eureka Dashboard : http://localhost:8761" -ForegroundColor White
Write-Host "  - API Gateway      : http://localhost:8090" -ForegroundColor White
Write-Host "  - RabbitMQ UI      : http://localhost:15672 (admin/password)" -ForegroundColor White
Write-Host ""
Write-Host "Vérifiez que tous les services sont enregistrés dans Eureka." -ForegroundColor Yellow
Write-Host ""
Write-Host "Pour arrêter les services, fermez les fenêtres PowerShell." -ForegroundColor Gray
Write-Host ""
