#!/bin/bash

#
# Script de lancement rapide des tests E2E Timely
#
# Usage:
#   ./e2e/RUN-TESTS.sh [smoke|auth|users|planning|reports|all]
#

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Tests E2E Timely - Playwright${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if services are running
check_services() {
    echo -e "${YELLOW}Vérification des services...${NC}"

    # Check frontend
    if curl -s http://localhost:4200 > /dev/null; then
        echo -e "${GREEN}✓ Frontend (localhost:4200) - OK${NC}"
    else
        echo -e "${RED}✗ Frontend (localhost:4200) - ERREUR${NC}"
        echo -e "${YELLOW}Démarrez le frontend: npm start${NC}"
        exit 1
    fi

    # Check gateway
    if curl -s http://localhost:8090/actuator/health > /dev/null; then
        echo -e "${GREEN}✓ Gateway (localhost:8090) - OK${NC}"
    else
        echo -e "${RED}✗ Gateway (localhost:8090) - ERREUR${NC}"
        echo -e "${YELLOW}Démarrez le gateway et les microservices${NC}"
        exit 1
    fi

    echo ""
}

# Run tests based on argument
run_tests() {
    local suite=${1:-all}

    case $suite in
        smoke)
            echo -e "${BLUE}Exécution des tests SMOKE (< 1 min)...${NC}"
            npm run e2e:smoke
            ;;
        auth)
            echo -e "${BLUE}Exécution des tests AUTHENTIFICATION...${NC}"
            npm run e2e:auth
            ;;
        users)
            echo -e "${BLUE}Exécution des tests UTILISATEURS...${NC}"
            npm run e2e:users
            ;;
        planning)
            echo -e "${BLUE}Exécution des tests PLANNING...${NC}"
            npm run e2e:planning
            ;;
        reports)
            echo -e "${BLUE}Exécution des tests RAPPORTS...${NC}"
            npm run e2e:reports
            ;;
        all)
            echo -e "${BLUE}Exécution de TOUS les tests E2E (~15 min)...${NC}"
            npm run e2e
            ;;
        *)
            echo -e "${RED}Suite inconnue: $suite${NC}"
            echo ""
            echo "Usage: $0 [smoke|auth|users|planning|reports|all]"
            echo ""
            echo "Exemples:"
            echo "  $0 smoke     - Tests smoke (rapide)"
            echo "  $0 auth      - Tests authentification"
            echo "  $0 all       - Tous les tests"
            exit 1
            ;;
    esac
}

# Show report if tests passed
show_report() {
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}   Tests terminés avec succès!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${YELLOW}Pour voir le rapport détaillé:${NC}"
    echo -e "  npm run e2e:report"
    echo ""
    echo -e "${YELLOW}Screenshots et vidéos:${NC}"
    echo -e "  e2e/screenshots/"
    echo -e "  e2e/videos/"
    echo ""
}

# Main execution
main() {
    check_services
    run_tests "${1:-all}"
    show_report
}

# Run main
main "$@"
