from rest_framework import permissions
from agent_app.models import Agent
from django.shortcuts import get_object_or_404

class IsOwnerChat(permissions.BasePermission):
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

        chat_owner_agent_id = request.query_params.get('owner_agent_id')

        if chat_owner_agent_id:
            # Using get_object_or_404 to gracefully handle Agent not found scenarios
            chat_owner_agent = get_object_or_404(Agent, pk=chat_owner_agent_id)
            return request.user == chat_owner_agent.user
        return False