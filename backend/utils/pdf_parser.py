import pypdf

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
