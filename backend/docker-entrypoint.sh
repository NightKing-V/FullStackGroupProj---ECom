#!/bin/sh

# Wait for MongoDB to be active
echo "Checking MongoDB connection..."
MAX_RETRIES=10
RETRY_DELAY=5
RETRIES=0

while ! nc -z mongodb 27017; do
  RETRIES=$((RETRIES + 1))
  if [ $RETRIES -ge $MAX_RETRIES ]; then
    echo "MongoDB is sleeping. Could not establish a connection."
    exit 1
  fi
  echo "MongoDB is not yet available. Retrying in $RETRY_DELAY seconds..."
  sleep $RETRY_DELAY
done

echo "MongoDB connection established."

# Check if DB_SEED is true
if [ "$DB_SEED" = "true" ]; then
  echo "DB_SEED is set to true. Running migrations..."
  npm run migrate
else
  echo "DB_SEED is not set to true. Skipping migrations."
fi

# Start the application
echo "Starting the application with npm start..."
npm start
