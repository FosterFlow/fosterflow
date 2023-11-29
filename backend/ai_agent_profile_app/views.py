from rest_framework import generics
from .models import AiAgentProfile
from .serializers import AiAgentProfileSerializer

# TODO: add get method
class AiAgentProfileDetailsView(generics.ListCreateAPIView):
    serializer_class = AiAgentProfileSerializer