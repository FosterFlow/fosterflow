from rest_framework import serializers
from .models import NlpModel, ProfileModel


class NlpModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = NlpModel
        fields = '__all__'


class ProfileModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileModel
        fields = '__all__'
