# backend/message_app/views.py
import environ
from django.contrib.auth import get_user_model
from .models import Message
from .permissions import IsMessageOwner
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
    permission_classes = [IsMessageOwner, IsEmailConfirmed]

    def get_queryset(self):
        chat_id = self.request.query_params.get('chat_id')
        if chat_id:
            agent_messages = self.queryset.filter(
                Q(chat=chat_id),
            )
            if not agent_messages.exists():
                raise NotFound({"errors": {"details": ["No messages found for the given chat_id."]}})
            return agent_messages

class MessageCreateView(CreateAPIView):
    queryset = Message.objects.filter()
    serializer_class = MessageModelSerializer
    permission_classes = [IsMessageOwner, IsEmailConfirmed]

    def perform_create(self, serializer):
        user_agent = Agent.objects.get(user=self.request.user)
        instance = serializer.save(owner_agent=user_agent)
        send_feedback_ai_task.delay({'message_id': instance.id, })

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def get_queryset(self):
        chat_id = self.request.query_params.get('chat_id')
        if chat_id:
            messages = self.queryset.filter(
                Q(chat=chat_id),
            )
            if not messages.exists():
                raise NotFound({"errors": {"details": ["No messages found for the given chat_id."]}})
            return messages

class MessageDetailView(RetrieveAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageModelSerializer
    permission_classes = [IsMessageOwner, IsEmailConfirmed]

class MessageUpdateView(UpdateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageModelSerializer
    permission_classes = [IsMessageOwner, IsEmailConfirmed]

class MessageDeleteView(DestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageModelSerializer
    permission_classes = [IsMessageOwner, IsEmailConfirmed]

    def destroy(self, request, *args, **kwargs):
        item = self.get_object()
        item.delete()
        return Response({'message': 'Message deleted successfully'}, status=status.HTTP_200_OK)