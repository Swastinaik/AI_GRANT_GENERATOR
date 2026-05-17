import os
from langchain_groq import ChatGroq

def groq_llm():
    model_name = os.getenv("GROQ_MODEL_NAME", "llama-3.1-8b-instant")
    return ChatGroq(
        model=model_name
    )