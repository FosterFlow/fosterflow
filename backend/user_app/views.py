from django.contrib.auth import get_user_model
from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from .models import Agent
from .permissions import IsOwnerAgent, IsOwnerUser
from .serializers import CustomUserSerializer, AgentSerializer, SelfUserSerializer, UserAvatarSerializer
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

        return Response(user_serializer.data, status.HTTP_200_OK)


class UserAgentModelViewSet(ModelViewSet):
    """
    Get, Update user profile
    """

    queryset = Agent.objects.all()
    serializer_class = AgentSerializer
    permission_classes = (IsAuthenticated, IsOwnerAgent)
    http_method_names = ['get', 'patch', ]

    def partial_update(self, request, *args, **kwargs):
        agent = get_object_or_404(Agent, pk=kwargs['pk'])
        serializer = AgentSerializer(agent, data=request.data, partial=True)

        if serializer.is_valid():
            if request.user.id != agent.user_id.id:
                return Response({"errors": {"details": ["Not found."]}}, status=status.HTTP_404_NOT_FOUND)
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        agents = Agent.objects.all()
        agent_serializer = AgentSerializer(
            instance=agents,
            many=True
        )
        return Response(agent_serializer.data, status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        try:
            agent = Agent.objects.get(id=kwargs['pk'])
            agent_serializer = AgentSerializer(
                instance=agent,
                many=False
            )
            return Response(agent_serializer.data, status.HTTP_200_OK)
        except Exception as e:
            return Response({"errors": {"details": e.args}}, status=status.HTTP_404_NOT_FOUND)


class SelfAgentAPIView(APIView):
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated, IsOwnerAgent)
    serializer_class = AgentSerializer
    http_method_names = ['get']

    def get(self, request):
        user_id = User.objects.get(id=request.user.id)
        agent = Agent.objects.get(user_id=user_id)
        agent_serializer = AgentSerializer(
            instance=agent,
            many=False
        )
        return Response(agent_serializer.data, status.HTTP_200_OK)


class UserAvatarUpdateView(APIView):
    permission_classes = (IsAuthenticated, IsOwnerAgent)

    def patch(self, request, pk=None, *args, **kwargs):
        agent = get_object_or_404(Agent, pk=pk)
        serializer = UserAvatarSerializer(agent, data=request.data, partial=True)

        if serializer.is_valid():
            if request.user.id != agent.user_id.id:
                return Response({"errors": {"details": ["Not found."]}}, status=status.HTTP_404_NOT_FOUND)
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
