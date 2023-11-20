from rest_framework import serializers
from .models import AiAgentProfileModel

class AiAgentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AiAgentProfileModel
        fields = '__all__'
