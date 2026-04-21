import asyncio
import logging
from langchain_core.prompts import PromptTemplate
from agents.grant_agent.states.grant_state import GrantState
from agents.grant_agent.llms.gemini_llm import gemini_llm
from agents.grant_agent.prompts.section_prompt import section_prompts

logger = logging.getLogger(__name__)


async def generate_section(
    section_name: str,
    section_data: dict,
    rfp_constraints: dict,
    user_input: dict,
    llm
):
    try:
        org_data = section_data['context']['org_data'] or "No organization data available."
        section_constraints = (
            section_data['constraints']
            or "No additional section-specific constraints provided. Follow RFP constraints strictly."
        )
        rfp_constraints_str = rfp_constraints or "No RFP constraints provided."
        section_predefined_name = section_data['context']['predefined_name']
        section_prompt = section_prompts[section_predefined_name]

        prompt_template = PromptTemplate.from_template(section_prompt)
        prompt = prompt_template.format(
            section_name=section_name,
            section_constraints=section_constraints,
            rfp_constraints=rfp_constraints_str,
            user_input=user_input,
            org_data=org_data
        )

        response = await llm.ainvoke(prompt)
        return section_name, response.content
    except Exception as e:
        logger.error(
            f"[generate_section] Failed to generate section '{section_name}': {e}",
            exc_info=True
        )
        return section_name, f"[ERROR] Could not generate section '{section_name}': {str(e)}"


async def grant_generation_node(state: GrantState) -> GrantState:
    try:
        sections = state['sections']
        llm = gemini_llm()
        rfp_constraints = state['rfp_constraints']
        user_input = state['user_input']

        tasks = [
            generate_section(section_name, section_data, rfp_constraints, user_input, llm)
            for section_name, section_data in sections.items()
        ]

        results = await asyncio.gather(*tasks)

        for section_name, content in results:
            state["sections"][section_name]["content"] = content

        return state
    except Exception as e:
        logger.error(f"[grant_generation_node] Fatal error during grant generation: {e}", exc_info=True)
        state["error"] = f"grant_generation_node error: {str(e)}"
        return state
