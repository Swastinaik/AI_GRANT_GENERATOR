import os
from langchain_community.document_loaders import PyPDFLoader, UnstructuredWordDocumentLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import  ChatGoogleGenerativeAI
#from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings

def generate_loader(path: str)-> (PyPDFLoader | UnstructuredWordDocumentLoader | TextLoader):
    ext = os.path.splitext(path)[1].lower()
    if ext == ".pdf":
        return PyPDFLoader(path)
    elif ext in {".docx", ".doc"}:
        return UnstructuredWordDocumentLoader(path)
    elif ext in {".md", ".markdown", ".txt"}:
        return TextLoader(path)
    else:
        raise ValueError(f"Unsupported file type: {ext}")


def convert_docs_to_text(loader: (PyPDFLoader | UnstructuredWordDocumentLoader | TextLoader)):
    docs = []
    for d in loader.load():
        docs.append(d)
    splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=10)
    split_docs = splitter.split_documents(docs)
    document_content = [doc.page_content for doc in split_docs]
    combined_document = "\n".join(document_content)
    return combined_document


