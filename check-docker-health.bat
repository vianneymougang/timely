@echo off
echo ========================================
echo Verification de la sante des services Docker
echo ========================================
echo.

echo Etat des conteneurs:
docker-compose ps

echo.
echo ========================================
echo Verification des healthchecks:
echo ========================================
echo.

echo Config Server (8888):
curl -s http://localhost:8888/actuator/health || echo [ERREUR] Config Server non accessible

echo.
echo Discovery Server (8761):
curl -s http://localhost:8761/actuator/health || echo [ERREUR] Discovery Server non accessible

echo.
echo API Gateway (8090):
curl -s http://localhost:8090/actuator/health || echo [ERREUR] API Gateway non accessible

echo.
echo User Service (8092):
curl -s http://localhost:8092/actuator/health || echo [ERREUR] User Service non accessible

echo.
echo Auth Service (8091):
curl -s http://localhost:8091/actuator/health || echo [ERREUR] Auth Service non accessible

echo.
echo Notification Service (8093):
curl -s http://localhost:8093/actuator/health || echo [ERREUR] Notification Service non accessible

echo.
echo ========================================
echo Verification terminee
echo ========================================
echo.

pause