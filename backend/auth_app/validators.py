from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _


class LatinPasswordValidator:
    def validate(self, password, user=None):
        if not password.isascii():
            raise ValidationError(
                _("The password must contain only Latin characters."),
                code='password_entirely_latin'
            )

    def get_help_text(self):
        return _("The password must contain only Latin characters.")
