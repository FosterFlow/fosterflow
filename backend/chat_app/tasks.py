import openai
from celery import shared_task
from .models import Chat, Message


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
    for event in response:
        try:
            if event['choices'][0]['finish_reason'] != 'stop':
                event_text = event['choices'][0]['delta']['content']
                print(event_text)
                complete += event_text
                # todo To websocket
        except Exception as e:
            print('None')

    nlp_message.message_text = complete
    nlp_message.save()
