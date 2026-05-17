"""
test_project_service.py — Unit tests for services/project_service.py

WHAT WE'RE TESTING:
  The project service manages the lifecycle of projects in MongoDB using the
  Beanie ORM. We test creating, retrieving single projects, and listing all
  projects for a user.

WHY THESE TESTS MATTER:
  - Ensures data integrity when saving to MongoDB.
  - Verifies that error handling correctly captures and re-raises DB exceptions.
  - Confirms that filtering logic (like getting projects by user_id) is implemented.

PATTERN USED: AAA (Arrange → Act → Assert)
  Each test mocks the Beanie 'Project' model to avoid real database connections.
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from bson import ObjectId
from services.project_service import (
    create_project_service,
    get_project_service,
    get_all_projects_service,
)

# ─────────────────────────────────────────────────────────────────────────────
# HELPER: create a fake Project document
# ─────────────────────────────────────────────────────────────────────────────
def make_mock_project(title="Test Project", description="Test Description"):
    """
    Creates a MagicMock that simulates a Beanie Project document.
    """
    mock = MagicMock()
    mock.id = ObjectId()
    mock.title = title
    mock.description = description
    mock.rfp_data = {"key": "value"}
    mock.user_id = ObjectId()
    mock.insert = AsyncMock()  # Async method must use AsyncMock
    return mock

class TestProjectService:
    """
    Groups tests for Project lifecycle service functions.
    """

    @pytest.mark.asyncio
    async def test_create_project_success(self):
        """
        WHAT: Verifies that create_project_service saves a new project.
        WHY:  Ensures the service correctly instantiates the Project model
              with the provided fields and awaits the insert() call.
        """
        # ARRANGE
        fake_user_id = ObjectId()
        with patch("services.project_service.Project") as MockProject:
            mock_instance = make_mock_project()
            MockProject.return_value = mock_instance
            
            # ACT
            result = await create_project_service(
                title="New Project",
                description="Desc",
                rfp_data={"info": "data"},
                user_id=fake_user_id
            )
            
            # ASSERT
            assert result == mock_instance
            mock_instance.insert.assert_called_once()
            MockProject.assert_called_once_with(
                title="New Project",
                description="Desc",
                rfp_data={"info": "data"},
                user_id=fake_user_id
            )

    @pytest.mark.asyncio
    async def test_create_project_failure(self):
        """
        WHAT: Tests error handling when MongoDB insert fails.
        WHY:  Confirms the service doesn't swallow errors and provides a
              useful error message for the API layer.
        """
        # ARRANGE
        with patch("services.project_service.Project") as MockProject:
            mock_instance = make_mock_project()
            mock_instance.insert = AsyncMock(side_effect=Exception("DB Error"))
            MockProject.return_value = mock_instance
            
            # ACT & ASSERT
            with pytest.raises(Exception, match="Failed to create project"):
                await create_project_service("T", "D", {}, ObjectId())

    @pytest.mark.asyncio
    async def test_get_project_success(self):
        """
        WHAT: Verifies fetching a single project by ID.
        WHY:  Ensures the service uses the correct Beanie query (Project.get).
        """
        # ARRANGE
        fake_id = ObjectId()
        mock_instance = make_mock_project()
        with patch("services.project_service.Project.get", new_callable=AsyncMock) as mock_get:
            mock_get.return_value = mock_instance
            
            # ACT
            result = await get_project_service(fake_id)
            
            # ASSERT
            assert result == mock_instance
            mock_get.assert_called_once_with(fake_id)

    @pytest.mark.asyncio
    async def test_get_project_failure(self):
        """
        WHAT: Tests error handling when fetching a project fails.
        WHY:  Ensures the service handles DB exceptions gracefully.
        """
        # ARRANGE
        with patch("services.project_service.Project.get", new_callable=AsyncMock) as mock_get:
            mock_get.side_effect = Exception("Not found")
            
            # ACT & ASSERT
            with pytest.raises(Exception, match="Failed to get project"):
                await get_project_service(ObjectId())

    @pytest.mark.asyncio
    async def test_get_all_projects_success(self):
        """
        WHAT: Verifies fetching all projects for a specific user.
        WHY:  Ensures the search filter and chained to_list() call are correct.
        """
        # ARRANGE
        fake_user_id = ObjectId()
        mock_projects = [make_mock_project(), make_mock_project()]
        with patch("services.project_service.Project") as MockProject:
            mock_query = MagicMock()
            mock_query.to_list = AsyncMock(return_value=mock_projects)
            MockProject.find.return_value = mock_query
            
            # ACT
            result = await get_all_projects_service(fake_user_id)
            
            # ASSERT
            assert result == mock_projects
            MockProject.find.assert_called_once()

    @pytest.mark.asyncio
    async def test_get_all_projects_failure(self):
        """
        WHAT: Tests error handling for bulk project fetching.
        WHY:  Ensures query errors are caught and re-raised correctly.
        """
        # ARRANGE
        with patch("services.project_service.Project") as MockProject:
            MockProject.find.side_effect = Exception("Query error")
            
            # ACT & ASSERT
            with pytest.raises(Exception, match="Failed to get all projects"):
                await get_all_projects_service(ObjectId())
