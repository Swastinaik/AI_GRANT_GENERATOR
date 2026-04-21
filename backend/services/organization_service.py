from typing import Dict, Any
from beanie import PydanticObjectId
from models.organization import Organization, OrgData
from services.vector_store import upload_vector_data, update_vector_data

async def create_organization_service(name: str, org_data_dict: Dict[str, Any]) -> Organization:
    """
    Creates an organization in MongoDB, and if org_data_dict is provided, stores it
    and uploads the vectorized version to Pinecone.
    """
    # Create the nested OrgData model if provided
    org_data = OrgData(**org_data_dict) if org_data_dict else None
    
    # Initialize and insert the main Organization document into MongoDB
    org = Organization(name=name, org_data=org_data)
    await org.insert()
    
    # If organization data was provided, vectorize and store in Pinecone
    if org_data_dict:
        # Use the stringified ObjectId as the org_id namespace
        org_id_str = str(org.id)
        upload_vector_data(org_data_dict, org_id_str)
        
    return org

async def update_organization_service(org_id: str, updated_org_data_dict: Dict[str, Any]) -> Organization:
    """
    Updates the organization data in MongoDB and subsequently syncs the updated sections
    in the Pinecone vector database.
    """
    org = await Organization.get(PydanticObjectId(org_id))
    if not org:
        raise ValueError(f"Organization with id {org_id} not found")
        
    if not org.org_data:
        org.org_data = OrgData()
        
    sections_to_be_updated = []
    
    # Update fields in the MongoDB document and track which fields changed
    for key, value in updated_org_data_dict.items():
        if hasattr(org.org_data, key):
            setattr(org.org_data, key, value)
            sections_to_be_updated.append(key)
            
    # Save the updated document back to MongoDB
    await org.save()
    
    # If there are updated sections, sync these changes to Pinecone vector DB
    if sections_to_be_updated:
        update_vector_data(updated_org_data_dict, sections_to_be_updated, org_id)
        
    return org
