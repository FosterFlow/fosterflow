from rest_framework import generics
from .models import AiAgentProfile
from .serializers import AiAgentProfileSerializer

# TODO: add get method
class AiAgentProfileView(generics.ListCreateAPIView):
    serializer_class = AiAgentProfileSerializer