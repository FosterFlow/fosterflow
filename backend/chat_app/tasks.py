import openai
from celery import shared_task
from .models import Chat, Message
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def get_messages(message_id, message_text, chat_id):
    previous_messages = Message.objects.filter(chat_id=chat_id).order_by('-id')[:10]
    messages = [
        {"role": "system", "content": "You are a helpful assistant."}
    ]
    main_message = Message.objects.get(id=message_id)

    for message in previous_messages:
        if message.owner_id != main_message.owner_id:
            mes = {"role": "user", "content": message.message_text}
        else:
            mes = {"role": "assistant", "content": message.message_text}
        messages.append(mes)

    user_prompt = {"role": "user", "content": message_text}
    messages.append(user_prompt)

    return messages


@shared_task()
def send_feedback_nlp_task(message_id, message_text, chat_id, owner_id):
    channel_layer = get_channel_layer()
    chat_id = Chat.objects.get(id=chat_id)

    nlp_message = Message.objects.create(
        chat_id=chat_id,
        message_text='',
        owner_id=chat_id.addressee_id
    )

    messages = get_messages(message_id, message_text, chat_id)

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        stream=True
    )

    complete = ""
    data = {
        "type": "chat_message_chunk",
        "chat_id": nlp_message.chat_id.id,
        "created_at": str(nlp_message.created_at),
        # "request_id": 33, # ToDo
        "id": nlp_message.id,
        "message_chunk": '',
        "owner_id": nlp_message.owner_id.id,
        "status": "start"
    }
    async_to_sync(channel_layer.group_send)(str(owner_id), {"type": "chat.message", "text": data, })
    for event in response:
        try:
            if event['choices'][0]['finish_reason'] != 'stop':
                event_text = event['choices'][0]['delta']['content']
                complete += event_text
                data['message_chunk'] = event_text
                data['status'] = 'progress'

                async_to_sync(channel_layer.group_send)(str(owner_id), {"type": "chat.message", "text": data, })
            else:
                data['status'] = 'done'
                async_to_sync(channel_layer.group_send)(str(owner_id), {"type": "chat.message", "text": data, })
        except Exception as e:
            data['errors'] = {
                "details": [
                    e
                ]
            }
            data['status'] = 'failed'
            async_to_sync(channel_layer.group_send)(str(owner_id), {"type": "chat.message", "text": data, })

    nlp_message.message_text = complete
    nlp_message.save()
