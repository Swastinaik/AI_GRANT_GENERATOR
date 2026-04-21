import os
from langchain_groq import ChatGroq

def groq_llm():
    model_name = os.getenv("GROQ_MODEL_NAME", "openai/gpt-oss-20b")
    return ChatGroq(
        model=model_name
    )