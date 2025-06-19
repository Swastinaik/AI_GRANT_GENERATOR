import os
from langchain_community.document_loaders import PyPDFLoader, UnstructuredWordDocumentLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import  ChatGoogleGenerativeAI
#from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
from dotenv import load_dotenv




load_dotenv()

google_api_key = os.environ.get('GOOGLE_API_KEY')
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0
)
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
    splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=100)
    split_docs = splitter.split_documents(docs)
    document_content = [doc.page_content for doc in split_docs]
    combined_document = "\n".join(document_content)
    return combined_document

'''
def build_org_vector(path: str)-> FAISS:
    print("Loading documents...")
    loader = generate_loader(path)
    docs = []
    for d in loader.load():
        docs.append(d)
    splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=100)
    split_docs = splitter.split_documents(docs)
    print(f"Loaded {len(split_docs)} documents.")
    print(split_docs)
    embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-exp-03-07")
    print("Creating vector store...")
    vectorstore = FAISS.from_documents(split_docs[:2], embeddings)
    print("Saving vector store...")
    vectorstore.save_local('../persist_dir')
    print("Vector store created and saved.")
    return vectorstore

'''
