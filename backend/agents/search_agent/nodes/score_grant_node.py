import httpx
import asyncio
import logging

from langchain_core.prompts import PromptTemplate
from agents.search_agent.prompts.scoring_grant_prompt import scoring_prompt
from agents.search_agent.llms.groq_llm import groq_llm
from agents.search_agent.states.search_state import SearchState

logger = logging.getLogger(__name__)

FETCH_TIMEOUT = 30.0  # seconds


async def score_grant_node(state: SearchState):
    grants = state.get("grants")
    user_input = state.get("user_input")
    description = user_input.get("description")
    api_url = "https://api.grants.gov/v1/api/fetchOpportunity"

    async def process_grant(grant):
        payload = {"opportunityId": grant["grant_id"]}
        try:
            async with httpx.AsyncClient(timeout=FETCH_TIMEOUT) as client:
                grant_detail_request = await client.post(api_url, json=payload)
        except httpx.TimeoutException:
            logger.warning(f"Timeout fetching grant details for id={grant['id']}")
            return None
        except Exception as e:
            logger.error(f"HTTP error fetching grant id={grant['grant_id']}: {e}")
            return None

        if grant_detail_request.status_code != 200:
            logger.warning(
                f"Non-200 response for grant id={grant['grant_id']}: "
                f"{grant_detail_request.status_code}"
            )
            return None

        grant_detail = grant_detail_request.json()
        grant_synopsis = (
            grant_detail.get("data", {})
            .get("synopsis", {})
            .get("synopsisDesc")
        )
        if not grant_synopsis:
            logger.warning(f"No synopsis for grant id={grant['id']}, skipping.")
            return None

        words = grant_synopsis.split()
        truncated_synopsis = (
            " ".join(words[:150]) or "No description available, give a valid score"
        )
        prompt_template = PromptTemplate.from_template(scoring_prompt)
        prompt = prompt_template.format(
            description=description,
            grant_description=truncated_synopsis,
        )
        llm = groq_llm()
        try:
            response = await llm.ainvoke(prompt)
            raw_score = response.content.strip()
            # Bug fix: cast score to int so numeric comparison works
            grant["score"] = int(raw_score)
        except (ValueError, TypeError) as e:
            logger.warning(
                f"Could not parse score '{raw_score}' for grant id={grant['grant_id']}: {e}"
            )
            return None
        except Exception as e:
            logger.error(f"LLM error for grant id={grant['id']}: {e}")
            return None

        return grant

    logger.info(f"Scoring {len(grants)} grants...")
    grants_with_scores = await asyncio.gather(
        *[process_grant(grant) for grant in grants]
    )
    logger.info(f"Scoring complete. Raw results count: {len(grants_with_scores)}")

    filtered_grants = [
        grant
        for grant in grants_with_scores
        if grant is not None
        and grant.get("score") is not None
        and grant["score"] >= 10  # now comparing int >= int ✓
    ]
    filtered_grants.sort(key=lambda x: x["score"], reverse=True)

    logger.info(f"Grants after filtering: {len(filtered_grants)}")
    return {"grants": filtered_grants}