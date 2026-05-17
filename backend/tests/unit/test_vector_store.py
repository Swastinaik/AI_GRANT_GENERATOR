"""
test_vector_store.py — Unit tests for services/vector_store.py

WHAT WE'RE TESTING:
  The vector store utility handles document chunking and Pinecone integration.
  We test JSON-to-Document conversion, error handling during batch uploads,
  and the update/delete logic in the vector database.

WHY THESE TESTS MATTER:
  - Ensures that large text fields are correctly split into manageable chunks.
  - Verifies that metadata (org_id, section) is correctly attached to every chunk.
  - Confirms that updating a section correctly deletes old vectors before
    inserting new ones to prevent stale data.

PATTERN USED: AAA (Arrange → Act → Assert)
  We mock Pinecone's client and LangChain's vector store classes to prevent
  external network calls to Pinecone during testing.
"""

import pytest
from unittest.mock import MagicMock, patch
from langchain_core.documents import Document
from services.vector_store import (
    json_to_documents,
    _add_documents_with_error_handling,
    upload_vector_data,
    update_vector_data,
)

class TestVectorStore:
    """
    Groups tests for vector processing and Pinecone operations.
    """

    def test_json_to_documents(self):
        """
        WHAT: Verifies conversion from a JSON dict to LangChain Document objects.
        WHY:  Ensures that each key in the JSON becomes a metadata 'section'
              and the value is split into chunks if necessary.
        """
        # ARRANGE
        json_data = {
            "mission": "To save the world",
            "vision": "A green world"
        }
        org_id = "org_123"
        
        # ACT
        docs = json_to_documents(json_data, org_id)
        
        # ASSERT
        assert len(docs) >= 2
        # Check metadata of the first chunk
        assert docs[0].metadata["org_id"] == org_id
        assert docs[0].metadata["section"] == "mission"
        assert "save the world" in docs[0].page_content

    def test_json_to_documents_skips_empty_values(self):
        """
        WHAT: Ensures null or empty string fields are not converted to documents.
        WHY:  Prevents bloating the vector database with empty metadata records.
        """
        # ARRANGE
        json_data = {"k1": "v1", "k2": None, "k3": ""}
        
        # ACT
        docs = json_to_documents(json_data, "123")
        
        # ASSERT
        assert len(docs) == 1
        assert docs[0].metadata["section"] == "k1"

    def test_add_documents_with_error_handling_success(self):
        """
        WHAT: Verifies successful document batching.
        WHY:  Ensures that vectorstore.add_documents is called correctly.
        """
        # ARRANGE
        mock_vs = MagicMock()
        docs = [Document(page_content="test")]
        
        # ACT
        _add_documents_with_error_handling(mock_vs, docs)
        
        # ASSERT
        mock_vs.add_documents.assert_called_once_with(docs)

    def test_add_documents_with_error_handling_failure(self):
        """
        WHAT: Tests resilience when Pinecone returns an error.
        WHY:  Confirms that exceptions are logged and re-raised to stop the pipeline.
        """
        # ARRANGE
        mock_vs = MagicMock()
        mock_vs.add_documents.side_effect = Exception("Pinecone down")
        docs = [Document(page_content="test")]
        
        # ACT & ASSERT
        with pytest.raises(Exception, match="Pinecone down"):
            _add_documents_with_error_handling(mock_vs, docs)

    def test_upload_vector_data(self):
        """
        WHAT: Verifies the high-level upload function coordinates everything.
        WHY:  Ensures it calls conversion, initialization, and addition in order.
        """
        # ARRANGE
        json_data = {"k": "v"}
        org_id = "123"
        
        with patch("services.vector_store.json_to_documents") as mock_j2d, \
             patch("services.vector_store.init_vectorstore") as mock_init, \
             patch("services.vector_store._add_documents_with_error_handling") as mock_add:
            
            mock_docs = [Document(page_content="v")]
            mock_j2d.return_value = mock_docs
            mock_vs = MagicMock()
            mock_init.return_value = mock_vs
            
            # ACT
            upload_vector_data(json_data, org_id)
            
            # ASSERT
            mock_j2d.assert_called_once_with(json_data, org_id)
            mock_init.assert_called_once_with(org_id)
            mock_add.assert_called_once_with(mock_vs, mock_docs)

    def test_upload_vector_data_skips_if_no_documents(self):
        """
        WHAT: Ensures initialization is skipped if there's no data to upload.
        WHY:  Efficiency — no need to connect to Pinecone if conversion result is empty.
        """
        # ARRANGE
        with patch("services.vector_store.json_to_documents") as mock_j2d, \
             patch("services.vector_store.init_vectorstore") as mock_init:
            mock_j2d.return_value = []
            
            # ACT
            upload_vector_data({}, "123")
            
            # ASSERT
            mock_init.assert_not_called()

    def test_update_vector_data(self):
        """
        WHAT: Verifies the logic for updating specific sections.
        WHY:  Ensures that old data is DELETED before new data is INSERTED
              to avoid duplicate or stale chunks in the vector DB.
        """
        # ARRANGE
        section_data = {"sec1": "new", "sec2": "ignore"}
        sections_to_be_updated = ["sec1"]
        org_id = "123"
        
        with patch("services.vector_store.init_vectorstore") as mock_init, \
             patch("services.vector_store.upload_vector_data") as mock_upload:
            
            mock_vs = MagicMock()
            mock_init.return_value = mock_vs
            
            # ACT
            update_vector_data(section_data, sections_to_be_updated, org_id)
            
            # ASSERT
            mock_init.assert_called_once_with(org_id)
            # Verify deletion filter targets the specific sections
            mock_vs.delete.assert_called_once_with(
                filter={"section": {"$in": sections_to_be_updated}},
                namespace=org_id
            )
            # Verify upload only includes the filtered data
            mock_upload.assert_called_once_with({"sec1": "new"}, org_id)

    def test_update_vector_data_skips_if_no_sections(self):
        """
        WHAT: Ensures the update logic is skipped if the updated sections list is empty.
        WHY:  Prevents unnecessary DB calls when nothing has changed.
        """
        # ARRANGE
        with patch("services.vector_store.init_vectorstore") as mock_init:
            # ACT
            update_vector_data({"k": "v"}, [], "123")
            
            # ASSERT
            mock_init.assert_not_called()
