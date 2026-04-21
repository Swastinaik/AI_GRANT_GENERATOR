import logging
from agents.grant_agent.states.grant_state import GrantState
from utils.vector_config import init_vectorstore

logger = logging.getLogger(__name__)

async def orgdata_fetch_node(state: GrantState) -> GrantState:
    try:
        sections = state["sections"]
        orgId = str(state["orgId"])
        vectorstore = init_vectorstore(orgId)

        for section_name, section_data in sections.items():
            try:
                query = section_data["context"]["org_data_required"]
                docs = vectorstore.similarity_search(query, k=5)
                docs = docs[:3]
                org_data = "\n".join([doc.page_content for doc in docs])
                sections[section_name]["context"]["org_data"] = org_data
            except Exception as section_err:
                logger.warning(
                    f"[orgdata_fetch_node] Failed to fetch org data for section "
                    f"'{section_name}': {section_err}"
                )
                sections[section_name]["context"]["org_data"] = None

        return state
    except Exception as e:
        logger.error(f"[orgdata_fetch_node] Fatal error during org data fetch: {e}", exc_info=True)
        state["error"] = f"orgdata_fetch_node error: {str(e)}"
        return state
