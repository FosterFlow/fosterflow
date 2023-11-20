from rest_framework import generics
from .models import NlpModel, ProfileModel
from .serializers import NlpModelSerializer, ProfileModelSerializer


class NlpModelListView(generics.ListCreateAPIView):
    queryset = NlpModel.objects.all()
    serializer_class = NlpModelSerializer


class ProfileModelListView(generics.ListCreateAPIView):
    queryset = ProfileModel.objects.all()
    serializer_class = ProfileModelSerializer
