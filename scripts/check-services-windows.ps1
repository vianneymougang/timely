# Script PowerShell pour vérifier l'état des services Timely
# Usage: .\check-services-windows.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Timely - Vérification des Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Fonction pour vérifier un port
function Test-ServicePort {
    param(
        [string]$ServiceName,
        [int]$Port,
        [string]$Url = $null
    )

    Write-Host "[$ServiceName]" -NoNewline -ForegroundColor Yellow
    Write-Host " (port $Port)..." -NoNewline

    $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue -InformationLevel Quiet

    if ($connection) {
        Write-Host " ✓ OK" -ForegroundColor Green

        # Si une URL de health check est fournie, la tester
        if ($Url) {
            try {
                $response = Invoke-RestMethod -Uri $Url -TimeoutSec 5 -ErrorAction Stop
                if ($response.status -eq "UP" -or $response -match "UP") {
                    Write-Host "  └─ Health: UP" -ForegroundColor Green
                } else {
                    Write-Host "  └─ Health: $($response.status)" -ForegroundColor Yellow
                }
            } catch {
                Write-Host "  └─ Health: Non disponible" -ForegroundColor Gray
            }
        }
    } else {
        Write-Host " ✗ DOWN" -ForegroundColor Red
    }
}

# Infrastructure
Write-Host ""
Write-Host "=== INFRASTRUCTURE ===" -ForegroundColor Cyan
Write-Host ""

Test-ServicePort -ServiceName "Redis" -Port 6379
Test-ServicePort -ServiceName "PostgreSQL" -Port 5432
Test-ServicePort -ServiceName "MongoDB" -Port 27017
Test-ServicePort -ServiceName "RabbitMQ AMQP" -Port 5672
Test-ServicePort -ServiceName "RabbitMQ Management" -Port 15672
Test-ServicePort -ServiceName "Mailtrap/MailHog" -Port 1025

# Services Spring Boot
Write-Host ""
Write-Host "=== SERVICES SPRING BOOT ===" -ForegroundColor Cyan
Write-Host ""

Test-ServicePort -ServiceName "Config Server" -Port 8888 -Url "http://localhost:8888/actuator/health"
Test-ServicePort -ServiceName "Discovery Server (Eureka)" -Port 8761 -Url "http://localhost:8761/actuator/health"
Test-ServicePort -ServiceName "API Gateway" -Port 8090 -Url "http://localhost:8090/actuator/health"

Write-Host ""
Write-Host "=== MICROSERVICES ===" -ForegroundColor Cyan
Write-Host ""

Test-ServicePort -ServiceName "Auth Service" -Port 8091 -Url "http://localhost:8091/actuator/health"
Test-ServicePort -ServiceName "User Service" -Port 8092 -Url "http://localhost:8092/actuator/health"
Test-ServicePort -ServiceName "Planning Service" -Port 8093 -Url "http://localhost:8093/actuator/health"
Test-ServicePort -ServiceName "Booking Service" -Port 8094 -Url "http://localhost:8094/actuator/health"
Test-ServicePort -ServiceName "Notification Service" -Port 8095 -Url "http://localhost:8095/actuator/health"
Test-ServicePort -ServiceName "Report Service" -Port 8096 -Url "http://localhost:8096/actuator/health"
Test-ServicePort -ServiceName "Agora Service" -Port 8097 -Url "http://localhost:8097/actuator/health"

# Vérifier Eureka
Write-Host ""
Write-Host "=== ENREGISTREMENT EUREKA ===" -ForegroundColor Cyan
Write-Host ""

try {
    $eurekaApps = Invoke-RestMethod -Uri "http://localhost:8761/eureka/apps" -Headers @{Accept = "application/json"} -ErrorAction Stop
    $registeredServices = $eurekaApps.applications.application

    if ($registeredServices) {
        Write-Host "Services enregistrés dans Eureka:" -ForegroundColor Green
        foreach ($app in $registeredServices) {
            $name = $app.name
            $instances = if ($app.instance -is [array]) { $app.instance.Count } else { 1 }
            Write-Host "  ✓ $name ($instances instance(s))" -ForegroundColor White
        }
    } else {
        Write-Host "Aucun service enregistré dans Eureka." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Impossible de contacter Eureka ou parser la réponse." -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Vérification terminée." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
