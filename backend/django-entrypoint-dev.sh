#!/bin/sh

# Wait for the Postgres database to be ready
sh ./wait-for-postgres.sh

# Apply database migrations
python manage.py migrate

# Start the Django development server with debugpy
# debugpy will listen on port 5678 for a debugger connection
python -m debugpy --wait-for-client --listen 0.0.0.0:5678 manage.py runserver $SERVER_API_URL