import os
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from PIL import Image

def convert_image_to_webp(image_field, quality=85) -> InMemoryUploadedFile:
    """
    Конвертирует переданный ImageField в WEBP в памяти.
    Сохраняет альфа-канал, если он был в исходном PNG.
    Возвращает InMemoryUploadedFile с новым именем .webp или None.
    """
    if not image_field:
        return None

    img = Image.open(image_field)

    # Если есть альфа-канал — сохраняем его, иначе — RGB
    if img.mode in ("RGBA", "LA") or (img.mode == "P" and 'transparency' in img.info):
        img = img.convert("RGBA")
    else:
        img = img.convert("RGB")

    buffer = BytesIO()
    img.save(buffer, format="WEBP", quality=quality, method=6)
    buffer.seek(0)

    base, _ = os.path.splitext(image_field.name)
    new_name = base + ".webp"

    return InMemoryUploadedFile(
        file=buffer,
        field_name=image_field.name,
        name=new_name,
        content_type="image/webp",
        size=buffer.getbuffer().nbytes,
        charset=None
    )

def remove_file_if_exists(file_path: str) -> None:
    """
    Удаляет файл, если он существует.
    """
    if file_path and os.path.isfile(file_path):
        os.remove(file_path)
