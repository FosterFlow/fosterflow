import asyncio, datetime
import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
from project.settings import BASE_DIR
import os
import openai
import environ

env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))
openai.api_key = env('OPENAI_API_KEY')


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):

        text_data_json = json.loads(text_data)
        prompt = text_data_json['message']
        if prompt:
            # Log input

            # Send prompt to Websocket immediately
            response = self.ask_gpt_stream(prompt)

    # Receive message from room group
    def ask_gpt_stream(self, prompt):
        current_time = datetime.datetime.now()
        messages = [
            {"role": "system", "content": "You are a helpful assistant."}
        ]
        user_prompt = {"role": "user", "content": prompt}
        messages.append(user_prompt)

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            stream=True
        )

        compelete = ""

        # iterate through the stream of events
        for event in response:
            try:
                event_text = event['choices'][0]['delta']['content']  # extract the text
                self.chat_partial(event_text, current_time)
                compelete += event_text
            except:
                pass

        # Print empty lines
        # self.chat_emptylines()


        return compelete

    # Send prompt to WebSocket
    def chat_prompt(self, prompt):
        self.send(text_data=json.dumps({"message": prompt}))

    # Send partial responses to WebSocket
    def chat_partial(self, partial, current_time):
        self.send(text_data=json.dumps({"message": partial}))
        # async_to_sync(self.channel_layer.group_send)(
        #     self.room_group_name, {"type": "chat.message", "message": partial}
        # )

    # Send response to WebSocket
    def chat_message(self, event):
        response = event['response']
        self.send(text_data=json.dumps({"message": response}))

    # Send response to WebSocket
    def chat_emptylines(self):
        self.send(text_data=json.dumps({
            'response': f"\n\n"
        }))
