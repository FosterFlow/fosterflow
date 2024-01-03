# backend/chat_app/views.py
import environ
from django.contrib.auth import get_user_model
from .models import Chat
from .serializers import ChatModelSerializer
from rest_framework.generics import (
    ListAPIView, CreateAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView
)
from rest_framework.permissions import IsAuthenticated
from .permissions import IsChatOwner
from auth_app.permissions import IsEmailConfirmed
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from agent_app.models import Agent

User = get_user_model()

env = environ.Env()
environ.Env.read_env()

class ChatListView(ListAPIView):
    """
    View class for listing Chats.
    """
    queryset = Chat.objects.all()
    serializer_class = ChatModelSerializer
    permission_classes = [IsAuthenticated, IsChatOwner, IsEmailConfirmed]

    def get_queryset(self):
        chat_owner_agent_id = self.request.query_params.get('owner_agent_id')
        if chat_owner_agent_id is not None:
            return self.queryset.filter(owner_agent=chat_owner_agent_id)
        return Chat.objects.none()

class ChatCreateView(CreateAPIView):
    """
    View class for creating a new Chat.
    """
    queryset = Chat.objects.all()
    serializer_class = ChatModelSerializer
    permission_classes = [IsAuthenticated, IsChatOwner, IsEmailConfirmed]

class ChatDetailView(RetrieveAPIView):
    """
    View class for retrieving a Chat detail.
    """
    queryset = Chat.objects.all()
    serializer_class = ChatModelSerializer
    permission_classes = [IsAuthenticated, IsChatOwner, IsEmailConfirmed]

class ChatUpdateView(UpdateAPIView):
    """
    View class for updating a Chat.
    """
    queryset = Chat.objects.all()
    serializer_class = ChatModelSerializer
    permission_classes = [IsAuthenticated, IsChatOwner, IsEmailConfirmed]

class ChatDeleteView(DestroyAPIView):
    """
    View class for deleting a Chat.
    """
    queryset = Chat.objects.all()
    serializer_class = ChatModelSerializer
    permission_classes = [IsAuthenticated, IsChatOwner, IsEmailConfirmed]

    def destroy(self, request, *args, **kwargs):
        item = self.get_object()
        item.delete()
        return Response({'message': 'Chat deleted successfully'}, status=status.HTTP_200_OK)