from models.proposal import Proposal
from fastapi.encoders import jsonable_encoder
from beanie import PydanticObjectId

#serliazer for proposal
def serialize_docs(docs):
    return [serialize_doc(doc) for doc in docs]

def serialize_doc(doc):
    if not doc:
        return doc
    # Convert Pydantic/Beanie Model to a dictionary
    doc_dict = doc.model_dump()
    # Safely attach the stringified IDs since 'Proposal' is not subscriptable directly
    doc_dict['id'] = str(doc.id) if doc.id else None
    doc_dict['project_id'] = str(doc.project_id) if hasattr(doc, 'project_id') and doc.project_id else None
    return doc_dict



async def store_proposal(
    file_url: str| None,
    type: str,
    output_json: dict | None,
    review: str | None,
    project_id: PydanticObjectId | str
):
    try:
        proposal = Proposal(
            file_url=file_url,
            type=type,
            output_json=output_json,
            review=review,
            project_id=project_id
    )
        await proposal.insert()
        proposal = serialize_doc(proposal)
        return proposal
    except Exception as e:
        raise Exception(f"Failed to store proposal: {str(e)}")

async def get_proposal_service(proposal_id: PydanticObjectId):
    try:
        proposal = await Proposal.get(proposal_id)
        proposal = serialize_doc(proposal)
        return proposal
    except Exception as e:
        raise Exception(f"Failed to get proposal: {str(e)}")

async def get_all_proposals_service(project_id: PydanticObjectId):
    try:
        proposals = await Proposal.find(Proposal.project_id == project_id).to_list()
        print(proposals)
        proposals = serialize_docs(proposals)
        return proposals
    except Exception as e:
        print(str(e))
        raise Exception(f"Failed to get all proposals: {str(e)}")

async def update_proposal_service(proposal_id: PydanticObjectId, proposal: Proposal):
    try:
        await proposal.update(update_fields=proposal)
        proposal = serialize_doc(proposal)
        return proposal
    except Exception as e:
        raise Exception(f"Failed to update proposal: {str(e)}")

async def delete_proposal_service(proposal_id: PydanticObjectId):
    try:
        await Proposal.get(proposal_id).delete()
        return True
    except Exception as e:
        raise Exception(f"Failed to delete proposal: {str(e)}")
