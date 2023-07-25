# Generated by Django 4.2.1 on 2023-07-25 12:54

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='EmailConfirmationToken',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('key', models.CharField(db_index=True, max_length=64, unique=True)),
            ],
            options={
                'verbose_name': 'Email Confirm Token',
                'verbose_name_plural': 'Email Confirm Tokens',
            },
        ),
    ]
