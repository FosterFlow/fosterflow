from rest_framework import permissions


class IsOwnerAgent(permissions.BasePermission):
    message = {"errors": {"forbidden": "Available only for the owner"}}

    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return True


class IsOwnerUser(permissions.BasePermission):
    message = {"errors": {"forbidden": "Available only for the owner"}}

    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return True
