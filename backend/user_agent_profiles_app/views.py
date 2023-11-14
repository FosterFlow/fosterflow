from django.contrib.auth import get_user_model
from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from .models import ProfileUser
from .permissions import IsOwnerAgent
from .serializers import ProfileUserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response

User = get_user_model()


class ProfileUserModelViewSet(ModelViewSet):
    """
    Get, Update user profile
    """

    queryset = ProfileUser.objects.all()
    serializer_class = ProfileUserSerializer
    permission_classes = (IsAuthenticated, IsOwnerAgent)
    http_method_names = ['get', 'patch', ]

    def partial_update(self, request, *args, **kwargs):
        profile_user = get_object_or_404(ProfileUser, pk=kwargs['pk'])
        serializer = ProfileUserSerializer(profile_user, data=request.data, partial=True)

        if serializer.is_valid():
            if request.user.id != profile_user.user_id.id:
                return Response({"errors": {"details": ["Not found."]}}, status=status.HTTP_404_NOT_FOUND)
            serializer.save()
            return Response(serializer.data)
        errors = {"errors": {}}
        for error in serializer.errors:
            errors["errors"][error] = [serializer.errors[error][0]]
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        profiles_user = ProfileUser.objects.all()
        profile_user_serializer = ProfileUserSerializer(
            instance=profiles_user,
            many=True
        )
        return Response(profile_user_serializer.data, status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        try:
            profile_user = ProfileUser.objects.get(id=kwargs['pk'])
            profile_user_serializer = ProfileUserSerializer(
                instance=profile_user,
                many=False
            )
            return Response(profile_user_serializer.data, status.HTTP_200_OK)
        except Exception as e:
            return Response({"errors": {"details": e.args}}, status=status.HTTP_404_NOT_FOUND)


class SelfProfileUserAPIView(APIView):
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated, IsOwnerAgent)
    serializer_class = ProfileUserSerializer
    http_method_names = ['get']

    def get(self, request):
        user_id = User.objects.get(id=request.user.id)
        profile_user = ProfileUser.objects.get(user_id=user_id)
        profile_user_serializer = ProfileUserSerializer(
            instance=profile_user,
            many=False
        )
        return Response(profile_user_serializer.data, status.HTTP_200_OK)