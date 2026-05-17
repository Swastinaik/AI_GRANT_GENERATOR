from langgraph.graph import StateGraph
from agents.search_agent.states.search_state import SearchState
from agents.search_agent.nodes import (
    fetch_grant_node,
    score_grant_node,
    keyword_generate_node,
)

workflow = StateGraph(SearchState)

workflow.add_node("fetch_grant", fetch_grant_node)
workflow.add_node("score_grant", score_grant_node)
workflow.add_node("keyword_generate", keyword_generate_node)

workflow.set_entry_point("keyword_generate")
workflow.add_edge("keyword_generate", "fetch_grant")
workflow.add_edge("fetch_grant", "score_grant")
workflow.set_finish_point("score_grant")

search_graph = workflow.compile()