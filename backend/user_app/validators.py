import re
from io import BytesIO
from PIL import Image
from django.core.files import File

username_regex = re.compile(
    r"""
    ^                       # beginning of string
    (?!_$)                  # no only _
    (?![-.])                # no - or . at the beginning
    (?!.*[_.-]{2})          # no __ or _. or ._ or .. or -- inside
    [a-zA-Z0-9_.-]+         # allowed characters, atleast one must be present
    (?<![.-])               # no - or . at the end
    $                       # end of string
    """,
    re.X,
)


def is_safe_username(
        username: str, regex=username_regex
):
    if not re.match(regex, username):
        return False

    return True


name_regex = re.compile(
    r"""
    ^[^@$%&*#!?()№;~:]+$                  
    """,
    re.X,
)


def is_safe_name(
        name: str, regex=name_regex
):
    if not re.match(regex, name):
        return False

    return True


def compress_image(image):
    im = Image.open(image)
    if im.mode != 'RGB':
        im = im.convert('RGB')
    im_io = BytesIO()
    im.save(im_io, 'jpeg', quality=70, optimize=True)
    new_image = File(im_io, name=image.name)

    return new_image
