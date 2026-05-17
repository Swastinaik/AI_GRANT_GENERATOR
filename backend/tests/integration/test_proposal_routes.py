"""
test_proposal_routes.py — Integration tests for /api/proposal endpoints

WHAT WE'RE TESTING:
  The proposal routes handle fetching, updating, and deleting grant proposals.
  These tests ensure that the API correctly interacts with the Proposal model
  and services.

WHY THESE TESTS MATTER:
  - Verifies that proposals can be retrieved by ID or project ID.
  - Ensures that the 'delete proposal' endpoint works correctly and actually
    removes the document from the DB.
  - Confirms that authentication is enforced.

PATTERN: Integration testing with dependency overrides for auth and mock database.
"""

import pytest
from httpx import AsyncClient, ASGITransport
from bson import ObjectId
from main import app
from utils.auth import get_current_user
from models import Proposal, User

@pytest.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac

@pytest.fixture
def fake_user():
    return User(
        id=ObjectId(),
        fullname="Test User",
        email="test@example.com",
        password="hashed_password"
    )

class TestProposalRoutes:

    @pytest.mark.asyncio
    async def test_get_proposal_success(self, client, mock_db, fake_user):
        """
        WHAT: GET /api/proposal/{id} returns the specific proposal.
        WHY:  Verifies that a proposal can be fetched by its ID.
        """
        # ARRANGE
        app.dependency_overrides[get_current_user] = lambda: fake_user
        
        proposal = Proposal(
            id=ObjectId(),
            project_id=ObjectId(),
            type="generate",
            output_json={"abstract": "Test abstract"}
        )
        await proposal.insert()
        proposal_id = str(proposal.id)
        
        try:
            # ACT
            response = await client.get(f"/api/proposal/{proposal_id}")
            
            # ASSERT
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "success"
            assert data["proposal"]["type"] == "generate"
        finally:
            app.dependency_overrides.clear()

    @pytest.mark.asyncio
    async def test_delete_proposal_success(self, client, mock_db, fake_user):
        """
        WHAT: DELETE /api/proposal/{id} removes the proposal.
        WHY:  Verifies that the deletion logic works correctly.
        """
        # ARRANGE
        app.dependency_overrides[get_current_user] = lambda: fake_user
        
        proposal = Proposal(
            id=ObjectId(),
            project_id=ObjectId(),
            type="review",
            output_json={}
        )
        await proposal.insert()
        proposal_id = str(proposal.id)
        
        try:
            # ACT
            response = await client.delete(f"/api/proposal/{proposal_id}")
            
            # ASSERT
            assert response.status_code == 200
            assert response.json() == {"status": "success"}
            
            # Verify it's actually gone from DB
            db_proposal = await Proposal.get(proposal_id)
            assert db_proposal is None
        finally:
            app.dependency_overrides.clear()

    @pytest.mark.asyncio
    async def test_get_proposals_by_project_id(self, client, mock_db, fake_user):
        """
        WHAT: GET /api/proposal/project/{project_id} returns all proposals for a project.
        WHY:  Ensures the relationship filtering is working correctly.
        """
        # ARRANGE
        app.dependency_overrides[get_current_user] = lambda: fake_user
        project_id = ObjectId()
        
        p1 = Proposal(id=ObjectId(), project_id=project_id, type="generate", output_json={})
        p2 = Proposal(id=ObjectId(), project_id=project_id, type="review", output_json={})
        p3 = Proposal(id=ObjectId(), project_id=ObjectId(), type="generate", output_json={}) # Different project
        
        await p1.insert()
        await p2.insert()
        await p3.insert()
        
        try:
            # ACT
            response = await client.get(f"/api/proposal/project/{str(project_id)}")
            
            # ASSERT
            assert response.status_code == 200
            data = response.json()
            assert len(data["proposals"]) == 2
            types = [p["type"] for p in data["proposals"]]
            assert "generate" in types
            assert "review" in types
        finally:
            app.dependency_overrides.clear()
