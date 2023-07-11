#!/bin/bash
echo "Starting server..."
docker-compose down
docker-compose up --build