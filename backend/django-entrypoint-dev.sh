#!/bin/sh

# Wait for the Postgres database to be ready
sh ./wait-for-postgres.sh

#create static files for django admin panel
python manage.py collectstatic --noinput 
# Apply database migrations
python manage.py migrate

# Check if DEBUG is set to "true"
if [ "$DEBUG" = "True" ]; then
    # Start the Django development server with debugpy
    python -m debugpy --wait-for-client --listen 0.0.0.0:5678 manage.py runserver $SERVER_API_URL --nothreading
else
    # Start the Django development server normally with auto-reloading
    python manage.py runserver $SERVER_API_URL
fi