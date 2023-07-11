#!/bin/bash
GREEN='\033[0;32m'
RESET='\033[0m'
echo "${GREEN}Starting server...${RESET}"
docker-compose down
docker-compose up --build
