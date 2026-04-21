import logging
from typing import List, Dict, Any
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_pinecone import PineconeVectorStore
from utils.vector_config import init_vectorstore

logger = logging.getLogger(__name__)

# Shared text splitter instance
text_splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=50)

# Configuration for batching
BATCH_SIZE = 100

def json_to_documents(json_data: Dict[str, Any], org_id: str) -> List[Document]:
    """
    Converts JSON data into LangChain Document objects ready for vector storage.
    """
    documents = []

    for key, value in json_data.items():
        if not value:
            continue

        # convert value to string (important)
        text = str(value)

        # split into chunks
        chunks = text_splitter.split_text(text)

        for i, chunk in enumerate(chunks):
            doc = Document(
                page_content=chunk,
                metadata={
                    "org_id": org_id,
                    "section": key,
                    "chunk_id": i
                }
            )
            documents.append(doc)

    return documents

def _add_documents_with_error_handling(vectorstore: PineconeVectorStore, documents: List[Document]):
    """
    Adds documents to the vector store with error handling and batching.
    """
    # Process documents in batches to avoid payload size limits
    for batch_start in range(0, len(documents), BATCH_SIZE):
        batch = documents[batch_start : batch_start + BATCH_SIZE]
        batch_num = batch_start // BATCH_SIZE + 1

        try:
            vectorstore.add_documents(batch)
            logger.info(
                f"Successfully added batch {batch_num} ({len(batch)} documents)"
            )
        except Exception as e:
            logger.error(
                f"Failed to add batch {batch_num} ({len(batch)} documents): {e}"
            )
            raise

def upload_vector_data(json_data: Dict[str, Any], org_id: str):
    """
    Stores vector data into Pinecone using a namespace identified by org_id.
    """
    documents = json_to_documents(json_data, org_id)
    if not documents:
        return

    vectorstore = init_vectorstore(org_id)
    _add_documents_with_error_handling(vectorstore, documents)

def update_vector_data(section_data: Dict[str, Any], sections_to_be_updated: List[str], org_id: str):
    """
    Updates specific sections in the Pinecone vector database for a given organization.
    """
    if not sections_to_be_updated:
        return

    vectorstore = init_vectorstore(org_id)

    # 1. First delete the existing data from vector database using metadata filter
    vectorstore.delete(filter={"section": {"$in": sections_to_be_updated}},namespace=org_id)

    # 2. Extract only the updated sections from section_data
    filtered_data = {k: v for k, v in section_data.items() if k in sections_to_be_updated}
    
    # 3. Insert the new data into the vector database using upload_vector_data
    upload_vector_data(filtered_data, org_id)
