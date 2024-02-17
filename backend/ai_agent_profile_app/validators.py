from io import BytesIO
from PIL import Image
from django.core.files import File

def compress_image(image):
    im = Image.open(image)
    if im.mode != 'RGB':
        im = im.convert('RGB')
    im_io = BytesIO()
    im.save(im_io, 'jpeg', quality=70, optimize=True)
    new_image = File(im_io, name=image.name)

    return new_image