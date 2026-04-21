import os
import time
import logging
from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

def get_embeddings():
    model_name = os.getenv("EMBEDDING_MODEL_NAME", "models/text-embedding-004")
    os.environ['GOOGLE_API_KEY'] = os.getenv("GOOGLE_API_KEY")
    return GoogleGenerativeAIEmbeddings(model=model_name, output_dimensionality=768)


def init_vectorstore(namespace: str):
    embeddings = get_embeddings()
    index_name = os.getenv("PINECONE_INDEX_NAME")
    os.environ['PINECONE_API_KEY'] = os.getenv("PINECONE_API_KEY")
    return PineconeVectorStore(index_name=index_name, embedding=embeddings, namespace=namespace)

    
    