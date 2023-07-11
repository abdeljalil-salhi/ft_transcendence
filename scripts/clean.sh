#!/bin/bash
RED='\033[0;31m'
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
RESET='\033[0m'
if [[ $1 == "bdd" ]]; then
    echo "${ORANGE}Cleaning all containers and volumes${RESET}" &&
        docker-compose down &&
        docker volume prune -f
    if [ $? -eq 0 ]; then
        echo "${GREEN}Cleanup success${RESET}"
    else
        echo "${RED}Cleanup failed${RESET}"
    fi
elif [[ $1 == "all" ]]; then
    echo "${ORANGE}Cleaning all containers and volumes${RESET}" &&
        docker-compose down &&
        docker volume prune -f &&
        echo "${ORANGE}Cleaning all network${RESET}" &&
        docker network prune -f &&
        echo "${ORANGE}Deleting node_modules${RESET}" &&
        du -sh */node_modules &&
        rm -rf */node_modules */*lock* */dist
    if [ $? -eq 0 ]; then
        echo "${GREEN}Cleanup success${RESET}"
    else
        echo "${RED}Cleanup failed${RESET}"
    fi
else
    echo "Usage: ./clean.sh [bdd|all]"
fi
