# Backend

### Project structure:

```
.
└── backend
  ├── agent_app                 # We use agents as core entity, that connects ai models, users with messages, chats, profiles.
  |                             # Users and IA Agents have a lot in common: they have memory, they can reply, they can do some sort of actions, they have profiles.
  |                             # "Agents" entity takes all the stuff that users and AI models have in common and allows us to work with them on the same level.
  ├── ai_agent_profile_app      # Profile of the agent that represents AI agent.
  ├── ai_model_app              # Any sort of AI models, likes LLM models.
  ├── auth_app                  # Authorization Application.
  ├── chat_app                  # Chat Application.
  ├── message_app               # Message Application.
  ├── project                   # Core Project.
  ├── user_app                  # User Application.
  ├── user_agent_profile_app    # Profile of the agent that represents registred User.
  ├── .env.template             # Environment variables (template)
  ├── db_test.json              # Test data
  └── requirements.txt          # Modules to install
```
