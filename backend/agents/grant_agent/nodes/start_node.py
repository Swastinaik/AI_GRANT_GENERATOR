import logging
from agents.grant_agent.states.grant_state import GrantState
from agents.grant_agent.utils.constants import default_sections

logger = logging.getLogger(__name__)

def start_node(state: GrantState) -> GrantState:
    try:
        if state.get("default_section"):
            state["sections"] = {}
            top_8_keys = list(default_sections.keys())[:8]
            for key in top_8_keys:
                state["sections"][key] = {
                    "context": {
                        **default_sections[key],
                        "predefined_name": key,
                        "org_data": None
                    },
                    "constraints": None,
                    "content": None
                }
        return state
    except Exception as e:
        logger.error(f"[start_node] Failed to initialize sections: {e}", exc_info=True)
        state["error"] = f"start_node error: {str(e)}"
        return state