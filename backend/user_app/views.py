from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from .models import Agent
from .permissions import IsOwnerProfile, IsOwnerUser
from .serializers import CustomUserSerializer, ProfileSerializer, SelfUserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response

User = get_user_model()


class UserModelViewSet(ModelViewSet):
    """
    Get, Update user information
    """
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated, IsOwnerUser)
    serializer_class = CustomUserSerializer
    http_method_names = ['get', 'patch', 'delete']

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if request.user.id == instance.id:
            instance.is_active = False
            instance.save()
            response = {
                'message': 'User inactive successfully',
            }
            return Response(response, status=status.HTTP_200_OK)
        return Response({"errors": {"details": ["Not found."]}}, status=status.HTTP_404_NOT_FOUND)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()

        if request.user.id == instance.id:
            return super().update(request, *args, **kwargs)
        return Response({"errors": {"details": ["Not found."]}}, status=status.HTTP_404_NOT_FOUND)


class SelfUserAPIView(APIView):
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated, IsOwnerUser)
    serializer_class = SelfUserSerializer
    http_method_names = ['get']

    def get(self, request, format=None):
        user = User.objects.get(id=request.user.id)
        user_serializer = SelfUserSerializer(
            instance=user,
            many=False
        )

        print(user_serializer)
        return Response(user_serializer.data, status.HTTP_200_OK)


class UserProfileModelViewSet(ModelViewSet):
    """
    Get, Update user profile
    """

    queryset = Agent.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = (IsAuthenticated, IsOwnerProfile)
    http_method_names = ['get', 'patch', ]

    def partial_update(self, request, *args, **kwargs):
        print(request.data)
        instance = self.get_object()
        kwargs['partial'] = True

        if request.user.id == instance.user_id.id:
            return super().update(request, *args, **kwargs)
        return Response({"errors": {"details": ["Not found."]}}, status=status.HTTP_404_NOT_FOUND)


class SelfProfileAPIView(APIView):
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated, IsOwnerProfile)
    serializer_class = ProfileSerializer
    http_method_names = ['get']

    def get(self, request):
        user_id = User.objects.get(id=request.user.id)
        profile = Agent.objects.get(user_id=user_id)
        profile_serializer = ProfileSerializer(
            instance=profile,
            many=False
        )

        print(profile_serializer)
        return Response(profile_serializer.data, status.HTTP_200_OK)
