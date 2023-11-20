from rest_framework import serializers
from .models import AiModels


class AiModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = AiModels
        fields = '__all__'