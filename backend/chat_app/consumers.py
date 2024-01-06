import json
import os
import openai
import environ
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from project.settings import BASE_DIR
from chat_app.models import Chat
from agent_app.models import Agent

env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))
openai.api_key = env('OPENAI_API_KEY')


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.agent_channel = 'None'

        if self.scope["user"] == AnonymousUser():
            self.close()
            return False
        else:
            self.agent_channel = str(self.scope["user_agent"].id)

        self.agents = Agent.objects.filter(user_id=self.scope["user"])
        self.available_chats = list(
            Chat.objects.filter(owner_agent_id__in=self.agents)
            .values_list('id', flat=True)
        )

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.agent_channel, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.agent_channel, self.channel_name
        )

    def chat_message(self, event):
        self.send(text_data=json.dumps(event["text"]))