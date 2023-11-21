from rest_framework import serializers
from .models import AiAgentProfile

class AiAgentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AiAgentProfile
        fields = '__all__'
