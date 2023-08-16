#!/bin/sh
# wait-for-postgres.sh
set -e
host="$1"
shift
cmd="$@"
until PGPASSWORD="user" psql -h "$host" -d "library" -U "password" -c '\q';>
>&2 echo "Postgres is unavailable - sleeping"
sleep 1
done
>&2 echo "Postgres is up - executing command"
exec $cmd
