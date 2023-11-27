from rest_framework.generics import RetrieveAPIView, UpdateAPIView
from .models import UserAgentProfile
from .serializers import UserAgentProfileSerializer, UserAgentProfileAvatarSerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import IsOwnerAgent

# Retrieve user agent profile by agent_id
class UserAgentProfileByAgentView(RetrieveAPIView):
    queryset = UserAgentProfile.objects.all()
    http_method_names = ['get']
    serializer_class = UserAgentProfileSerializer
    permission_classes = [IsAuthenticated, IsOwnerAgent]
    lookup_field = 'agent_id'

# Update user agent profile
class UserAgentProfileUpdateView(UpdateAPIView):
    http_method_names = ['patch']
    queryset = UserAgentProfile.objects.all()
    serializer_class = UserAgentProfileSerializer
    permission_classes = [IsAuthenticated, IsOwnerAgent]

# Update avatar for user agent profile
class UserAgentProfileAvatarUpdateView(UpdateAPIView):
    http_method_names = ['patch']
    queryset = UserAgentProfile.objects.all()
    serializer_class = UserAgentProfileAvatarSerializer
    permission_classes = [IsAuthenticated, IsOwnerAgent]
