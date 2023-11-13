import re

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