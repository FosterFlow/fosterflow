from django.db import migrations
from django.db.models import Q

def set_addressee_agent(apps, schema_editor):
    Message = apps.get_model('message_app', 'Message')
    Agent = apps.get_model('agent_app', 'Agent')
    
    # Attempt to fetch the Agent with name='GPT 3.5 Turbo'
    addressee_agent_gpt35_turbo = Agent.objects.filter(name='GPT 3.5 Turbo').first()
    
    if addressee_agent_gpt35_turbo:
        # If the Agent exists, update all Message instances
        print("Agent with name='GPT 3.5 Turbo' exists.")
        Message.objects.filter(~Q(owner_agent_id=100)).update(addressee_agent_id=addressee_agent_gpt35_turbo)
        Message.objects.filter(owner_agent_id=100).update(owner_agent=addressee_agent_gpt35_turbo)
    else:
        # Log a warning or take other actions if the Agent does not exist
        print("Agent with name='GPT 3.5 Turbo' does not exist. No updates made to Message instances.")

    

class Migration(migrations.Migration):

    dependencies = [
        ('message_app', '0001_initial'),  # Adjust this to the correct dependency
        ('ai_model_app', '0002_add_gpt_models'),  # Ensure this migration runs after all Agent migrations
        
    ]

    operations = [
        migrations.RunPython(set_addressee_agent),
    ]
