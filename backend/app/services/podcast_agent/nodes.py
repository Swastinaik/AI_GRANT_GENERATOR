import os
from dotenv import load_dotenv
import struct
import mimetypes
load_dotenv()

from langchain_google_genai import ChatGoogleGenerativeAI
from google import genai
from google.genai import types
from langchain_core.messages import HumanMessage, SystemMessage
from app.services.podcast_agent.prompt import generate_podcast_prompt
from app.utils.document_uploader import generate_loader, convert_docs_to_text


GEMINI_TTS_MODEL = "gemini-2.5-flash-preview-tts"  # or any other model you prefer

async def generate_podcast_script(user_input: str | None = None) -> str:
    """
    Generates a podcast script based on the provided user input.
    
    Args:
        user_input (str | None): The topic or user input to base the podcast script on.
    
    Returns:
        str: The generated podcast script.
    """
    prompt = generate_podcast_prompt()
    
    model = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite")
    
    response = await model.ainvoke([
        SystemMessage(content=prompt),
        HumanMessage(content=user_input)
    ])
    
    return response.content.strip() if hasattr(response, 'content') else ""



async def generate_script_from_pdf(path):
    """
    Docstring for generate_script_from_pdf
    
    :param path: Description
    """
    loader = generate_loader(path)
    docs = convert_docs_to_text(loader)
    trimmed_docs = docs[:4000]
    prompt = generate_podcast_prompt()
    model = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite")
    response = await model.ainvoke([
        SystemMessage(content=prompt),
        HumanMessage(content=trimmed_docs)
    ])
    
    return response.content.strip() if hasattr(response, 'content') else ""



def create_wav_header(sample_rate=24000, channels=1, bits_per_sample=16):
    """
    Creates a WAV header with a maximum integer size to allow streaming 
    without knowing the exact file length beforehand.
    """
    # Max generic size (approx 2GB) to trick the player into streaming indefinitely
    data_size = 2147483647 
    byte_rate = sample_rate * channels * (bits_per_sample // 8)
    block_align = channels * (bits_per_sample // 8)
    
    # 36 bytes for header before data
    chunk_size = 36 + data_size
    
    header = struct.pack(
        "<4sI4s4sIHHIIHH4sI",
        b"RIFF",
        chunk_size,
        b"WAVE",
        b"fmt ",
        16,              # Subchunk1Size (16 for PCM)
        1,               # AudioFormat (1 = PCM)
        channels,
        sample_rate,
        byte_rate,
        block_align,
        bits_per_sample,
        b"data",
        data_size
    )
    return header



def build_tts_chunk_stream(script: str):
    """
    Converts the podcast script into a stream of text-to-speech chunks.
    
    Args:
        script (str): The podcast script to convert.
    
    Returns:
        A Generator that yields text-to-speech chunks.
    """
    client = genai.Client()
    contents = [
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=script)],
        )
    ]
    config = types.GenerateContentConfig(
        temperature=1,
        response_modalities=["audio"],
        speech_config=types.SpeechConfig(
            multi_speaker_voice_config=types.MultiSpeakerVoiceConfig(
                speaker_voice_configs=[
                    types.SpeakerVoiceConfig(
                        speaker="speaker 1",
                        voice_config=types.VoiceConfig(
                            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                voice_name="Zephyr"  # pick any
                            )
                        ),
                    ),
                    types.SpeakerVoiceConfig(
                        speaker="speaker 2",
                        voice_config=types.VoiceConfig(
                            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                voice_name="Puck"  # pick any
                            )
                        ),
                    ),
                ]
            )
        ),
    )
    mime_type = None
    def _iter_chunks():
        nonlocal mime_type
        for chunk in client.models.generate_content_stream(
            model=GEMINI_TTS_MODEL,
            contents=contents,
            config=config,
        ):
            if (
                not chunk.candidates
                or not chunk.candidates[0].content
                or not chunk.candidates[0].content.parts
            ):
                continue

            for part in chunk.candidates[0].content.parts:
                inline = getattr(part, "inline_data", None)
                if inline and inline.data:
                    # yield raw audio bytes
                    if mime_type is None and inline.mime_type:
                        mime_type = inline.mime_type
                    yield inline.data
    return _iter_chunks(), lambda: mime_type


def stream_generator_wrapper(script: str):
    """
    Generates the WAV header first, then yields audio chunks from Gemini.
    """
    # 1. Yield the WAV Header first
    # Gemini 2.0 Flash TTS usually defaults to 24kHz mono
    yield create_wav_header(sample_rate=24000)

    # 2. Get the Gemini stream
    # We ignore the get_mime lambda for the stream since we are forcing WAV container
    chunk_iterator, _ = build_tts_chunk_stream(script)

    # 3. Yield chunks as they arrive
    for chunk in chunk_iterator:
        if chunk:
            yield chunk
