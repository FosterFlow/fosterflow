from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.settings import api_settings
from django.utils.translation import gettext_lazy as _
from rest_framework import exceptions, status


class DetailDictMixin:
    def __init__(self, detail=None, code=None):
        """
        Builds a detail dictionary for the error to give more information to API
        users.
        """
        detail_dict = {"details": self.default_detail}

        if isinstance(detail, dict):
            detail_dict.update(detail)
        elif detail is not None:
            detail_dict["details"] = detail

        super().__init__(detail_dict)


class InvalidToken(DetailDictMixin, exceptions.AuthenticationFailed):
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = _("Token is invalid or expired")


class CustomAuthentication(JWTAuthentication):
    """
    Custom authentication class that extends JWTAuthentication.

    This class overrides the `authenticate` method to handle authentication
    using JWT tokens and enforce CSRF protection.

    Methods:
        authenticate(request): Authenticates the request and returns the user and token.
    """

    def authenticate(self, request):
        """
        Authenticates the request and returns the user and token.

        Args:
            request (HttpRequest): The incoming request.

        Returns:
            tuple: A tuple containing the authenticated user and the validated token.

        Raises:
            InvalidToken: If the token is invalid or expired.
        """

        header = self.get_header(request)
        if header is None:
            return None

        raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token

    def get_validated_token(self, raw_token):
        """
        Validates an encoded JSON web token and returns a validated token
        wrapper object.
        """
        messages = []
        for AuthToken in api_settings.AUTH_TOKEN_CLASSES:
            try:
                return AuthToken(raw_token)
            except TokenError as e:
                messages.append(
                    {
                        "token_class": AuthToken.__name__,
                        "token_type": AuthToken.token_type,
                        "message": e.args[0],
                    }
                )

        raise InvalidToken(
            {
                "details": messages[0]['message'],
            }
        )
