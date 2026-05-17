"""
conftest.py — Shared fixtures available to ALL test files automatically.

pytest discovers this file and makes every fixture here globally available
without any explicit import. Think of it as the "setup" that runs before tests.
"""

import pytest
from beanie import init_beanie
from mongomock_motor import AsyncMongoMockClient

from models import User, Organization, Project, Proposal


# ─────────────────────────────────────────────────────────────────────────────
# DATABASE FIXTURE
# ─────────────────────────────────────────────────────────────────────────────
@pytest.fixture
async def mock_db():
    client = AsyncMongoMockClient()
    db = client["test_db"]
    
    # WORKAROUND: Beanie passes arguments like 'authorizedCollections' or 'nameOnly' 
    # to list_collection_names, but mongomock-motor doesn't support them.
    original_list_collection_names = db.list_collection_names
    async def patched_list_collection_names(*args, **kwargs):
        try:
            return await original_list_collection_names(*args, **kwargs)
        except TypeError:
            # If it fails due to unexpected kwargs, try calling without them
            return await original_list_collection_names(*args)
    
    db.list_collection_names = patched_list_collection_names

    await init_beanie(
        database=db,
        document_models=[User, Organization, Project, Proposal],
    )
    yield
    # No manual teardown needed — in-memory DB is discarded automatically
