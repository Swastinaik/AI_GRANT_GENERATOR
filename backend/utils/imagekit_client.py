import os
from imagekitio import AsyncImageKit

def get_imagekit_client():
    """
    Initializes and returns an ImageKitAsync client.
    """
    imagekit = AsyncImageKit(
        private_key=os.getenv("IMAGEKIT_PRIVATE_KEY", "")
    )
    return imagekit

async def upload_file_to_imagekit(file_content: bytes, file_name: str) -> str | None:
    """
    Uploads a file to ImageKit and returns its URL.
    Returns None if upload fails.
    """
    client = get_imagekit_client()
    try:
        upload_response = await client.files.upload(
            file=file_content,
            file_name=file_name
        )
        return upload_response.url
    except Exception as e:
        print(f"ImageKit upload failed: {e}")
        return None
