from django.contrib import admin
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from auth_app.views import UserLogoutAPIView, UserLoginAPIView, RegisterApi, \
    ConfirmEmailGenericAPIView, SendEmailConfirmationTokenAPIView, \
    ChangePasswordView
from user_app.views import SelfUserAPIView
from user_agent_profile_app.views import UserAgentProfileDetailsView, UserAgentProfileByAgentIdView, UserAgentProfileAvatarView
from auth_app.views import CustomTokenRefreshView
from agent_app.views import AgentListView, AgentDetailsView, AgentSelfView
from ai_agent_profile_app.views import AiAgentProfileDetailsView
from chat_app.views import (
    ChatListView, ChatCreateView, ChatDetailView, ChatUpdateView, ChatDeleteView
)
from message_app.views import (
    MessageListView, MessageCreateView, MessageDetailView, MessageUpdateView, MessageDeleteView
)

router = DefaultRouter()

urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', include(router.urls)),

    path('api/token/', UserLoginAPIView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterApi.as_view()),
    path('api/users/self/', SelfUserAPIView.as_view(), name='user'),
    
    path('api/user-agent-profiles-by-agent-id/<int:agent_id>/', UserAgentProfileByAgentIdView.as_view(), name='user_agent_profile_by_agent_id'),
    path('api/user-agent-profiles/<int:pk>/', UserAgentProfileDetailsView.as_view(), name='user_agent_profile_details'),
    path('api/user-agent-profiles/<int:pk>/avatar/', UserAgentProfileAvatarView.as_view(), name='user_agent_profile_avatar'),

    path('api/agents/', AgentListView.as_view(), name='agent-list'),
    path('api/agents/self/', AgentSelfView.as_view(), name='agent-self'),
    path('api/agents/<int:pk>/', AgentDetailsView.as_view(), name='agent-detail'),

    path('api/ai-agent-profiles-by-agent-id/<int:agent_id>/', AiAgentProfileDetailsView.as_view(), name='ai_agent_profile_details_by_agent_id'),

    path('api/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('api/logout/', UserLogoutAPIView.as_view(), name='logout'),
    path('api/password-reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),

    path('api/confirmation-email/send/', SendEmailConfirmationTokenAPIView.as_view(),
         name='send_email_confirmation_api_view'),
    path('api/confirmation-email/confirm/', ConfirmEmailGenericAPIView.as_view(), name='account_confirm_email'),

    # Chat URLs
    path('api/chats/', ChatListView.as_view(), name='chat-list'),
    path('api/chats/create/', ChatCreateView.as_view(), name='chat-create'),
    path('api/chats/<int:pk>/', ChatDetailView.as_view(), name='chat-detail'),
    path('api/chats/<int:pk>/update/', ChatUpdateView.as_view(), name='chat-update'),
    path('api/chats/<int:pk>/delete/', ChatDeleteView.as_view(), name='chat-delete'),

    # Message URLs
    path('api/messages/', MessageListView.as_view(), name='message-list'),
    path('api/messages/create/', MessageCreateView.as_view(), name='message-create'),
    path('api/messages/<int:pk>/', MessageDetailView.as_view(), name='message-detail'),
    path('api/messages/<int:pk>/update/', MessageUpdateView.as_view(), name='message-update'),
    path('api/messages/<int:pk>/delete/', MessageDeleteView.as_view(), name='message-delete'),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
