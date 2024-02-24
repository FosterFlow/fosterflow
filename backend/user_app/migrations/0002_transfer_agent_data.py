from django.db import migrations

def transfer_agents(apps, schema_editor):
    OldAgent = apps.get_model('user_app', 'Agent')
    NewAgent = apps.get_model('agent_app', 'Agent')
    UserAgentProfile = apps.get_model('user_agent_profile_app', 'UserAgentProfile')
    
    # Ensure the NewAgent table is initially empty
    assert NewAgent.objects.count() == 0, "NewAgent table is not empty!"
    
    last_id = 0  # Track the last ID processed
    for old_agent in OldAgent.objects.order_by('id'):
        # Fill the gap with empty instances if necessary
        while last_id + 1 < old_agent.id:
            last_id += 1
            NewAgent.objects.create()  # Create an empty instance with the missing ID
        
        # Create a new agent matching the old agent's ID
        new_agent = NewAgent.objects.create(
            user_id=old_agent.user_id_id,
            name=old_agent.first_name + " " + old_agent.last_name
        )
        
        UserAgentProfile.objects.create(
            user_agent=new_agent,
            avatar=old_agent.avatar,
            first_name=old_agent.first_name,
            last_name=old_agent.last_name,
        )
        last_id = old_agent.id  # Update the last ID processed

class Migration(migrations.Migration):

    dependencies = [
        ('agent_app', '0001_initial'),
        ('user_app', '0001_initial'),
        ('user_agent_profile_app', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(transfer_agents),
    ]