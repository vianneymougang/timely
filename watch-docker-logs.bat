@echo off
echo ========================================
echo Surveillance des logs Docker Timely
echo ========================================
echo.

echo Choisissez le service a surveiller:
echo.
echo 1. Tous les services
echo 2. Config Server
echo 3. Discovery Server
echo 4. API Gateway
echo 5. User Service
echo 6. Auth Service
echo 7. Notification Service
echo 8. RabbitMQ
echo 9. PostgreSQL (Auth DB)
echo 10. PostgreSQL (User DB)
echo.

set /p choice="Entrez votre choix (1-10): "

if "%choice%"=="1" (
    echo Surveillance de tous les services...
    docker-compose logs -f
) else if "%choice%"=="2" (
    echo Surveillance du Config Server...
    docker-compose logs -f config-server
) else if "%choice%"=="3" (
    echo Surveillance du Discovery Server...
    docker-compose logs -f discovery-server
) else if "%choice%"=="4" (
    echo Surveillance de l'API Gateway...
    docker-compose logs -f api-gateway
) else if "%choice%"=="5" (
    echo Surveillance du User Service...
    docker-compose logs -f user-service
) else if "%choice%"=="6" (
    echo Surveillance de l'Auth Service...
    docker-compose logs -f auth-service
) else if "%choice%"=="7" (
    echo Surveillance du Notification Service...
    docker-compose logs -f notification-service
) else if "%choice%"=="8" (
    echo Surveillance de RabbitMQ...
    docker-compose logs -f rabbitmq
) else if "%choice%"=="9" (
    echo Surveillance de PostgreSQL Auth DB...
    docker-compose logs -f auth-service-db
) else if "%choice%"=="10" (
    echo Surveillance de PostgreSQL User DB...
    docker-compose logs -f user-service-db
) else (
    echo Choix invalide!
    pause
    exit /b 1
)
