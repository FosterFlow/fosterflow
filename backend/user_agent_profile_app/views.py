from rest_framework.generics import RetrieveAPIView, UpdateAPIView
from .models import UserAgentProfile
from .serializers import UserAgentProfileSerializer, UserAgentProfileAvatarSerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import IsOwnerAgent
from rest_framework import status
from rest_framework.response import Response

# Retrieve user agent profile by agent_id
class UserAgentProfileView(RetrieveAPIView):
    queryset = UserAgentProfile.objects.all()
    http_method_names = ['get']
    serializer_class = UserAgentProfileSerializer
    permission_classes = [IsAuthenticated, IsOwnerAgent]
    lookup_field = 'agent_id'

    def get_object(self):
        agent_id = self.request.query_params.get('agent_id')
        if agent_id is not None:
            return UserAgentProfile.objects.filter(agent_id=agent_id).first()
        else:
            return Response({"errors": {"details": ["Not found."]}}, status=status.HTTP_404_NOT_FOUND)

# Update user agent profile
class UserAgentProfileDetailsView(UpdateAPIView):
    http_method_names = ['patch']
    queryset = UserAgentProfile.objects.all()
    serializer_class = UserAgentProfileSerializer
    permission_classes = [IsAuthenticated, IsOwnerAgent]

# Update avatar for user agent profile
class UserAgentProfileAvatarView(UpdateAPIView):
    http_method_names = ['patch']
    queryset = UserAgentProfile.objects.all()
    serializer_class = UserAgentProfileAvatarSerializer
    permission_classes = [IsAuthenticated, IsOwnerAgent]