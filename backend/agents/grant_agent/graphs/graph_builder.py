from langgraph.graph import StateGraph, START, END
from agents.grant_agent.states.grant_state import GrantState
from agents.grant_agent.nodes import (
    start_node,
    end_node,
    grant_generation_node,
    section_router,
    orgdata_fetch_node,
    section_normalize_node
)


workflow = StateGraph(GrantState)


workflow.add_node("start", start_node)
workflow.add_node("end", end_node)
workflow.add_node("grant_generation", grant_generation_node)
workflow.add_node("orgdata_fetch", orgdata_fetch_node)
workflow.add_node("section_normalize", section_normalize_node)


workflow.add_edge(START, "start")
workflow.add_conditional_edges("start",
                        section_router,
                        {
                            "orgdata_fetch": "orgdata_fetch",
                            "section_normalize": "section_normalize"
                        })
workflow.add_edge("section_normalize", "orgdata_fetch")
workflow.add_edge("orgdata_fetch", "grant_generation")
workflow.add_edge("grant_generation","end")
workflow.add_edge("end",END)



graph = workflow.compile()
