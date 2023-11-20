from rest_framework import generics
from .models import AiAgentProfileModel
from .serializers import AiAgentProfileSerializer

class AiAgentProfilesModelListView(generics.ListCreateAPIView):
    queryset = AiAgentProfileModel.objects.all()
    serializer_class = AiAgentProfileSerializer