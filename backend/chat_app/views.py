import environ
import rest_framework.exceptions
from django.contrib.auth import get_user_model
from .filters import MessageFilter
from .models import Chat, Message
from .permissions import IsOwnerDialog, IsOwnerMessage
from .serializers import DialogModelSerializer, MessageModelSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.response import Response
from auth_app.permissions import IsEmailConfirm

User = get_user_model()

env = environ.Env()
environ.Env.read_env()
FRONTEND_URL = env('FRONTEND_URL')


class DialogModelViewSet(ModelViewSet):
    """
    ViewSet class for the Dialog model.

    This ViewSet provides CRUD functionality for Dialog objects.

    Attributes:
        queryset (QuerySet): The queryset of Dialog objects.
        serializer_class (Serializer): The serializer class for Dialog objects.
        permission_classes (list): The list of permission classes.
        http_method_names (list): The list of allowed HTTP methods.
    """

    queryset = Chat.objects.all()
    serializer_class = DialogModelSerializer
    permission_classes = [IsOwnerDialog, IsEmailConfirm]
    http_method_names = ['get', 'post', 'delete']

    def get_queryset(self):
        """
        Get the queryset of Dialog objects.

        This method filters the queryset based on the user's ownership.

        Returns:
            QuerySet: The filtered queryset of Dialog objects.
        """

        owner_queryset = self.queryset.filter(user_id=self.request.user)
        return owner_queryset

    def destroy(self, request, *args, **kwargs):
        """
        Destroy a Dialog object.

        This method deletes the specified Dialog object and returns a success message.

        Args:
            request (HttpRequest): The HTTP request object.

        Returns:
            Response: The HTTP response containing the success message.
        """

        item = self.get_object()
        item.delete()
        response = {
            'message': 'Dialog deletes successfully',
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

        This method filters the queryset based on the user's ownership and dialog ID.

        Returns:
            QuerySet: The filtered queryset of Message objects.
        """

        user_dialogs = Chat.objects.filter(user_id=self.request.user)
        owner_queryset = self.queryset.filter(dialog_id__in=user_dialogs)

        dialog_id = self.request.query_params.get('dialog_id')
        if not user_dialogs.filter(id=dialog_id).exists() and dialog_id:
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
