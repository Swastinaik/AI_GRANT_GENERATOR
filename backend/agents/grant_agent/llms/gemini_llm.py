import os
from langchain_google_genai import ChatGoogleGenerativeAI


def gemini_llm():
    model_name = os.getenv("GEMINI_MODEL_NAME", "gemini-3.1-flash-lite-preview")
    return ChatGoogleGenerativeAI(
        model=model_name
    )