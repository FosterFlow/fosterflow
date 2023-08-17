import json

with open('data.json', 'r') as f:
    print(f)
    data = json.load(f)

for index, item in enumerate(data):
    if item['model'] == "user_app.profile":
        item['model'] = "user_app.agent"

    if item['model'] == "chat_app.dialog":
        item['model'] = "chat_app.chat"
        item['fields']['owner_id'] = item['fields'].pop('user_id')
        item['fields']['addressee_id'] = item['fields']['owner_id']

for index, item in enumerate(data):
    if item['model'] == "chat_app.message":
        if 'dialog_id' in item['fields']:
            chat_id = item['fields'].pop('dialog_id')
            item['fields']['chat_id'] = chat_id

            for chat_item in data:
                if chat_item['model'] == 'chat_app.chat' and chat_item['pk'] == chat_id:
                    item['fields']['owner_id'] = chat_item['fields']['owner_id']
                    break

            new_message = item.copy()
            new_message['pk'] = max(entry['pk'] for entry in data if entry[
                'model'] == 'chat_app.message') + 1
            new_message['fields']['message_text'] = item['fields']['answer_text']
            del item['fields']['answer_text']
            data.append(new_message)
        item['fields']['created_at'] = "2023-08-17T00:00:00.291Z"


with open('result.json', 'w') as f:
    json.dump(data, f)
