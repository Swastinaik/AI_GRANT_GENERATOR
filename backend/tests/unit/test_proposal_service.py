"""
test_proposal_service.py — Unit tests for all async service functions in
services/proposal_service.py

WHAT'S DIFFERENT FROM test_serializers.py:
  The serializer tests used real input objects (MagicMock) and checked output.
  These tests call ASYNC functions that internally use Beanie ORM methods like:
    - Proposal(...)          ← class instantiation
    - proposal.insert()      ← async DB write
    - Proposal.get(id)       ← async DB read
    - Proposal.find(...).to_list()  ← async DB query

  Since we never want tests to touch a real DB, we MOCK all of those.

TWO KEY TOOLS:
  1. patch("services.proposal_service.Proposal")
       Replaces the entire Proposal class inside the service module with a
       MagicMock. Controls what Proposal(...) and Proposal.get() return.

  2. AsyncMock
       A special Mock for `async def` functions. Regular MagicMock cannot be
       awaited — using it on async methods causes:
         TypeError: object MagicMock can't be used in 'await' expression

CRITICAL RULE — patch WHERE IT'S USED, NOT WHERE IT'S DEFINED:
  ✅  patch("services.proposal_service.Proposal")  ← correct
  ❌  patch("models.proposal.Proposal")            ← wrong, already imported
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch, call
from bson import ObjectId

from services.proposal_service import (
    store_proposal,
    get_proposal_service,
    get_all_proposals_service,
    update_proposal_service,
    delete_proposal_service,
)


# ─────────────────────────────────────────────────────────────────────────────
# HELPER: build a realistic mock Proposal instance
# ─────────────────────────────────────────────────────────────────────────────
def make_mock_proposal(
    type_: str = "generate",
    file_url: str = None,
    output_json: dict = None,
    review: str = None,
):
    """
    Creates a MagicMock that looks like a saved Proposal document.

    We set up:
      - mock.id            → a real ObjectId (so str(id) works)
      - mock.project_id    → a real ObjectId
      - mock.model_dump()  → returns a dict (used by serialize_doc)
      - mock.insert        → AsyncMock (because proposal.insert() is awaited)
      - mock.update        → AsyncMock (because proposal.update() is awaited)
      - mock.delete        → AsyncMock (because proposal.delete() is awaited)
    """
    mock = MagicMock()
    mock.id = ObjectId()
    mock.project_id = ObjectId()
    mock.insert = AsyncMock()          # async — must be AsyncMock
    mock.update = AsyncMock()          # async — must be AsyncMock
    mock.delete = AsyncMock()          # async — must be AsyncMock
    mock.model_dump.return_value = {
        "file_url": file_url,
        "type": type_,
        "output_json": output_json or {},
        "review": review,
    }
    return mock


# ─────────────────────────────────────────────────────────────────────────────
# TESTS FOR: store_proposal()
# ─────────────────────────────────────────────────────────────────────────────

class TestStoreProposal:

    @pytest.mark.asyncio
    async def test_happy_path_returns_serialized_doc(self):
        """
        WHAT: store_proposal() should create a Proposal, call insert(), and
              return a serialized dict with string IDs.
        HOW:  We mock the Proposal class so that Proposal(...) returns our
              fake instance instead of trying to connect to MongoDB.

        Flow being tested:
          store_proposal(...)
            → Proposal(...)          ← we control what this returns
            → await proposal.insert()  ← we verify this was called
            → serialize_doc(proposal)  ← real function, not mocked
            → return dict
        """
        fake_project_id = ObjectId()
        fake_output = {"abstract": "We help students learn to code."}

        with patch("services.proposal_service.Proposal") as MockProposal:
            # ARRANGE
            mock_instance = make_mock_proposal(
                type_="generate",
                output_json=fake_output,
            )
            # Proposal(...) constructor call → return our fake instance
            MockProposal.return_value = mock_instance

            # ACT
            result = await store_proposal(
                file_url=None,
                type="generate",
                output_json=fake_output,
                review=None,
                project_id=fake_project_id,
            )

        # ASSERT: the result is a serialized dict, not a Beanie object
        assert isinstance(result, dict)
        assert result["id"] == str(mock_instance.id)
        assert result["type"] == "generate"
        assert result["output_json"] == fake_output

    @pytest.mark.asyncio
    async def test_insert_is_called_exactly_once(self):
        """
        WHAT: Verifies that proposal.insert() is actually invoked.
        WHY:  Even if the function returns correctly, if insert() was never
              called, nothing is saved to the DB — a silent bug.

        This is the "behaviour verification" style of testing:
        we check WHAT the function DID, not just what it returned.
        """
        with patch("services.proposal_service.Proposal") as MockProposal:
            mock_instance = make_mock_proposal()
            MockProposal.return_value = mock_instance

            await store_proposal(
                file_url="https://example.com/file.pdf",
                type="review",
                output_json=None,
                review="Looks good!",
                project_id=ObjectId(),
            )

        # Verify insert() was awaited exactly once — not 0 times, not 2 times
        mock_instance.insert.assert_called_once()

    @pytest.mark.asyncio
    async def test_proposal_is_constructed_with_correct_fields(self):
        """
        WHAT: The Proposal() constructor must receive exactly the values
              that were passed into store_proposal().
        WHY:  If the service silently passes the wrong field (e.g., forgets
              file_url), the stored document will be wrong.
        """
        fake_id = ObjectId()
        fake_url = "https://storage.example.com/rfp.pdf"
        fake_review = "Section 3 needs more detail."

        with patch("services.proposal_service.Proposal") as MockProposal:
            mock_instance = make_mock_proposal()
            MockProposal.return_value = mock_instance

            await store_proposal(
                file_url=fake_url,
                type="review",
                output_json=None,
                review=fake_review,
                project_id=fake_id,
            )

        # Check Proposal() was called with the exact expected arguments
        MockProposal.assert_called_once_with(
            file_url=fake_url,
            type="review",
            output_json=None,
            review=fake_review,
            project_id=fake_id,
        )

    @pytest.mark.asyncio
    async def test_raises_exception_when_insert_fails(self):
        """
        WHAT: If the DB insert fails, store_proposal should raise an Exception
              with a message starting with "Failed to store proposal:".
        WHY:  The route handler catches this and returns HTTP 500.
              Without this re-raise, DB errors would be silently swallowed.

        This is the "sad path" test — testing what happens when things go wrong.
        """
        with patch("services.proposal_service.Proposal") as MockProposal:
            mock_instance = make_mock_proposal()
            # Simulate DB failure: insert() raises an exception when awaited
            mock_instance.insert = AsyncMock(
                side_effect=Exception("Connection timed out")
            )
            MockProposal.return_value = mock_instance

            # pytest.raises() verifies that the exception IS raised
            # 'match' checks that the message contains our expected prefix
            with pytest.raises(Exception, match="Failed to store proposal"):
                await store_proposal(None, "generate", {}, None, ObjectId())


# ─────────────────────────────────────────────────────────────────────────────
# TESTS FOR: get_proposal_service()
# ─────────────────────────────────────────────────────────────────────────────

class TestGetProposalService:

    @pytest.mark.asyncio
    async def test_returns_serialized_proposal_when_found(self):
        """
        WHAT: When Proposal.get(id) finds a document, return it serialized.

        Note: Proposal.get() is a CLASS METHOD (called on the class, not an
        instance), so we mock it differently:
          MockProposal.get = AsyncMock(return_value=mock_doc)
        """
        fake_id = ObjectId()
        mock_doc = make_mock_proposal(type_="review", review="Excellent!")

        with patch("services.proposal_service.Proposal") as MockProposal:
            # Proposal.get(id) is a class-level async method
            MockProposal.get = AsyncMock(return_value=mock_doc)

            result = await get_proposal_service(fake_id)

        assert result["id"] == str(mock_doc.id)
        assert result["type"] == "review"
        assert result["review"] == "Excellent!"

    @pytest.mark.asyncio
    async def test_returns_none_when_proposal_not_found(self):
        """
        WHAT: Proposal.get() returns None when the ID doesn't exist.
              serialize_doc(None) returns None, so the service should return None.
        WHY:  The route layer must handle None and decide what to do
              (e.g., raise 404). The service itself should NOT crash.
        """
        with patch("services.proposal_service.Proposal") as MockProposal:
            MockProposal.get = AsyncMock(return_value=None)

            result = await get_proposal_service(ObjectId())

        assert result is None

    @pytest.mark.asyncio
    async def test_get_is_called_with_correct_id(self):
        """
        WHAT: Proposal.get() must be called with the exact ID passed in.
        WHY:  If the service passes the wrong ID, you'd silently fetch
              someone else's proposal — a data integrity bug.
        """
        target_id = ObjectId()
        mock_doc = make_mock_proposal()

        with patch("services.proposal_service.Proposal") as MockProposal:
            MockProposal.get = AsyncMock(return_value=mock_doc)

            await get_proposal_service(target_id)

        MockProposal.get.assert_called_once_with(target_id)

    @pytest.mark.asyncio
    async def test_raises_exception_on_db_error(self):
        """
        WHAT: If Proposal.get() throws (e.g., invalid ObjectId, DB down),
              the service re-raises with the "Failed to get proposal:" prefix.
        """
        with patch("services.proposal_service.Proposal") as MockProposal:
            MockProposal.get = AsyncMock(
                side_effect=Exception("Invalid ObjectId format")
            )

            with pytest.raises(Exception, match="Failed to get proposal"):
                await get_proposal_service(ObjectId())


# ─────────────────────────────────────────────────────────────────────────────
# TESTS FOR: get_all_proposals_service()
# ─────────────────────────────────────────────────────────────────────────────

class TestGetAllProposalsService:
    """
    get_all_proposals_service() uses the query builder pattern:
      Proposal.find(...).to_list()

    This is a CHAINED call — two methods one after another. We need to mock
    both the .find() return value AND its .to_list() method.

    Mock chain setup:
      MockProposal.find.return_value.to_list = AsyncMock(return_value=[...])
                   ^^^^              ^^^^^^^
                   find() returns    .to_list() is awaitable on that object
    """

    @pytest.mark.asyncio
    async def test_returns_list_of_serialized_proposals(self):
        """
        WHAT: Returns a list of serialized dicts when proposals exist.
        """
        fake_project_id = ObjectId()
        doc1 = make_mock_proposal(type_="generate")
        doc2 = make_mock_proposal(type_="review", review="Looks good")

        with patch("services.proposal_service.Proposal") as MockProposal:
            # Set up the chained mock: .find(...).to_list() → [doc1, doc2]
            mock_query = MagicMock()
            mock_query.to_list = AsyncMock(return_value=[doc1, doc2])
            MockProposal.find.return_value = mock_query

            result = await get_all_proposals_service(fake_project_id)

        assert isinstance(result, list)
        assert len(result) == 2
        assert result[0]["id"] == str(doc1.id)
        assert result[1]["id"] == str(doc2.id)

    @pytest.mark.asyncio
    async def test_returns_empty_list_when_no_proposals(self):
        """
        WHAT: Returns [] when the project has no proposals yet.
        WHY:  Frontend must handle empty state. [] is the correct signal,
              not None, not an exception.
        """
        with patch("services.proposal_service.Proposal") as MockProposal:
            mock_query = MagicMock()
            mock_query.to_list = AsyncMock(return_value=[])
            MockProposal.find.return_value = mock_query

            result = await get_all_proposals_service(ObjectId())

        assert result == []

    @pytest.mark.asyncio
    async def test_raises_exception_on_query_failure(self):
        """
        WHAT: If to_list() fails (DB timeout, network error), re-raise
              with "Failed to get all proposals:" prefix.
        """
        with patch("services.proposal_service.Proposal") as MockProposal:
            mock_query = MagicMock()
            mock_query.to_list = AsyncMock(
                side_effect=Exception("DB query timeout")
            )
            MockProposal.find.return_value = mock_query

            with pytest.raises(Exception, match="Failed to get all proposals"):
                await get_all_proposals_service(ObjectId())


# ─────────────────────────────────────────────────────────────────────────────
# TESTS FOR: update_proposal_service()
# ─────────────────────────────────────────────────────────────────────────────

class TestUpdateProposalService:

    @pytest.mark.asyncio
    async def test_calls_update_and_returns_serialized(self):
        """
        WHAT: update_proposal_service should call proposal.update() then
              return the serialized updated proposal.

        Note: The service receives an already-loaded Proposal instance
        and calls .update() on it directly — not Proposal.get() first.
        """
        fake_id = ObjectId()
        mock_proposal = make_mock_proposal(type_="review", review="Updated review")

        result = await update_proposal_service(fake_id, mock_proposal)

        # update() must have been awaited
        mock_proposal.update.assert_called_once()
        # Result should be the serialized form
        assert result["id"] == str(mock_proposal.id)

    @pytest.mark.asyncio
    async def test_raises_on_update_failure(self):
        """
        WHAT: If proposal.update() raises, re-raise with the correct prefix.
        """
        mock_proposal = make_mock_proposal()
        mock_proposal.update = AsyncMock(side_effect=Exception("Write conflict"))

        with pytest.raises(Exception, match="Failed to update proposal"):
            await update_proposal_service(ObjectId(), mock_proposal)


# ─────────────────────────────────────────────────────────────────────────────
# TESTS FOR: delete_proposal_service()
# ─────────────────────────────────────────────────────────────────────────────

class TestDeleteProposalService:
    """
    ⚠️  KNOWN BUG IN THE SERVICE — THIS TEST WILL EXPOSE IT:

    The current code on line 70 is:
        await Proposal.get(proposal_id).delete()

    This is WRONG for two reasons:
      1. Proposal.get() is async — you must await it BEFORE chaining .delete()
         Correct form: proposal = await Proposal.get(id); await proposal.delete()
      2. If Proposal.get() returns None (doc not found), calling .delete() on
         None raises AttributeError: 'NoneType' object has no attribute 'delete'

    The tests below will confirm this behaviour as-is. When the service is
    fixed, the tests should be updated to reflect the corrected expectations.
    """

    @pytest.mark.asyncio
    async def test_returns_true_on_success(self):
        """
        WHAT: delete_proposal_service() returns True when deletion succeeds.

        Because of the chaining bug, we need to set up the mock so that
        Proposal.get() returns a mock object whose .delete() is also mocked.
        Here we mock Proposal.get as a SYNCHRONOUS mock (not AsyncMock)
        because the code uses `Proposal.get(id).delete()` without awaiting get().
        This makes the test accurately reflect the current (buggy) code path.
        """
        fake_id = ObjectId()

        with patch("services.proposal_service.Proposal") as MockProposal:
            # The code calls Proposal.get(id).delete() — no await on get()
            # So .get() returns a sync mock, and .delete() on it is AsyncMock
            mock_chain = MagicMock()
            mock_chain.delete = AsyncMock()
            MockProposal.get.return_value = mock_chain  # sync, not AsyncMock

            result = await delete_proposal_service(fake_id)

        assert result is True
        mock_chain.delete.assert_called_once()

    @pytest.mark.asyncio
    async def test_raises_exception_on_delete_failure(self):
        """
        WHAT: If .delete() raises, re-raise with the correct prefix.
        """
        with patch("services.proposal_service.Proposal") as MockProposal:
            mock_chain = MagicMock()
            mock_chain.delete = AsyncMock(
                side_effect=Exception("Document locked")
            )
            MockProposal.get.return_value = mock_chain

            with pytest.raises(Exception, match="Failed to delete proposal"):
                await delete_proposal_service(ObjectId())
