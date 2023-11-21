from django.contrib.auth import get_user_model
from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from .models import UserAgentProfile
from .permissions import IsOwnerAgent
from .serializers import UserAgentProfileSerializer, UserAgentProfileAvatarSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response

User = get_user_model()


class UserAgentProfilesModelViewSet(ModelViewSet):
    """
    Get, Update user's agent profile
    """

    queryset = UserAgentProfile.objects.all()
    serializer_class = UserAgentProfileSerializer
    permission_classes = (IsAuthenticated, IsOwnerAgent)
    http_method_names = ['get', 'patch', ]

    def partial_update(self, request, *args, **kwargs):
        user_agent_profile = get_object_or_404(UserAgentProfile, pk=kwargs['pk'])
        serializer = UserAgentProfileSerializer(user_agent_profile, data=request.data, partial=True)

        if serializer.is_valid():
            if request.user.id != user_agent_profile.user_id.id:
                return Response({"errors": {"details": ["Not found."]}}, status=status.HTTP_404_NOT_FOUND)
            serializer.save()
            return Response(serializer.data)
        errors = {"errors": {}}
        for error in serializer.errors:
            errors["errors"][error] = [serializer.errors[error][0]]
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        user_agent_profiles = UserAgentProfile.objects.all()
        profile_user_serializer = UserAgentProfileSerializer(
            instance=user_agent_profiles,
            many=True
        )
        return Response(profile_user_serializer.data, status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        try:
            profile_user = UserAgentProfile.objects.get(id=kwargs['pk'])
            profile_user_serializer = UserAgentProfileSerializer(
                instance=profile_user,
                many=False
            )
            return Response(profile_user_serializer.data, status.HTTP_200_OK)
        except Exception as e:
            return Response({"errors": {"details": e.args}}, status=status.HTTP_404_NOT_FOUND)


class SelfUserAgentProfilesAPIView(APIView):
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated, IsOwnerAgent)
    serializer_class = UserAgentProfileSerializer
    http_method_names = ['get']

    def get(self, request):
        user_id = User.objects.get(id=request.user.id)
        user_agent_profiles = UserAgentProfile.objects.get(user_id=user_id)
        profile_user_serializer = UserAgentProfileSerializer(
            instance=user_agent_profiles,
            many=False
        )
        return Response(profile_user_serializer.data, status.HTTP_200_OK)
    
class UserAgentProfileAvatarUpdateView(APIView):
    permission_classes = (IsAuthenticated, IsOwnerAgent)

    def patch(self, request, pk=None, *args, **kwargs):
        user_agent_profile = get_object_or_404(UserAgentProfile, pk=pk)
        serializer = UserAgentProfileAvatarSerializer(user_agent_profile, data=request.data, partial=True)

        if serializer.is_valid():
            if request.user.id != user_agent_profile.user_id.id:
                return Response({"errors": {"details": ["Not found."]}}, status=status.HTTP_404_NOT_FOUND)
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)