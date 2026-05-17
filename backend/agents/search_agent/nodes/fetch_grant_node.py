import asyncio
from agents.search_agent.states.search_state import SearchState
import httpx


async def fetch_grant_node(state: SearchState):
    keyword = state.get("keyword")
    user_input = state.get("user_input")
    eligibilities = user_input.get("eligibilities")
    fundingCategories = user_input.get("domain")
    api_url = "https://api.grants.gov/v1/api/search2"

    payload = {
        "keyword": keyword,
        "eligibilities": eligibilities,
        "fundingCategories": fundingCategories,
        "oppStatuses": "posted",
        "rows":5
        
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(api_url, json=payload)
    if response.status_code != 200:
        raise ValueError("API request failed")


    data = response.json()
    grants_from_api = data["data"]["oppHits"]

    if not grants_from_api:
        raise ValueError("No grants found for the given keyword")
    print("grants from api", grants_from_api)
    grants = []

    for item in grants_from_api:  # Adjust based on actual response structure
        id_=item.get("id")
        grant = {
            "grant_id": item.get("id"),
            "title": item.get("title"),
            "agency": item.get("agency"),
            "agencyCode": item.get("agencyCode"),
            "openDate": item.get("openDate"),
            "closeDate": item.get("closeDate"),
            "link": f'https://grants.gov/search-results-detail/{id_}'
            }
        grants.append(grant)
    
    if not grants:
        raise ValueError("No grants found for the given keyword")

    return {"grants": grants}
        




    
    