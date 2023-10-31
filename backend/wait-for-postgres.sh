#!/bin/bash

until PGPASSWORD=$POSTGRES_PASSWORD psql -h $SQL_HOST -d $SQL_DATABASE -U $POSTGRES_USER; do
  echo >&2 "$(date +%Y%m%dt%H%M%S) Postgres is unavailable - sleeping"
  sleep 1
done

echo >&2 "$(date +%Y%m%dt%H%M%S) Postgres is up - executing command"