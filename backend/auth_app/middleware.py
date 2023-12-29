from django.http import HttpResponseServerError
from agent_app.models import Agent
from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from jwt import decode as jwt_decode
from django.conf import settings
from django.contrib.auth import get_user_model
import logging

# Set up logging
logger = logging.getLogger(__name__)

@database_sync_to_async
def get_user(token):
    try:
        decoded_data = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        Users = get_user_model()
        user = Users.objects.get(id=decoded_data['user_id'])
        return user
    except Exception as e:
        return AnonymousUser()


class TokenAuthMiddleWare:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        scope["user_agent"] = None
        try:
            token = parse_qs(scope["query_string"].decode("utf8"))["access"][0]
            user = await get_user(token)
            scope["user"] = user
            scope["user_agent"] = await database_sync_to_async(Agent.objects.get)(user=user)
            return await self.app(scope, receive, send)
        except Exception as error:
            # Define a close code, e.g., 4000 for application-specific error
            close_code = 4000
            # Optionally, you can include a text reason
            await send({
                "type": "websocket.close",
                "code": close_code,
                "details": str(error)
            })