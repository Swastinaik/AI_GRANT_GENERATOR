from langgraph.graph import StateGraph, START, END
from agents.grant_review.states.review_state import GrantReviewState
from agents.grant_review.nodes.review_node import review_node

# Initialize the state graph
workflow = StateGraph(GrantReviewState)

# Add the review node
workflow.add_node("review_proposal", review_node)

# Define the graph structure
workflow.add_edge(START, "review_proposal")
workflow.add_edge("review_proposal", END)

# Compile the graph
review_graph = workflow.compile()
