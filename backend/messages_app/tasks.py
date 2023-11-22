from celery import shared_task

from ai_model_app.adapters import RequestHandler


@shared_task()
def send_feedback_ai_task(data):
    request_handler = RequestHandler()
    request_handler.handle_request(request=data)
