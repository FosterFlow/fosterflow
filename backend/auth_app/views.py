import environ
from django.middleware import csrf
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django_rest_passwordreset.tokens import get_token_generator
from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from .models import EmailConfirmationToken
from .serializers import UserLoginSerializer, RegisterSerializer, ConfirmEmailSerializer
from rest_framework.permissions import AllowAny
from django.conf import settings
from django.contrib.auth import get_user_model, password_validation
from .serializers import ChangePasswordSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status
from rest_framework.response import Response
from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail, EmailMultiAlternatives

env = environ.Env()
environ.Env.read_env()
FRONTEND_URL = env('FRONTEND_URL')

User = get_user_model()


class UserLoginAPIView(GenericAPIView):
    """
    API view for user login.

    This view handles user login requests, validates the provided credentials,
    and returns the token pair (refresh and access) if successful.

    Permission:
        AllowAny: All users can access this view.

    Methods:
        post(self, request, *args, **kwargs): Handles POST requests for user login.
    """

    permission_classes = (AllowAny,)
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests for user login.

        This method validates the user's email and password using the serializer,
        generates the token pair (refresh and access), sets the refresh token as a cookie,
        adds the CSRF token to the response, and returns the token pair in the response data.

        Args:
            request (HttpRequest): The HTTP request object.
            *args: Variable-length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: The HTTP response containing the token pair or validation errors.
        """

        serializer = self.get_serializer(data=request.data)
        response = Response()
        if serializer.is_valid():
            user = serializer.validated_data
            token = RefreshToken.for_user(user)

            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                value=token,
                expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )

            response['CSRFToken'] = csrf.get_token(request)
            data = {"access": str(token.access_token)}
            response.data = data
            response.status_code = status.HTTP_200_OK
        else:
            data = {'errors': serializer.errors}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        return response


class UserLogoutAPIView(GenericAPIView):
    """
    API view for user logout.

    This view handles user logout requests by blacklisting the refresh token.

    Permission:
        IsAuthenticated: Only authenticated users can access this view.

    Methods:
        post(self, request, *args, **kwargs): Handles POST requests for user logout.
    """

    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests for user logout.

        This method retrieves the refresh token from the request data,
        blacklists the token, and returns a success message in the response.

        Args:
            request (HttpRequest): The HTTP request object.
            *args: Variable-length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: The HTTP response containing the success message or error details.
        """

        response = Response()
        try:
            refresh_token = request.COOKIES.get('refresh')
            if refresh_token is None:
                response = {"errors": {'details': 'Refresh is None'}}
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            token = RefreshToken(refresh_token)
            token.blacklist()
            response.delete_cookie('refresh')
            response.data = {
                'message': 'Logout successfully',
            }
            response.status_code = status.HTTP_200_OK
            return response
        except Exception as e:
            response = {"errors": {'details': e.args}}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)


class RegisterApi(generics.GenericAPIView):
    """
    API view for user registration.

    This view handles user registration requests, creates a new user, generates
    a token pair (refresh and access), sends a confirmation email, and returns
    the user data and token pair in the response.

    Permission:
        None: All users can access this view.

    Methods:
        post(self, request, *args, **kwargs): Handles POST requests for user registration.
    """

    permission_classes = ()
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests for user registration.

        This method validates the user registration data using the serializer,
        creates a new user, generates a token pair (refresh and access), creates
        an email confirmation token, sends a confirmation email, and returns
        the user data and token pair in the response.

        Args:
            request (HttpRequest): The HTTP request object.
            *args: Variable-length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: The HTTP response containing the user data and token pair or validation errors.
        """

        serializer = self.get_serializer(data=request.data)
        response = Response()
        if serializer.is_valid():
            user = serializer.save()
            token = RefreshToken.for_user(user)

            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                value=token,
                expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )

            response['CSRFToken'] = csrf.get_token(request)

            data = {"access": str(token.access_token)}
            response.data = data
            response.status_code = status.HTTP_200_OK

            token = get_token_generator().generate_token()
            EmailConfirmationToken.objects.create(user=user, key=token)
            send_confirmation_email(email=user.email, token=token)
        else:
            data = {'errors': serializer.errors}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        return response


def send_confirmation_email(email, token):
    """
    Sends a confirmation email to the specified email address.

    This function constructs the verification link using the provided token,
    creates the email message, and sends it to the recipient's email address.

    Args:
        email (str): The recipient's email address.
        token (str): The email confirmation token.
    """

    verify_link = FRONTEND_URL + '/email-verify/' + token
    context = {
        'verify_link': verify_link
    }

    html_message = render_to_string('confirm_email.html', context)
    plain_message = strip_tags(html_message)

    email = EmailMultiAlternatives(
        subject="Please confirm email",
        body=plain_message,
        from_email=env('EMAIL_HOST_USER'),
        to=[email],
        reply_to=[env('EMAIL_HOST_USER')],
    )

    email.attach_alternative(html_message, "text/html")

    email.send(fail_silently=True)


class SendEmailConfirmationTokenAPIView(APIView):
    """
    API view for sending an email confirmation token.

    This view handles POST requests for sending an email confirmation token
    to the authenticated user. It generates a token, creates an email confirmation
    token instance, sends the confirmation email, and returns a success message
    in the response.

    Permission:
        IsAuthenticated: Only authenticated users can access this view.

    Methods:
        post(self, request): Handles POST requests for sending an email confirmation token.
    """

    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        """
        Handles POST requests for sending an email confirmation token.

        This method retrieves the authenticated user, generates a token,
        creates an email confirmation token instance, sends the confirmation email,
        and returns a success message in the response.

        Args:
            request (HttpRequest): The HTTP request object.

        Returns:
            Response: The HTTP response containing the success message.
        """

        user = request.user
        token = get_token_generator().generate_token()
        EmailConfirmationToken.objects.create(user=user, key=token)
        send_confirmation_email(email=user.email, token=token)
        data = {
            "message": "Sending was successful"
        }
        return Response(data, status=status.HTTP_200_OK)


class ConfirmEmailGenericAPIView(GenericAPIView):
    """
    Generic API view for confirming user email.

    This view handles POST requests for confirming a user's email address.
    It validates the email confirmation token, updates the user's email confirmation
    status, activates the user account, and returns a success message in the response.

    Permission:
        None: All users can access this view.

    Methods:
        post(self, request, *args, **kwargs): Handles POST requests for confirming user email.
    """

    permission_classes = ()
    serializer_class = ConfirmEmailSerializer

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests for confirming user email.

        This method validates the email confirmation token, updates the user's email confirmation
        status, activates the user account, and returns a success message in the response.

        Args:
            request (HttpRequest): The HTTP request object.
            *args: Variable-length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: The HTTP response containing the success message.
        """

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token = serializer['email_confirm_token'].value
        email_token = EmailConfirmationToken.objects.filter(key=token).first()
        try:
            user = email_token.user
            user.is_email_confirmed = True
            user.is_active = True
            user.save()
            data = {
                "message": "The user is confirmed"
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_404_NOT_FOUND)


class ChangePasswordView(generics.UpdateAPIView):
    """
    API view for changing user password.

    This view handles PUT requests for changing the password of the authenticated user.
    It validates the old password, validates the new password, updates the password,
    and returns a success message in the response.

    Permission:
        IsAuthenticated: Only authenticated users can access this view.

    Methods:
        get_object(self, queryset=None): Retrieves the authenticated user object.
        update(self, request, *args, **kwargs): Handles PUT requests for changing user password.
    """

    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (IsAuthenticated,)
    http_method_names = ['put', ]

    def get_object(self, queryset=None):
        """
        Retrieves the authenticated user object.

        This method returns the authenticated user object.

        Args:
            queryset (QuerySet): The queryset to filter the objects (default: None).

        Returns:
            User: The authenticated user object.
        """

        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        """
        Handles PUT requests for changing user password.

        This method retrieves the authenticated user object, validates the old password,
        validates the new password, updates the password, and returns a success message
        in the response.

        Args:
            request (HttpRequest): The HTTP request object.
            *args: Variable-length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: The HTTP response containing the success message.
        """

        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"errors": {"old_password": ["Wrong password."]}}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            try:
                password_validation.validate_password(serializer.data.get("new_password"))
            except Exception as e:
                return Response({"errors": {"new_password": e}}, status=status.HTTP_400_BAD_REQUEST)
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            response = {
                'message': 'Password updated successfully',
            }

            return Response(response, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Signal receiver function for password reset token creation.

    This function is triggered when a password reset token is created.
    It sends an email to the user with the password reset link and token.

    Args:
        sender: The sender of the signal.
        instance: The instance that triggered the signal.
        reset_password_token (ResetPasswordToken): The created reset password token.
        *args: Variable-length argument list.
        **kwargs: Arbitrary keyword arguments.
    """

    verify_link = FRONTEND_URL + '/password-reset/' + reset_password_token.key

    context = {
        'verify_link': verify_link
    }

    html_message = render_to_string('password_reset_email.html', context)
    plain_message = strip_tags(html_message)

    email = EmailMultiAlternatives(
        subject="Password Reset",
        body=plain_message,
        from_email=env('EMAIL_HOST_USER'),
        to=[reset_password_token.user.email],
        reply_to=[env('EMAIL_HOST_USER')],
    )

    email.attach_alternative(html_message, "text/html")

    email.send(fail_silently=True)


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        response = Response()
        try:
            refresh = request.COOKIES.get('refresh')
            if refresh is None:
                response = {"errors": {'details': 'Refresh is None'}}
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            token_class = RefreshToken

            refresh = token_class(refresh)
        except Exception as e:
            response = {"errors": {'details': e.args}}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

        data = {"access": str(refresh.access_token)}

        if api_settings.ROTATE_REFRESH_TOKENS:
            if api_settings.BLACKLIST_AFTER_ROTATION:
                try:
                    # Attempt to blacklist the given refresh token
                    refresh.blacklist()
                except AttributeError:
                    # If blacklist app not installed, `blacklist` method will
                    # not be present
                    pass

            refresh.set_jti()
            refresh.set_exp()
            refresh.set_iat()

            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                value=str(refresh),
                expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )
            response.data = data
            response.status_code = status.HTTP_200_OK
        return response
