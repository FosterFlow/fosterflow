from rest_framework import permissions
from agent_app.models import Agent
from user_agent_profile_app.models import UserAgentProfile

class IsOwnerOfAgentProfile(permissions.BasePermission):
    message = {"errors": {"details": ["Available only for the owner"]}}

    def has_permission(self, request, view):
        # Get the user from the request
        authenticated_user = request.user
        if not authenticated_user.is_authenticated:
            return False

        try:
            authenticated_user_agent = Agent.objects.get(user=authenticated_user)
        #TODO: return message if the obeject docent exists
        except Agent.DoesNotExist:
            return False
        
        profile_id = view.kwargs.get('pk')
        try:
            user_agent_profile = UserAgentProfile.objects.get(pk=profile_id)
            return user_agent_profile.user_agent == authenticated_user_agent
        #TODO: return message if the obeject docent exists
        except UserAgentProfile.DoesNotExist:
            return False
        
class IsOwnerOfAgent(permissions.BasePermission):
    message = {"errors": {"details": ["Available only for the owner"]}}

    def has_permission(self, request, view):
        # Get the user from the request
        authenticated_user = request.user
        if not authenticated_user.is_authenticated:
            return False
        
        agent_id = view.kwargs.get('agent_id')

        try:
            requested_user_agent = Agent.objects.get(pk=agent_id)
            return requested_user_agent.user == authenticated_user
        #TODO: return message if the obeject docent exists
        except Agent.DoesNotExist:
            return False