import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from project.settings import BASE_DIR
import os
import openai
import environ

env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))
openai.api_key = env('OPENAI_API_KEY')


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        messages = [
            {"role": "system", "content": "You are a helpful assistant."}
        ]

        user_prompt = {"role": "user", "content": message}
        messages.append(user_prompt)

        response_stream = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            stream=True
        )

        queue = asyncio.Queue()
        asyncio.ensure_future(self.process_chunks(response_stream, queue))

        while True:
            data_chunk = await queue.get()
            if data_chunk is None:
                break

            try:
                message_content = data_chunk["choices"][0]["message"]["content"]
                await self.channel_layer.group_send(
                    self.room_group_name, {"type": "chat.message", "message": message_content}
                )
            except KeyError:
                pass

    async def process_chunks(self, response_stream, queue):
        async for data_chunk in response_stream:
            await queue.put(data_chunk)

        # Signal the end of the data to the main consumer
        await queue.put(None)


    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message}))
