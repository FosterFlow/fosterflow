from django.contrib.auth import authenticate, password_validation
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from rest_framework.exceptions import ValidationError
from rest_framework.fields import CharField
from rest_framework.serializers import Serializer
from rest_framework_simplejwt.serializers import PasswordField
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import serializers

User = get_user_model()


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer class to authenticate users with email and password.

    This serializer is used to validate user login credentials.
    It takes an email and password as input and returns the authenticated user.

    Fields:
        email (CharField): The user's email.
        password (CharField): The user's password (write-only).
    """

    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        """
        Validates the login credentials.

        This method attempts to authenticate the user with the provided email and password.
        If the authentication is successful and the user is active, it returns the authenticated user.

        Args:
            data (dict): The input data containing email and password.

        Returns:
            User: The authenticated user.

        Raises:
            serializers.ValidationError: If the email or password is incorrect.
        """

        try:
            user = User.objects.get(email=data['email'])
            if user.check_password(data['password']):
                return user
            else:
                raise serializers.ValidationError({"details": ['Incorrect email or password']})
        except Exception:
            raise serializers.ValidationError({"details": ['Incorrect email or password']})


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer class for user registration.

    This serializer is used to register a new user.
    It validates the email and password fields and creates a new User instance.

    Fields:
        email (EmailField): The user's email.
        password (CharField): The user's password (write-only).
    """

    email = serializers.EmailField()

    def validate_email(self, value):
        """
        Validates the email field.

        This method checks if the email already exists in the User model.
        If a duplicate email is found, it raises a ValidationError.

        Args:
            value (str): The input email value.

        Returns:
            str: The validated email (converted to lowercase).

        Raises:
            serializers.ValidationError: If a duplicate email is found.
        """

        lower_email = value.lower()
        if User.objects.filter(email__iexact=lower_email).exists():
            raise serializers.ValidationError("Duplicate")
        return lower_email

    def validate_password(self, value):
        """
        Validates the password field.

        This method performs password validation based on Django's password validation rules.

        Args:
            value (str): The input password value.

        Returns:
            str: The validated password.

        Raises:
            serializers.ValidationError: If the password fails validation.
        """

        password_validation.validate_password(value, self.instance)
        return value

    def create(self, validated_data):
        """
        Creates a new user instance.

        This method creates a new User instance with the provided email and password.

        Args:
            validated_data (dict): The validated data containing email and password.

        Returns:
            User: The created user instance.
        """

        try:
            last_id = User.objects.latest('id').id
        except Exception as e:
            last_id = 0
        user = User.objects.create_user(username=f'id{last_id + 1}',
                                        password=validated_data['password'],
                                        email=validated_data['email'])
        return user

    class Meta:
        model = User
        fields = ('id', 'email', 'password')
        extra_kwargs = {
            'password': {'write_only': True},
        }


class ConfirmEmailSerializer(serializers.Serializer):
    """
    Serializer class for confirming email.

    This serializer is used to validate the email confirmation token.

    Fields:
        email_confirm_token (CharField): The email confirmation token (required).
    """

    email_confirm_token = serializers.CharField(required=True)


class EmailTokenObtainSerializer(Serializer):
    """
    Serializer class for obtaining email tokens.

    This serializer is used to validate the user's email and password and obtain an email token.

    Fields:
        username_field (str): The field used as the username (email in this case).
    """

    username_field = User.email

    def __init__(self, *args, **kwargs):
        """
        Initializes the serializer.

        Adds the email and password fields to the serializer's fields.

        Args:
            *args: Variable-length argument list.
            **kwargs: Arbitrary keyword arguments.
        """

        super().__init__(*args, **kwargs)

        self.fields[self.username_field] = CharField()
        self.fields['password'] = PasswordField()

    def validate(self, attrs):
        """
        Validates the email and password.

        Checks if the user exists with the provided email and if the password is correct.
        Raises a ValidationError if the user is not valid or the credentials are incorrect.

        Args:
            attrs (dict): The input data containing email and password.

        Returns:
            dict: An empty dictionary.

        Raises:
            ValidationError: If the user is not valid or the credentials are incorrect.
        """

        self.user = User.objects.filter(email=attrs[self.username_field]).first()

        if not self.user:
            raise ValidationError('The user is not valid')

        if self.user:
            if not self.user.check_password(attrs['password']):
                raise ValidationError('Incorrect credentials')

        if self.user is None or not self.user.is_active:
            raise ValidationError('No active account found with the given credentials')

        return {}

    @classmethod
    def get_token(cls, user):
        """
        This method must be implemented by subclasses of `EmailTokenObtainSerializer`.

        Args:
            user (User): The authenticated user.

        Raises:
            NotImplementedError: If the method is not implemented.

        Returns:
            None
        """

        raise NotImplemented(
            'Must implement `get_token` method for `MyTokenObtainSerializer` subclasses')


class CustomTokenObtainPairSerializer(EmailTokenObtainSerializer):
    """
    Custom serializer class for obtaining token pairs.

    This serializer extends the EmailTokenObtainSerializer and provides a custom implementation
    for obtaining token pairs using the refresh and access tokens.

    Methods:
        get_token(cls, user): Returns the token pair (refresh and access) for the given user.
        validate(self, attrs): Validates the email and password, obtains the token pair, and returns it in the response.
    """

    @classmethod
    def get_token(cls, user):
        """
        Get the token pair for the user.

        This method generates the token pair (refresh and access) for the given user.

        Args:
            user (User): The authenticated user.

        Returns:
            RefreshToken: The generated token pair.
        """

        return RefreshToken.for_user(user)

    def validate(self, attrs):
        """
        Validates the email and password, obtains the token pair, and returns it in the response.

        This method extends the validation process by obtaining the token pair using the get_token method
        and adding the refresh and access tokens to the response data.

        Args:
            attrs (dict): The input data containing email and password.

        Returns:
            dict: The response data containing the token pair (refresh and access).

        Raises:
            ValidationError: If the email or password is invalid.
        """

        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)

        return data


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer class for the password change endpoint.

    This serializer is used to validate the old and new passwords for a user.

    Fields:
        model (User): The User model used for the password change.
        old_password (CharField): The old password (required).
        new_password (CharField): The new password (required).
    """

    model = User
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
