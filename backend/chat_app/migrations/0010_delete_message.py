# Generated by Django 4.2.1 on 2023-11-02 18:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat_app', '0009_add_Gpts_models'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Message',
        ),
    ]
