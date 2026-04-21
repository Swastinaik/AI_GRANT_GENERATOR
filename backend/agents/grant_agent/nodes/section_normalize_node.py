import logging
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from agents.grant_agent.states.grant_state import GrantState
from agents.grant_agent.prompts.section_normalize import section_normalize_prompt
from agents.grant_agent.llms.gemini_llm import gemini_llm
from agents.grant_agent.utils.constants import default_sections

logger = logging.getLogger(__name__)

async def section_normalize_node(state: GrantState) -> GrantState:
    try:
        sections = state['sections']
        if sections is None:
            return state

        sections_name = list(sections.keys())
        llm = gemini_llm()
        prompt_template = PromptTemplate.from_template(section_normalize_prompt)
        parser = JsonOutputParser()
        chain = prompt_template | llm | parser
        response = await chain.ainvoke({"user_sections": sections_name})

        for user_sec, predefined_sec in response.items():
            if predefined_sec not in default_sections:
                raise KeyError(
                    f"LLM returned unknown predefined section '{predefined_sec}' "
                    f"for user section '{user_sec}'"
                )
            state['sections'][user_sec]['context'] = {
                **default_sections[predefined_sec],
                'predefined_name': predefined_sec
            }
        return state
    except Exception as e:
        logger.error(f"[section_normalize_node] Failed to normalize sections: {e}", exc_info=True)
        state["error"] = f"section_normalize_node error: {str(e)}"
        return state