from django.http import HttpResponseForbidden
from django.conf import settings


class RestrictIPMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        allowed_ips = settings.ALLOWED_IPS
        client_ip = get_client_ip(request)
        # Define restricted paths
        restricted_paths = [
            '/api/schema/swagger-ui/',
            '/api/admin/',
            # add more paths as needed
        ]

        # Check if the request path is restricted and the client IP is not allowed
        if any(request.path.startswith(path) for path in restricted_paths) and client_ip not in allowed_ips:
            return HttpResponseForbidden('Access Denied')

        response = self.get_response(request)
        return response


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip