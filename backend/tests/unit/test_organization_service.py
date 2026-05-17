"""
test_organization_service.py — Unit tests for services/organization_service.py

WHAT WE'RE TESTING:
  The organization service manages the creation and updates of organizations,
  including synchronization between the MongoDB database and the Pinecone
  vector store.

WHY THESE TESTS MATTER:
  - Verifies that organization data is saved correctly in MongoDB.
  - Ensures that changes are synced to the Pinecone vector store for AI search.
  - Checks that the service handles missing organizations or missing data correctly.

PATTERN USED: AAA (Arrange → Act → Assert)
  We mock both the Beanie 'Organization' model and the external vector store
  utility functions (upload_vector_data, update_vector_data).
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from bson import ObjectId
from services.organization_service import (
    create_organization_service,
    update_organization_service,
)

# ─────────────────────────────────────────────────────────────────────────────
# HELPER: create a fake Organization document
# ─────────────────────────────────────────────────────────────────────────────
def make_mock_org(name="Test Org"):
    """
    Creates a MagicMock that simulates a Beanie Organization document.
    """
    mock = MagicMock()
    mock.id = ObjectId()
    mock.name = name
    mock.org_data = MagicMock()
    mock.insert = AsyncMock()
    mock.save = AsyncMock()
    return mock

class TestOrganizationService:
    """
    Groups tests for Organization lifecycle and vector syncing.
    """

    @pytest.mark.asyncio
    async def test_create_organization_success(self):
        """
        WHAT: Verifies organization creation and initial vector upload.
        WHY:  Ensures that when an organization is created with data,
              the data is also sent to Pinecone for indexing.
        """
        # ARRANGE
        org_name = "Greenpeace"
        org_data_dict = {"mission": "Save the planet"}
        
        with patch("services.organization_service.Organization") as MockOrg, \
             patch("services.organization_service.OrgData") as MockOrgData, \
             patch("services.organization_service.upload_vector_data") as mock_upload:
            
            mock_instance = make_mock_org(name=org_name)
            MockOrg.return_value = mock_instance
            
            # ACT
            result = await create_organization_service(org_name, org_data_dict)
            
            # ASSERT
            assert result == mock_instance
            mock_instance.insert.assert_called_once()
            mock_upload.assert_called_once_with(org_data_dict, str(mock_instance.id))
            MockOrgData.assert_called_once_with(**org_data_dict)

    @pytest.mark.asyncio
    async def test_create_organization_no_data(self):
        """
        WHAT: Verifies creation when no organization data is provided.
        WHY:  Ensures the service doesn't crash if optional data is missing
              and correctly skips the vector upload.
        """
        # ARRANGE
        org_name = "Solo Org"
        with patch("services.organization_service.Organization") as MockOrg, \
             patch("services.organization_service.upload_vector_data") as mock_upload:
            
            mock_instance = make_mock_org(name=org_name)
            MockOrg.return_value = mock_instance
            
            # ACT
            result = await create_organization_service(org_name, None)
            
            # ASSERT
            assert result == mock_instance
            mock_instance.insert.assert_called_once()
            mock_upload.assert_not_called()

    @pytest.mark.asyncio
    async def test_update_organization_success(self):
        """
        WHAT: Verifies updating organization fields and syncing changes to Pinecone.
        WHY:  Ensures that partial updates correctly identify which sections
              changed and triggers a vector database update for those specific fields.
        """
        # ARRANGE
        fake_id = str(ObjectId())
        update_dict = {"mission": "New Mission"}
        
        mock_instance = make_mock_org()
        mock_instance.org_data.mission = "Old Mission"
        
        with patch("services.organization_service.Organization.get", new_callable=AsyncMock) as mock_get, \
             patch("services.organization_service.update_vector_data") as mock_update_vector:
            
            mock_get.return_value = mock_instance
            
            # ACT
            result = await update_organization_service(fake_id, update_dict)
            
            # ASSERT
            assert result == mock_instance
            assert mock_instance.org_data.mission == "New Mission"
            mock_instance.save.assert_called_once()
            mock_update_vector.assert_called_once_with(update_dict, ["mission"], fake_id)

    @pytest.mark.asyncio
    async def test_update_organization_initializes_org_data(self):
        """
        WHAT: Tests that org_data is initialized if it was previously None during update.
        WHY:  Ensures the service can handle organizations that were created
              without data but are now adding it.
        """
        # ARRANGE
        fake_id = str(ObjectId())
        update_dict = {"mission": "New Mission"}
        
        mock_instance = make_mock_org()
        mock_instance.org_data = None # Start with no org_data
        
        with patch("services.organization_service.Organization.get", new_callable=AsyncMock) as mock_get, \
             patch("services.organization_service.OrgData") as MockOrgData, \
             patch("services.organization_service.update_vector_data"):
            
            mock_get.return_value = mock_instance
            mock_new_org_data = MagicMock()
            MockOrgData.return_value = mock_new_org_data
            
            # ACT
            await update_organization_service(fake_id, update_dict)
            
            # ASSERT
            assert mock_instance.org_data == mock_new_org_data
            MockOrgData.assert_called_once()

    @pytest.mark.asyncio
    async def test_update_organization_not_found(self):
        """
        WHAT: Verifies error handling when updating a non-existent organization.
        WHY:  Confirms the service raises a clear ValueError for the API layer.
        """
        # ARRANGE
        with patch("services.organization_service.Organization.get", new_callable=AsyncMock) as mock_get:
            mock_get.return_value = None
            
            # ACT & ASSERT
            with pytest.raises(ValueError, match="Organization with id .* not found"):
                await update_organization_service(str(ObjectId()), {})
