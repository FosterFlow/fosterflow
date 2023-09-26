from celery import shared_task

from nlp_models_app.adapters import RequestHandler


@shared_task()
def send_feedback_nlp_task(data):
    request_handler = RequestHandler()
    request_handler.handle_request(request=data)
