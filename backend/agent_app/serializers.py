from rest_framework import serializers
from .models import Agent

class AgentSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    ai_model_id = serializers.IntegerField(source='ai_model.id', read_only=True)

    class Meta:
        model = Agent
        fields = ['id', 'name', 'created_at', 'updated_at', 'is_active', 'user_id', 'ai_model_id']