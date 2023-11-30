from rest_framework import permissions
from agent_app.models import Agent

class IsOwnerAgent(permissions.BasePermission):
    message = {"errors": {"details": ["Available only for the owner"]}}

    def has_permission(self, request, view):
        # Get the user from the request
        user = request.user

        # Ensure the user is authenticated
        if not user.is_authenticated:
            return False

        # Fetch the agent associated with the user
        # Assuming a direct ForeignKey relationship from Agent to User
        try:
            agent = Agent.objects.get(user=user)
            return True
        except Agent.DoesNotExist:
            # Return False if no agent is associated with the user
            return False