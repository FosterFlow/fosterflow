from rest_framework import permissions
from .models import Message
from agent_app.models import Agent
from django.shortcuts import get_object_or_404

class IsOwnerMessage(permissions.BasePermission):
    message = {"errors": {"details": ["Available only for the owner"]}}

    def has_permission(self, request, view):
        """
        Check if the user has permission to access the view.
        """
        if request.method in ['POST', 'PATCH']:
            chat_id = request.data.get('chat_id')
            owner_agent_id = request.data.get('owner_agent_id')
            if chat_id and owner_agent_id:
                # Check if the agent exists and is associated with the user
                agent = get_object_or_404(Agent, pk=owner_agent_id, user=request.user)
                return Message.objects.filter(
                    chat_id=chat_id, 
                    owner_agent=agent
                ).exists()
            return False
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        """
        Check if the user has permission to access the object.
        """
        if request.method in ['GET', 'DELETE']:
            # Check if the user is the owner or the addressee of the message
            return (obj.owner_agent and obj.owner_agent.user == request.user) or \
                   (obj.addressee_agent and obj.addressee_agent.user == request.user)
        return True