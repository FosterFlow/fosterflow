import environ
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail, EmailMultiAlternatives

env = environ.Env()
environ.Env.read_env()
FRONTEND_URL = env('FRONTEND_URL')

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Signal receiver function for password reset token creation.

    This function is triggered when a password reset token is created.
    It sends an email to the user with the password reset link and token.

    Args:
        sender: The sender of the signal.
        instance: The instance that triggered the signal.
        reset_password_token (ResetPasswordToken): The created reset password token.
        *args: Variable-length argument list.
        **kwargs: Arbitrary keyword arguments.
    """

    verify_link = FRONTEND_URL + '/password-reset/' + reset_password_token.key

    context = {
        'verify_link': verify_link
    }

    html_message = render_to_string('password_reset_email.html', context)
    plain_message = strip_tags(html_message)

    email = EmailMultiAlternatives(
        subject="Password Reset",
        body=plain_message,
        from_email=env('EMAIL_HOST_USER'),
        to=[reset_password_token.user.email],
        reply_to=[env('EMAIL_HOST_USER')],
    )

    email.attach_alternative(html_message, "text/html")

    email.send(fail_silently=True)