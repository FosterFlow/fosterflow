from rest_framework import permissions

class IsOwnerUser(permissions.BasePermission):
    message = {"errors": {"details": ["Available only for the owner"]}}

    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return True
