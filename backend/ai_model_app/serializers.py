from rest_framework import serializers
from .models import AiModel


class AiModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = AiModel
        fields = '__all__'