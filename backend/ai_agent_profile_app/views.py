from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from .models import AiAgentProfile
from .serializers import AiAgentProfileSerializer

# TODO: add get method
class AiAgentProfileDetailsView(RetrieveAPIView):
    http_method_names = ['get']
    queryset = AiAgentProfile.objects.all()
    serializer_class = AiAgentProfileSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'ai_agent_id'  # Adjust if the field name is different
    lookup_url_kwarg = 'agent_id'   # The name of the URL parameter