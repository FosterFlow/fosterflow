# backend/chat_app/views.py
import environ
from django.contrib.auth import get_user_model
from .models import Chat
from .serializers import ChatModelSerializer
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from .permissions import IsOwnerChat, IsEmailConfirm
from rest_framework import status
from rest_framework.response import Response

User = get_user_model()

env = environ.Env()
environ.Env.read_env()

class ChatListView(ListAPIView):
    """
    View class for listing Chats.
    """
    queryset = Chat.objects.all()
    serializer_class = ChatModelSerializer
    permission_classes = [IsAuthenticated, IsOwnerChat, IsEmailConfirm]

    def get_queryset(self):
        chat_owner_agent_id = self.request.query_params.get('owner_agent_id')
        if chat_owner_agent_id is not None:
            return self.queryset.filter(owner_agent_id=chat_owner_agent_id)
        return Chat.objects.none()

class ChatCreateView(CreateAPIView):
    """
    View class for creating a new Chat.
    """
    queryset = Chat.objects.all()
    serializer_class = ChatModelSerializer
    permission_classes = [IsAuthenticated, IsOwnerChat, IsEmailConfirm]

    def perform_create(self, serializer):
        serializer.save(owner_agent=self.request.user.agent)

class ChatDeleteView(DestroyAPIView):
    """
    View class for deleting a Chat.
    """
    queryset = Chat.objects.all()
    serializer_class = ChatModelSerializer
    permission_classes = [IsAuthenticated, IsOwnerChat, IsEmailConfirm]

    def destroy(self, request, *args, **kwargs):
        item = self.get_object()
        item.delete()
        return Response({'message': 'Chat deleted successfully'}, status=status.HTTP_200_OK)