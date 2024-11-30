#!/bin/bash

echo "Choose an action:"
echo "1. Bring up services (Normal Build)"
echo "2. Bring up services (No Cache Build)"
echo "3. Bring down services and remove relevant images"

# Prompt the user for input
read -p "Enter your choice (1, 2, or 3): " ACTION

case $ACTION in
  1)
    echo "Bringing up services (Normal Build)..."
    docker compose up -d --build
    ;;
  2)
    echo "Building services with no cache..."
    docker compose build --no-cache
    echo "Bringing up services..."
    docker compose up -d
    ;;
  3)
    echo "Bringing down services and removing relevant images..."
    docker compose down -v
    # Remove images built by docker compose
    docker compose down --rmi local
    ;;
  *)
    echo "Invalid option. Please choose 1, 2, or 3."
    ;;
esac
