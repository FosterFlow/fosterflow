from rest_framework import permissions
from .models import Chat

class IsOwnerMessage(permissions.BasePermission):
    message = {"errors": {"details": ["Available only for the owner"]}}

    def has_permission(self, request, view):
        """
        Check if the user has permission to access the view.

        For POST requests, the user must provide a 'chat_id' field in the request data
        that corresponds to a chat associated with the authenticated user. For other methods,
        the user must be authenticated.

        Args:
            request (HttpRequest): The HTTP request object.
            view (View): The Django view being accessed.

        Returns:
            bool: True if the user has permission, False otherwise.
        """

        if request.method == 'POST':
            try:
                chat_id = request.data['chat_id']
                if request.data['owner_id'] == request.user.id:
                    agent_chats = Chat.objects.filter(owner_id_id=request.data['owner_id']).values_list('id', flat=True)

                    return chat_id in agent_chats
                else:
                    return False
            except Exception as e:
                return False
        if request.user.is_authenticated:
            return True

    def has_object_permission(self, request, view, obj):
        """
        Check if the user has permission to access the object.

        The user must be the owner of the chat associated with the object (obj)
        in order to have permission.

        Args:
            request (HttpRequest): The HTTP request object.
            view (View): The Django view being accessed.
            obj: The object being accessed.

        Returns:
            bool: True if the user has permission, False otherwise.
        """

        owner_chats = Chat.objects.filter(owner_id_id=request.user.id)
        if obj.chat_id in owner_chats:
            return True

        addressee_chats = Chat.objects.filter(addressee_id_id=request.user.id)
        if obj.chat_id in addressee_chats:
            return True
