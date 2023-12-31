from django.contrib import admin
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from auth_app.views import UserLogoutAPIView, UserLoginAPIView, RegisterApi, \
    ConfirmEmailGenericAPIView, SendEmailConfirmationTokenAPIView, \
    ChangePasswordView
from chat_app.views import ChatModelViewSet, MessageModelViewSet
from user_app.views import UserModelViewSet, UserAgentModelViewSet, SelfUserAPIView, SelfAgentAPIView

from auth_app.views import CustomTokenRefreshView

from user_app.views import UserAvatarUpdateView

router = DefaultRouter()
router.register('chats', ChatModelViewSet, basename='chats')
router.register('messages', MessageModelViewSet, basename='messages')
router.register('users', UserModelViewSet, basename='users')
router.register('agents', UserAgentModelViewSet, basename='agents')

urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', include(router.urls)),

    path('api/token/', UserLoginAPIView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterApi.as_view()),
    path('api/user/', SelfUserAPIView.as_view(), name='user'),
    path('api/agent/', SelfAgentAPIView.as_view(), name='agent'),
    path('api/agents/<int:pk>/avatar/', UserAvatarUpdateView.as_view(), name='avatar_update'),

    path('api/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('api/logout/', UserLogoutAPIView.as_view(), name='logout'),
    path('api/password-reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),

    path('api/confirmation-email/send/', SendEmailConfirmationTokenAPIView.as_view(),
         name='send_email_confirmation_api_view'),
    path('api/confirmation-email/confirm/', ConfirmEmailGenericAPIView.as_view(), name='account_confirm_email'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
