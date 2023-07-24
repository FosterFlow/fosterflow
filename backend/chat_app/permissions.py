from rest_framework import permissions
from .models import Chat


class IsOwnerDialog(permissions.BasePermission):
    message = {"errors": {"details": "Available only for the owner"}}

    def has_permission(self, request, view):
        """
        Check if the user has permission to access the view.

        For POST requests, the user must provide a 'user_id' field in the request data
        that matches their own user ID. For other methods, the user must be authenticated.

        Args:
            request (HttpRequest): The HTTP request object.
            view (View): The Django view being accessed.

        Returns:
            bool: True if the user has permission, False otherwise.
        """

        if request.method == 'POST':
            try:
                return request.user.id == request.data['user_id']
            except Exception as e:
                return False
        if request.user.is_authenticated:
            return True

    def has_object_permission(self, request, view, obj):
        """
        Check if the user has permission to access the object.

        The user must be the owner of the object (obj) in order to have permission.

        Args:
            request (HttpRequest): The HTTP request object.
            view (View): The Django view being accessed.
            obj: The object being accessed.

        Returns:
            bool: True if the user has permission, False otherwise.
        """

        return obj.user_id == request.user


class IsOwnerMessage(permissions.BasePermission):
    message = {"errors": {"details": "Available only for the owner"}}

    def has_permission(self, request, view):
        """
        Check if the user has permission to access the view.

        For POST requests, the user must provide a 'dialog_id' field in the request data
        that corresponds to a dialog associated with the authenticated user. For other methods,
        the user must be authenticated.

        Args:
            request (HttpRequest): The HTTP request object.
            view (View): The Django view being accessed.

        Returns:
            bool: True if the user has permission, False otherwise.
        """

        if request.method == 'POST':
            try:
                dialog_id = request.data['dialog_id']
                user_dialogs = Chat.objects.filter(user_id=request.user).values_list('id', flat=True)
                return dialog_id in user_dialogs
            except Exception as e:
                return False
        if request.user.is_authenticated:
            return True

    def has_object_permission(self, request, view, obj):
        """
        Check if the user has permission to access the object.

        The user must be the owner of the dialog associated with the object (obj)
        in order to have permission.

        Args:
            request (HttpRequest): The HTTP request object.
            view (View): The Django view being accessed.
            obj: The object being accessed.

        Returns:
            bool: True if the user has permission, False otherwise.
        """

        user_dialogs = Chat.objects.filter(user_id=request.user)
        if obj.dialog_id in user_dialogs:
            return True
