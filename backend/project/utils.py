from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None and response.status_code == 400:
        response.data = {
            "errors": response.data
        }

    if response is not None and response.status_code == 401:
        response.data = {
            "errors": {
                key: [value] for key, value in response.data.items()
            }
        }

    if response is not None and response.status_code == 404:
        response.data = {
            "errors": {
                key: [value] for key, value in response.data.items()
            }
        }

    return response
