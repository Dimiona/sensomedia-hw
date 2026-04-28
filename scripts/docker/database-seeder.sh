#!/bin/bash
set -e

ROOT_ENV_FILE="$(dirname "$0")/../../.env"
echo $ROOT_ENV_FILE
if [ ! -f "$ROOT_ENV_FILE" ]; then
  echo "The .env file was not found!"
  exit 1
fi

export $(grep -v '^#' "$ROOT_ENV_FILE" | xargs)

CONTAINER_NAME="mongodb"
EVENTS_JSON_FILE="$(dirname "$0")/events.json"

echo "Copying over events.json file to MongoDB container.."
docker cp "$EVENTS_JSON_FILE" ${CONTAINER_NAME}:/tmp/events.json

echo "Importing events.json via docker exec & mongoimport.."
docker exec ${CONTAINER_NAME} mongoimport \
  --username="$MONGO_INITDB_ROOT_USERNAME" \
  --password="$MONGO_INITDB_ROOT_PASSWORD" \
  --authenticationDatabase=admin \
  --db="$MONGO_INITDB_DATABASE" \
  --collection=events \
  --file=/tmp/events.json \
  --jsonArray \
  --drop

echo "Deleting events.json from container.."
docker exec ${CONTAINER_NAME} rm /tmp/events.json

echo "Events collection has been seeded successfully."
