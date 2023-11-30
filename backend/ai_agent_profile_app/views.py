from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import AiAgentProfile
from .serializers import AiAgentProfileSerializer

# TODO: add get method
class AiAgentProfileDetailsView(generics.ListCreateAPIView):
    http_method_names = ['get']
    queryset = AiAgentProfile.objects.all()
    serializer_class = AiAgentProfileSerializer
    permission_classes = [IsAuthenticated]