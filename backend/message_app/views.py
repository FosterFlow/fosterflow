# backend/message_app/views.py
import environ
from django.contrib.auth import get_user_model
from .models import Message
from .permissions import IsOwnerMessage
from .serializers import MessageModelSerializer
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView
from rest_framework import status
from rest_framework.response import Response
from auth_app.permissions import IsEmailConfirm
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
    permission_classes = [IsOwnerMessage, IsEmailConfirm]

    def get_queryset(self):
        """
        Get the queryset of Message objects.
        """
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
    permission_classes = [IsOwnerMessage, IsEmailConfirm]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            # Assuming send_feedback_ai_task is a task for processing AI responses.
            send_feedback_ai_task.delay({'message_id': instance.id, })
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MessageDeleteView(DestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageModelSerializer
    permission_classes = [IsOwnerMessage, IsEmailConfirm]

    def destroy(self, request, *args, **kwargs):
        item = self.get_object()
        item.delete()
        return Response({'message': 'Message deleted successfully'}, status=status.HTTP_200_OK)