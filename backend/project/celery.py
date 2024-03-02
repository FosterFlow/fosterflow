"""
https://docs.celeryproject.org/en/stable/django/first-steps-with-django.html
"""
import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")
app = Celery("Fosterflow")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
