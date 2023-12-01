import environ
from django.contrib.auth import get_user_model
from .permissions import IsOwnerChat
from .models import Chat
from .serializers import ChatModelSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.response import Response
from auth_app.permissions import IsEmailConfirm
from rest_framework.permissions import IsAuthenticated

User = get_user_model()

env = environ.Env()
environ.Env.read_env()
FRONTEND_URL = env('FRONTEND_URL')


class ChatModelViewSet(ModelViewSet):
    """
    ViewSet class for the Chats model.

    This ViewSet provides CRUD functionality for Chats objects.

    Attributes:
        queryset (QuerySet): The queryset of Chats objects.
        serializer_class (Serializer): The serializer class for Chats objects.
        permission_classes (list): The list of permission classes.
        http_method_names (list): The list of allowed HTTP methods.
    """

    queryset = Chat.objects.all()
    serializer_class = ChatModelSerializer
    permission_classes = [IsAuthenticated, IsOwnerChat, IsEmailConfirm]
    http_method_names = ['get', 'post', 'delete']

    def get_queryset(self, request, *args, **kwargs):
        """
        Get the queryset of Chats objects based on the agent's ownership.
        """
        chat_owner_agent_id = self.request.query_params.get('owner_agent_id')
        if chat_owner_agent_id is not None:
            return self.queryset.filter(owner_agent_id=chat_owner_agent_id)
        else:
            # If agent_id is not provided, handle accordingly, 
            # e.g., return an empty queryset or all chats depending on your application logic
            return Chat.objects.none()

    def destroy(self, request, *args, **kwargs):
        """
        Destroy a Chats object.

        This method deletes the specified Chats object and returns a success message.

        Args:
            request (HttpRequest): The HTTP request object.

        Returns:
            Response: The HTTP response containing the success message.
        """

        item = self.get_object()
        item.delete()
        response = {
            'message': 'Chats deletes successfully',
        }

        return Response(response, status=status.HTTP_200_OK)