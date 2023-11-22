from rest_framework import generics
from .models import AiModel
from .serializers import AiModelSerializer


class AiModelListView(generics.ListCreateAPIView):
    queryset = AiModel.objects.all()
    serializer_class = AiModelSerializer