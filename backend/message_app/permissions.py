from rest_framework import permissions
from .models import Chat, Message

class IsOwnerMessage(permissions.BasePermission):
    message = {"errors": {"details": ["Available only for the owner"]}}

    def has_permission(self, request, view):
        """
        Check if the user has permission to access the view.
        """
        if request.method == 'POST':
            chat_id = request.data.get('chat_id')
            owner_agent_id = request.data.get('owner_agent_id')
            if chat_id and owner_agent_id:
                # Check if the agent exists and is associated with the user
                return Chat.objects.filter(
                    id=chat_id, 
                    agents__user=request.user, 
                    agents__id=owner_agent_id
                ).exists()
            return False
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        """
        Check if the user has permission to access the object.
        """
        # Check if the user is the owner or the addressee of the message
        return (obj.owner_agent_id and obj.owner_agent_id.user == request.user) or \
               (obj.addressee_agent_id and obj.addressee_agent_id.user == request.user)