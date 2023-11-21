from rest_framework import generics
from .models import AiAgentProfile
from .serializers import AiAgentProfileSerializer

class AiAgentProfilesModelListView(generics.ListCreateAPIView):
    queryset = AiAgentProfile.objects.all()
    serializer_class = AiAgentProfileSerializer