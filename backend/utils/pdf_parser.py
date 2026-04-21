from langchain_community.document_loaders import PyPDFLoader

def load_pdf(file_path: str) -> str:
    """
    Loads a PDF file and returns its content as a single string.
    """
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    
    # Combine text from all pages
    content = ""
    for doc in documents:
        content += doc.page_content + "\n\n"
        
    return content
