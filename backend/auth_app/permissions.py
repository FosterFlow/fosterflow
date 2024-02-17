from rest_framework import permissions


class IsEmailConfirmed(permissions.BasePermission):
    message = {"errors": {"details": "Available only for confirm User"}}

    def has_permission(self, request, view):
        if request.user.is_email_confirmed:
            return True
