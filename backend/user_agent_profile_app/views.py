from rest_framework.generics import RetrieveAPIView, UpdateAPIView
from .models import UserAgentProfile
from .serializers import UserAgentProfileSerializer, UserAgentProfileAvatarSerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import IsOwnerOfAgentProfile, IsOwnerOfAgent

# Retrieve user agent profile by agent_id
class UserAgentProfileByAgentIdView(RetrieveAPIView):
    queryset = UserAgentProfile.objects.all()
    serializer_class = UserAgentProfileSerializer
    permission_classes = [IsAuthenticated, IsOwnerOfAgent]
    lookup_field = 'user_agent_id'  # Adjust if the field name is different
    lookup_url_kwarg = 'agent_id'   # The name of the URL parameter
        
# Update user agent profile
class UserAgentProfileDetailsView(UpdateAPIView):
    http_method_names = ['patch']
    queryset = UserAgentProfile.objects.all()
    serializer_class = UserAgentProfileSerializer
    permission_classes = [IsAuthenticated, IsOwnerOfAgentProfile]

# Update avatar for user agent profile
class UserAgentProfileAvatarView(UpdateAPIView):
    http_method_names = ['patch']
    queryset = UserAgentProfile.objects.all()
    serializer_class = UserAgentProfileAvatarSerializer
    permission_classes = [IsAuthenticated, IsOwnerOfAgentProfile]