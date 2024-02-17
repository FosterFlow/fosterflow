from rest_framework import serializers
from .models import AiAgentProfile

class AiAgentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AiAgentProfile
        fields = ('ai_agent_id', 'description', 'avatar')
