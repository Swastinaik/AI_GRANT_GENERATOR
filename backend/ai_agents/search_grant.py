from typing import TypedDict, List, Dict, Annotated
import operator
import asyncio
import requests
from langgraph.graph import StateGraph
from langchain_core.prompts import PromptTemplate
from langchain_core.prompts import PromptTemplate
import os
import httpx
from langchain_google_genai import GoogleGenerativeAI
from dotenv import load_dotenv
load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")
class GrantState(TypedDict):
    keyword: str
    description: str
    grants: List[Dict[str, any]]  # List of grant dicts
llm = GoogleGenerativeAI(model="gemini-2.0-flash")

class SearchGrants:
    """This class contains the nodes for searching and scoring grants."""
    def __init__(self, keyword, description):
        self.keyword = keyword
        self.description = description

        self.workflow = StateGraph(state_schema=GrantState)

        self.workflow.add_node("search_grants", self.search_grants)
        self.workflow.add_node("fetch_and_score", self.fetch_and_score_grants)
        self.workflow.add_edge("search_grants", "fetch_and_score")
        self.workflow.set_entry_point("search_grants")
        self.workflow.set_finish_point("fetch_and_score")
        self.graph = self.workflow.compile()

    async def search_grants(self,state: GrantState) -> GrantState:
        print("Invoking the search_grants function")
        keyword = state["keyword"]
        api_url = "https://api.grants.gov/v1/api/search2"
        payload = {
            "keyword": keyword,
            "rows": 10
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(api_url, json=payload)
        if response.status_code != 200:
            raise ValueError("API request failed")

        data = response.json()  # Assuming JSON response
        grants = []
        grants_from_api=data["data"]["oppHits"]
        print("aPi accessd successfully")
        for item in grants_from_api:  # Adjust based on actual response structure
            id_=item.get("id")
            grant = {
                "id": item.get("id"),
                "title": item.get("title"),
                "agency": item.get("agency"),
                "agencyCode": item.get("agencyCode"),
                "openDate": item.get("openDate"),
                "closeDate": item.get("closeDate"),
                "link": f'https://grants.gov/search-results-detail/{id_}'
            }
            grants.append(grant)
        print("Generated grants for state")
        return {"grants": grants}

      # Or your preferred LLM

    async def fetch_and_score_grants(self, state: GrantState) -> GrantState:
        user_description=state['description']
        grants=state['grants']
        api_url = "https://api.grants.gov/v1/api/fetchOpportunity"
        print("About to llm for scoring")
        async def process_grant(grant):
            payload = {"opportunityId": grant["id"]}
            async with httpx.AsyncClient() as client:
                grant_detail_request = await client.post(api_url, json=payload)
            if grant_detail_request.status_code != 200:
                print(f"Failed to fetch details for grant {grant['id']}")
                return
            grant_detail = grant_detail_request.json()
            grant_synopsis = grant_detail.get('data', {}).get('synopsis', {}).get('synopsisDesc')
            if not grant_synopsis:
                print(f"No synopsis for grant {grant['id']}")
                return
            words = grant_synopsis.split()
            truncated_synopsis = ' '.join(words[:150]) or "No description available, give a valid score"
            prompt = PromptTemplate(
                input_variables=["description", "synopsis"],
                template="Score relevance of this grant synopsis to the project description from 1 to 100. Be blunt and honest; if found something incorrect, don't hesitate to reduce score; remain neutral.\nProject: {description}\nSynopsis: {synopsis}\nOutput only the score as an integer."
            )
            chain = prompt | llm
            score_str = await chain.ainvoke({"description": user_description, "synopsis": truncated_synopsis})
            print("Schema for score:", score_str)
            try:
                grant["score"] = int(score_str.strip())  # Parse score with error handling
            except ValueError:
                print(f"Invalid score from LLM for grant {grant['id']}: {score_str}")
                grant["score"] = 0
        await asyncio.gather(*[process_grant(grant) for grant in grants])
        print("Scored all gants based on description")
        sorted_grants = sorted(grants, key=lambda x: x.get("score",0),reverse=True)
        return {"grants":sorted_grants}


    async def invoke_graph(self):
        result = await self.graph.ainvoke({"keyword":self.keyword,"description":self.description,"grants":[]})
        return result['grants']

"""keyword = "education"  # Example keyword
description = "This project aims to improve educational outcomes through innovative teaching methods and technology integration."


search_grants = SearchGrants(keyword, description)
result = search_grants.invoke_graph()
print("Grants found:")
print(result["grants"])

"""

