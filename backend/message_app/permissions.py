from rest_framework import permissions
from django.shortcuts import get_object_or_404
from agent_app.models import Agent
from message_app.models import Message
from .models import Chat

class IsMessageOwner(permissions.BasePermission):
    message = {"errors": {"details": ["Available only for the owner"]}}

    def has_permission(self, request, view):
        """
        Check if the user has permission to access the chat based on ownership.

        Args:
            request (HttpRequest): The HTTP request object.
            view (View): The Django view being accessed.

        Returns:
            bool: True if the user has permission, False otherwise.
        """
        user = request.user
        user_agent = Agent.objects.get(user=user)

        if request.method in ['GET']:
            # For safe methods (GET), check if the agent ID matches the logged-in user's agent
            message_chat_id = request.query_params.get('chat_id')
            if message_chat_id:
                message_chat = get_object_or_404(Chat, pk=message_chat_id)
                if message_chat.owner_agent:
                    return user_agent == message_chat.owner_agent
            return False

        elif request.method in ['DELETE', 'PATCH']:
            # For DELETE, check if the user is trying to modify their own chat
            message_id = view.kwargs.get('pk')
            if message_id:
                message = get_object_or_404(Message, pk=message_id)
                chat = message.chat
                return user_agent == chat.owner_agent
            return False

        elif request.method in ['POST']:
            # For POST check if the user is trying to  their own chat
            message_owner_agent_id = request.data.get('owner_agent_id')
            if message_owner_agent_id:
                message_owner_agent = get_object_or_404(Agent, pk=message_owner_agent_id)
                return user_agent == message_owner_agent
            return False

        return False