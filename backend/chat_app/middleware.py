from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from jwt import decode as jwt_decode
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response

Users = get_user_model()


@database_sync_to_async
def get_user(token):
    try:
        decoded_data = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user = get_user_model().objects.get(id=decoded_data['user_id'])
        return user
    except Exception as e:
        return AnonymousUser()


class TokenAuthMiddleWare:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        try:
            headers = dict(scope['headers'])
            token = headers[b'access'].decode("utf8").split()[0]
            user = await get_user(token)
            scope["user"] = user
            return await self.app(scope, receive, send)
        except Exception as e:
            await send({"type": "websocket.close"})
