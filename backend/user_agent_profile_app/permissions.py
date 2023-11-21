from rest_framework import permissions

class IsOwnerAgent(permissions.BasePermission):
    message = {"errors": {"details": ["Available only for the owner"]}}

    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return True