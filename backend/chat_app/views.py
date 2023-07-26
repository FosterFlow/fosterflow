import environ
import rest_framework.exceptions
from django.contrib.auth import get_user_model
from .filters import MessageFilter
from .models import Chat, Message
from .permissions import IsOwnerChat, IsOwnerMessage
from .serializers import ChatModelSerializer, MessageModelSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.response import Response
from auth_app.permissions import IsEmailConfirm
from django.db.models import Q

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
    permission_classes = [IsOwnerChat, IsEmailConfirm]
    http_method_names = ['get', 'post', 'delete']

    #TODO change it
    # def get_queryset(self):
    #     """
    #     Get the queryset of Chats objects.
    #
    #     This method filters the queryset based on the user's ownership.
    #
    #     Returns:
    #         QuerySet: The filtered queryset of Chats objects.
    #     """
    #
    #     owner_queryset = self.queryset.filter(owner_id=self.request.user.id)
    #     return owner_queryset

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


class MessageModelViewSet(ModelViewSet):
    """
    ViewSet class for the Message model.

    This ViewSet provides CRUD functionality for Message objects.

    Attributes:
        queryset (QuerySet): The queryset of Message objects.
        serializer_class (Serializer): The serializer class for Message objects.
        filterset_class (FilterSet): The filterset class for Message objects.
        permission_classes (list): The list of permission classes.
        http_method_names (list): The list of allowed HTTP methods.
    """

    queryset = Message.objects.all()
    serializer_class = MessageModelSerializer
    filterset_class = MessageFilter
    permission_classes = [IsOwnerMessage, IsEmailConfirm]
    http_method_names = ['get', 'post', 'delete']

    def get_queryset(self):
        """
        Get the queryset of Message objects.

        This method filters the queryset based on the user's ownership and chat ID.

        Returns:
            QuerySet: The filtered queryset of Message objects.
        """

        user_dialogs = Chat.objects.filter(Q(owner_id_id=self.request.user.id) | Q(addressee_id_id=self.request.user.id))
        owner_queryset = self.queryset.filter(chat_id__in=user_dialogs)

        chat_id = self.request.query_params.get('chat_id')
        if not user_dialogs.filter(id=chat_id).exists() and chat_id:
            raise rest_framework.exceptions.PermissionDenied(
                {
                    "errors": {
                        "details": "Available only for the owner"
                    }
                }
            )
        return owner_queryset

    def destroy(self, request, *args, **kwargs):
        """
        Destroy a Message object.

        This method deletes the specified Message object and returns a success message.

        Args:
            request (HttpRequest): The HTTP request object.

        Returns:
            Response: The HTTP response containing the success message.
        """

        item = self.get_object()
        item.delete()
        response = {
            'message': 'Message deletes successfully',
        }

        return Response(response, status=status.HTTP_200_OK)
