#!/bin/sh

sh ./wait-for-postgres.sh

#create static files for django admin panel
python manage.py collectstatic

python manage.py migrate

python manage.py runserver $SERVER_API_URL