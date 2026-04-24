#!/bin/bash
set -euo pipefail

BACKUP_DIR="/data/backups/$(date +%Y-%m-%d)"
mkdir -p "$BACKUP_DIR"

PG_SERVICES=(auth-service-db user-service-db planning-service-db booking-service-db report-service-db agora-service-db)
PG_DATABASES=(auth-service-db user-service-db planning-service-db booking-service-db report-service-db agora-service-db)

for i in "${!PG_SERVICES[@]}"; do
  CONTAINER="${PG_SERVICES[$i]}"
  DB="${PG_DATABASES[$i]}"
  echo "Backup $DB..."
  docker exec "$CONTAINER" pg_dump -U admin "$DB" | gzip > "$BACKUP_DIR/$DB.sql.gz"
done

echo "Backup MongoDB..."
docker exec timely_ms_mongo_db mongodump --archive | gzip > "$BACKUP_DIR/mongodb.archive.gz"

find /data/backups -type d -mtime +7 -exec rm -rf {} + 2>/dev/null || true

echo "Backup terminé : $BACKUP_DIR"
