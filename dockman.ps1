# Prompt the user for input
Write-Host "Choose an action:"
Write-Host "1. Bring up services (Normal Build)"
Write-Host "2. Bring up services (No Cache Build)"
Write-Host "3. Bring down services and remove relevant images"

# Get user input
$action = Read-Host "Enter your choice (1, 2, or 3)"

switch ($action) {
    1 {
        Write-Host "Bringing up services (Normal Build)..."
        docker compose up -d --build
    }
    2 {
        Write-Host "Building services with no cache..."
        docker compose build --no-cache
        Write-Host "Bringing up services..."
        docker compose up -d
    }
    3 {
        Write-Host "Bringing down services and removing relevant images..."
        docker compose down -v
        # Remove images built by docker compose
        docker compose down --rmi local
    }
    default {
        Write-Host "Invalid option. Please choose 1, 2, or 3."
    }
}
