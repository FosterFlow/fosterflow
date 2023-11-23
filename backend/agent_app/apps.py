from django.apps import AppConfig


class AgentAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'agent_app'

    def ready(self):
        import agent_app.signals  # Import signals to register them