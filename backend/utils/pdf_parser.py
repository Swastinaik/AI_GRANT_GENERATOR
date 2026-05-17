import pypdf
import tempfile
import os

def load_pdf(file_path: str) -> str:
    """
    Loads a PDF file and returns its content as a single string.
    """
    content = ""
    with open(file_path, "rb") as f:
        reader = pypdf.PdfReader(f)
        for page in reader.pages:
            content += page.extract_text() + "\n\n"
            
    return content

def process_pdf_sync(file_bytes: bytes) -> str:
    """
    Helper function to handle the blocking PDF operations.
    Passing bytes is often safer than managing temp files manually.
    """
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_file.write(file_bytes)
        temp_path = temp_file.name
    
    try:
        # Assuming load_pdf is your custom sync function
        text = load_pdf(temp_path)
        return text
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)