#!/bin/sh

sh ./wait-for-postgres.sh

python manage.py migrate

#gunicorn picasso.wsgi --bind 0.0.0.0:8000
python manage.py runserver 0.0.0.0:8000
