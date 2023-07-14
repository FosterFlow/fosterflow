from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import authentication, exceptions


def enforce_csrf(request):
    """
    Enforces CSRF protection for the given request.

    This function checks the CSRF token for the request and raises a PermissionDenied
    exception if the CSRF check fails.

    Args:
        request (HttpRequest): The incoming request.

    Raises:
        exceptions.PermissionDenied: If the CSRF check fails.
    """

    check = authentication.CSRFCheck(request)
    reason = check.process_view(request, None, (), {})
    if reason:
        raise exceptions.PermissionDenied('CSRF Failed: %s' % reason)


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
        enforce_csrf(request)
        return self.get_user(validated_token), validated_token
