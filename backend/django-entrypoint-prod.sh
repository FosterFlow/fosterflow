#!/bin/sh

sh ./wait-for-postgres.sh

python manage.py migrate

python manage.py runserver $SERVER_API_URL

