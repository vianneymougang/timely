@echo off
echo ========================================
echo Reconstruction des services Docker Timely
echo ========================================
echo.

echo CORRECTIONS APPLIQUEES:
echo - Installation de curl dans tous les Dockerfiles
echo - Augmentation des timeouts healthcheck (30s interval, 60s start_period)
echo - Augmentation des retries (10 au lieu de 5)
echo - Suppression de la dependance circulaire api-gateway dans user-service
echo - Suppression de la dependance api-gateway dans auth-service
echo.

echo Etape 1: Arret de tous les conteneurs...
docker-compose down

echo.
echo Etape 2: Suppression des anciennes images...
docker-compose rm -f

echo.
echo Etape 3: Reconstruction des images (cela peut prendre plusieurs minutes)...
docker-compose build --no-cache

echo.
echo Etape 4: Demarrage des services...
docker-compose up -d

echo.
echo Etape 5: Verification de l'etat des services...
timeout /t 10 /nobreak >nul
docker-compose ps

echo.
echo ========================================
echo ORDRE DE DEMARRAGE:
echo ========================================
echo 1. Bases de donnees (PostgreSQL, MongoDB)
echo 2. RabbitMQ
echo 3. Config Server
echo 4. Discovery Server
echo 5. API Gateway
echo 6. User Service
echo 7. Auth Service
echo 8. Notification Service
echo.
echo Pour voir les logs en temps reel:
echo   docker-compose logs -f [nom-du-service]
echo.
echo Pour verifier la sante des services:
echo   docker-compose ps
echo.
echo Services disponibles:
echo - Config Server: http://localhost:8888
echo - Discovery Server: http://localhost:8761
echo - API Gateway: http://localhost:8090
echo - Auth Service: http://localhost:8091
echo - User Service: http://localhost:8092
echo - Notification Service: http://localhost:8093
echo - RabbitMQ Management: http://localhost:15672 (admin/password)
echo - PgAdmin: http://localhost:5050
echo ========================================