"""
test_serializers.py — Unit tests for serialize_doc and serialize_docs
in services/proposal_service.py

WHAT WE'RE TESTING:
  These are pure helper functions — they take a Beanie document object and
  convert it into a plain Python dict with string IDs (since ObjectId is not
  JSON-serializable).

WHY START HERE:
  - No database, no AI, no HTTP calls → no mocking needed
  - Purely about input → output logic
  - Fast to write and run, great confidence booster

PATTERN USED: AAA (Arrange → Act → Assert)
  Every test follows:
    1. ARRANGE: set up the inputs (fake document object)
    2. ACT:     call the function we're testing
    3. ASSERT:  verify the output matches what we expect
"""

from unittest.mock import MagicMock
from bson import ObjectId

from services.proposal_service import serialize_doc, serialize_docs


# ─────────────────────────────────────────────────────────────────────────────
# HELPER: create a fake Beanie document
# ─────────────────────────────────────────────────────────────────────────────
def make_mock_doc(
    doc_id=None,
    project_id=None,
    extra_fields: dict = None,
):
    """
    Creates a fake Beanie document using MagicMock.

    MagicMock lets us create an object that pretends to have any attribute
    we set on it — perfect for simulating a Proposal/Beanie document
    without touching the real database.

    Args:
        doc_id: ObjectId for the document (auto-generated if None)
        project_id: ObjectId for the project reference (auto-generated if None)
        extra_fields: Additional fields to include in model_dump()

    Returns:
        A MagicMock that behaves like a Beanie document
    """
    mock = MagicMock()
    mock.id = doc_id or ObjectId()
    mock.project_id = project_id or ObjectId()

    # model_dump() is what Beanie/Pydantic uses to convert the model to a dict
    base_fields = {
        "file_url": "https://example.com/rfp.pdf",
        "type": "generate",
        "output_json": {"abstract": "Test proposal content"},
        "review": None,
    }
    if extra_fields:
        base_fields.update(extra_fields)

    mock.model_dump.return_value = base_fields
    return mock


# ─────────────────────────────────────────────────────────────────────────────
# TESTS FOR: serialize_doc()
# ─────────────────────────────────────────────────────────────────────────────

class TestSerializeDoc:
    """
    Groups all tests for the serialize_doc() function.

    Using a class is optional but organizes related tests nicely.
    pytest discovers test methods inside classes that start with 'Test'.
    """

    def test_returns_none_when_doc_is_none(self):
        """
        WHAT: serialize_doc(None) should return None without crashing.
        WHY:  Proposal.get() returns None when a document doesn't exist.
              The function must handle this gracefully instead of raising
              AttributeError: 'NoneType' has no attribute 'model_dump'.

        This tests the guard clause: `if not doc: return doc`
        """
        # ARRANGE: no setup needed
        # ACT
        result = serialize_doc(None)
        # ASSERT
        assert result is None

    def test_converts_id_to_string(self):
        """
        WHAT: The 'id' field should be converted from ObjectId → str.
        WHY:  MongoDB stores IDs as ObjectId objects, but JSON can only
              serialize strings. Without this conversion, FastAPI would crash
              when trying to return the response.

        Core business logic of this function!
        """
        # ARRANGE
        fake_id = ObjectId()
        mock_doc = make_mock_doc(doc_id=fake_id)

        # ACT
        result = serialize_doc(mock_doc)

        # ASSERT
        assert "id" in result
        assert result["id"] == str(fake_id)       # Must be a string, not ObjectId
        assert isinstance(result["id"], str)        # Extra type safety check

    def test_converts_project_id_to_string(self):
        """
        WHAT: The 'project_id' field should also be a string in the output.
        WHY:  Same reason as above — project_id is a PydanticObjectId reference
              and must be serialized to a string for JSON responses.
        """
        # ARRANGE
        fake_project_id = ObjectId()
        mock_doc = make_mock_doc(project_id=fake_project_id)

        # ACT
        result = serialize_doc(mock_doc)

        # ASSERT
        assert result["project_id"] == str(fake_project_id)
        assert isinstance(result["project_id"], str)

    def test_preserves_all_other_fields(self):
        """
        WHAT: Fields from model_dump() (like file_url, type, output_json)
              must appear unchanged in the result.
        WHY:  serialize_doc is a SERIALIZER — it should add id/project_id
              but NOT lose or mutate any existing fields.
        """
        # ARRANGE
        mock_doc = make_mock_doc(extra_fields={
            "type": "review",
            "review": "The proposal looks good overall.",
            "file_url": "https://storage.example.com/my-file.pdf",
        })

        # ACT
        result = serialize_doc(mock_doc)

        # ASSERT
        assert result["type"] == "review"
        assert result["review"] == "The proposal looks good overall."
        assert result["file_url"] == "https://storage.example.com/my-file.pdf"

    def test_output_json_field_is_preserved(self):
        """
        WHAT: The output_json field (a nested dict) should be untouched.
        WHY:  output_json stores the AI-generated grant sections as a nested
              dictionary. We must verify it survives serialization intact.
        """
        # ARRANGE
        grant_sections = {
            "abstract": "Our mission is to empower students.",
            "budget": {"total": 50000, "breakdown": ["salaries", "equipment"]},
        }
        mock_doc = make_mock_doc(extra_fields={"output_json": grant_sections})

        # ACT
        result = serialize_doc(mock_doc)

        # ASSERT
        assert result["output_json"] == grant_sections
        assert result["output_json"]["budget"]["total"] == 50000

    def test_handles_none_project_id(self):
        """
        WHAT: If doc.project_id is None or missing, project_id should be None
              in the output (not crash with AttributeError).
        WHY:  The serialize_doc implementation uses hasattr() + truthiness check:
                `str(doc.project_id) if hasattr(doc, 'project_id') and doc.project_id else None`
              We need to verify this guard actually works.
        """
        # ARRANGE: create a doc where project_id is None
        mock_doc = MagicMock()
        mock_doc.id = ObjectId()
        mock_doc.project_id = None                         # ← simulate missing reference
        mock_doc.model_dump.return_value = {"type": "generate"}

        # ACT
        result = serialize_doc(mock_doc)

        # ASSERT
        assert result["project_id"] is None                # Should be None, not crash


# ─────────────────────────────────────────────────────────────────────────────
# TESTS FOR: serialize_docs()
# ─────────────────────────────────────────────────────────────────────────────

class TestSerializeDocs:
    """
    Groups all tests for the serialize_docs() function.

    serialize_docs() is a thin wrapper: it calls serialize_doc() on each
    item in a list. So we mainly test its list-handling behavior.
    """

    def test_returns_empty_list_for_empty_input(self):
        """
        WHAT: serialize_docs([]) should return an empty list [].
        WHY:  get_all_proposals_service() may return an empty list when
              a project has no proposals. The serializer must handle this
              without crashing or returning None.
        """
        result = serialize_docs([])
        assert result == []
        assert isinstance(result, list)

    def test_serializes_each_document(self):
        """
        WHAT: Each document in the list should be individually serialized.
        WHY:  Confirms that serialize_docs correctly delegates to serialize_doc
              for each item — verifying the list comprehension works.
        """
        # ARRANGE: create two distinct fake documents
        id1, id2 = ObjectId(), ObjectId()
        doc1 = make_mock_doc(doc_id=id1)
        doc2 = make_mock_doc(doc_id=id2)

        # ACT
        results = serialize_docs([doc1, doc2])

        # ASSERT
        assert len(results) == 2
        assert results[0]["id"] == str(id1)
        assert results[1]["id"] == str(id2)

    def test_returns_list_not_generator(self):
        """
        WHAT: The return value must be a list, not a generator or tuple.
        WHY:  FastAPI serializes responses as JSON. A generator object would
              not serialize correctly. Explicitly verifying the type protects
              against future refactors that might accidentally return a generator.
        """
        mock_doc = make_mock_doc()
        result = serialize_docs([mock_doc])

        assert isinstance(result, list)

    def test_preserves_order_of_documents(self):
        """
        WHAT: Documents should appear in the output in the same order as input.
        WHY:  The API returns proposals in insertion order (MongoDB default).
              If the serializer reordered them, the frontend would show proposals
              in the wrong order.
        """
        # ARRANGE: three docs with distinguishable IDs
        ids = [ObjectId() for _ in range(3)]
        docs = [make_mock_doc(doc_id=oid) for oid in ids]

        # ACT
        results = serialize_docs(docs)

        # ASSERT
        for i, oid in enumerate(ids):
            assert results[i]["id"] == str(oid)    # Order must be preserved
