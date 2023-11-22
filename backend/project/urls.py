from django.contrib import admin
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from auth_app.views import UserLogoutAPIView, UserLoginAPIView, RegisterApi, \
    ConfirmEmailGenericAPIView, SendEmailConfirmationTokenAPIView, \
    ChangePasswordView
from chat_app.views import ChatModelViewSet
from messages_app.views import MessageModelViewSet
from user_app.views import UserModelViewSet, SelfUserAPIView
from user_agent_profile_app.views import UserAgentProfileViewSet, SelfUserAgentProfileAPIView, UserAgentProfileAvatarUpdateView
from auth_app.views import CustomTokenRefreshView
from agent_app.views import AgentListView, AgentDetailView, AgentSelfView
# from ai_model_app.views import AiModelListView
# from ai_agent_profile_app.views import AiAgentProfileListView

router = DefaultRouter()
router.register('chats', ChatModelViewSet, basename='chats')
router.register('messages', MessageModelViewSet, basename='messages')
# TODO: we don't need users presented into API, we have agents for that
# router.register('users', UserModelViewSet, basename='users')
router.register('user_agent_profiles', UserAgentProfileViewSet, basename='user_agent_profiles')

urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', include(router.urls)),

    path('api/token/', UserLoginAPIView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterApi.as_view()),
    path('api/users/self', SelfUserAPIView.as_view(), name='user'),
    path('api/user_agent_profiles/self', SelfUserAgentProfileAPIView.as_view(), name='profile_user'),
    path('api/user_agent_profiles/<int:pk>/avatar/', UserAgentProfileAvatarUpdateView.as_view(), name='profile_user_update'),

    path('api/agents/', AgentListView.as_view(), name='agent-list'),
    path('api/agents/self', AgentSelfView.as_view(), name='agent-self'),
    path('api/agents/<int:pk>/', AgentDetailView.as_view(), name='agent-detail'),

    # TODO: update to get a profile for a specific agents by agent id
    # path('api/ai-models/', AiModelListView.as_view(), name='ai-model-list'),
    # path('api/ai_agent_profiles/', AiAgentProfileListView.as_view(), name='profile-model-list'),

    path('api/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('api/logout/', UserLogoutAPIView.as_view(), name='logout'),
    path('api/password-reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),

    path('api/confirmation-email/send/', SendEmailConfirmationTokenAPIView.as_view(),
         name='send_email_confirmation_api_view'),
    path('api/confirmation-email/confirm/', ConfirmEmailGenericAPIView.as_view(), name='account_confirm_email'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
