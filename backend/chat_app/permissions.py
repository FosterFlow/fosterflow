from rest_framework import permissions
from agent_app.models import Agent
from django.shortcuts import get_object_or_404
from .models import Chat

class IsChatOwner(permissions.BasePermission):
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

        if request.method in permissions.SAFE_METHODS:
            # For safe methods (GET), check if the agent ID matches the logged-in user's agent
            chat_owner_agent_id = request.query_params.get('owner_agent_id')
            if chat_owner_agent_id:
                chat_owner_agent = get_object_or_404(Agent, pk=chat_owner_agent_id)
                return request.user == chat_owner_agent.user
            return False

        elif request.method in ['POST', 'DELETE']:
            # For POST and DELETE, check if the user is trying to modify their own chat
            chat_id = request.data.get('chat_id') if request.method == 'POST' else view.kwargs.get('pk')
            if chat_id:
                chat = get_object_or_404(Chat, pk=chat_id)
                return request.user == chat.owner_agent.user
            return False

        return False