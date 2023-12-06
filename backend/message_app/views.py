# backend/message_app/views.py
import environ
from django.contrib.auth import get_user_model
from .models import Message
from .permissions import IsOwnerMessage
from .serializers import MessageModelSerializer
from rest_framework.generics import (
    ListAPIView, CreateAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView
)
from rest_framework import status
from rest_framework.response import Response
from auth_app.permissions import IsEmailConfirmed
from rest_framework.exceptions import NotFound
from django.db.models import Q
from agent_app.models import Agent
from .tasks import send_feedback_ai_task

User = get_user_model()

env = environ.Env()
environ.Env.read_env()

class MessageListView(ListAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageModelSerializer
    permission_classes = [IsOwnerMessage, IsEmailConfirmed]

    def get_queryset(self):
        user_agent = Agent.objects.get(user=self.request.user)
        chat_id = self.request.query_params.get('chat_id')
        if chat_id:
            agent_messages = self.queryset.filter(
                Q(chat_id=chat_id),
                Q(owner_agent_id=user_agent) | Q(addressee_agent_id=user_agent)
            )
            if not agent_messages.exists():
                raise NotFound({"errors": {"details": ["No messages found for the given chat_id and agent."]}})
            return agent_messages

class MessageCreateView(CreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageModelSerializer
    permission_classes = [IsOwnerMessage, IsEmailConfirmed]

    def perform_create(self, serializer):
        serializer.save(owner_agent=self.request.user.agent)

class MessageDetailView(RetrieveAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageModelSerializer
    permission_classes = [IsOwnerMessage, IsEmailConfirmed]

class MessageUpdateView(UpdateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageModelSerializer
    permission_classes = [IsOwnerMessage, IsEmailConfirmed]

class MessageDeleteView(DestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageModelSerializer
    permission_classes = [IsOwnerMessage, IsEmailConfirmed]

    def destroy(self, request, *args, **kwargs):
        item = self.get_object()
        item.delete()
        return Response({'message': 'Message deleted successfully'}, status=status.HTTP_200_OK)