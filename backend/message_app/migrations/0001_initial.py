# Generated by Django 4.2.1 on 2024-02-22 09:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('agent_app', '0001_initial'),
        ('chat_app', '0002_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message_text', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('addressee_agent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='addresse_agent_messages', to='agent_app.agent')),
                ('chat', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='chat_app.chat')),
                ('owner_agent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='agent_app.agent')),
                ('request', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='request_messages', to='message_app.message')),
            ],
        ),
    ]
