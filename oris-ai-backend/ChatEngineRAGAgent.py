import asyncio
from typing import Annotated
import re
import os
from dotenv import load_dotenv
from livekit import agents, rtc, api
from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, cli, tokenize, llm, function_tool, RunContext, Agent, AgentSession
from livekit.agents.llm import (
    ChatContext,
    ChatMessage,
    ChatContent,
)
from livekit.plugins import deepgram, openai, silero, google, elevenlabs
from llama_index.core import (
    SimpleDirectoryReader,
    StorageContext,
    VectorStoreIndex,
    load_index_from_storage,
    Settings,
)
from llama_index.core.chat_engine.types import ChatMode
from llama_index.embeddings.google_genai import GoogleGenAIEmbedding
from llama_index.core.schema import MetadataMode
import requests

load_dotenv()

# Configure Google GenAI embeddings for FREE usage
Settings.embed_model = GoogleGenAIEmbedding(
    model_name="text-embedding-004",
    embed_batch_size=100,
    api_key=os.getenv("GOOGLE_API_KEY")
)

# Initialize RAG components
PERSIST_DIR = "./dental-knowledge-storage"
if not os.path.exists(PERSIST_DIR):
    # Load dental knowledge documents and create index
    documents = SimpleDirectoryReader("dental_data").load_data()
    index = VectorStoreIndex.from_documents(documents)
    index.storage_context.persist(persist_dir=PERSIST_DIR)
else:
    # Load existing dental knowledge index
    storage_context = StorageContext.from_defaults(persist_dir=PERSIST_DIR)
    index = load_index_from_storage(storage_context)

# Create chat engine for dental knowledge
dental_chat_engine = index.as_chat_engine(chat_mode=ChatMode.CONTEXT)

# Define function tools for dental assistant
@function_tool()
async def book_appointment(context: RunContext, email: str, name: str) -> dict:
    """Book a dental appointment by sending a booking link to the provided email address."""
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return {"result": "The email address seems incorrect. Please provide a valid one."}

    try:
        webhook_url = os.getenv('WEBHOOK_URL')
        headers = {'Content-Type': 'application/json'}
        data = {'email': email, 'name': name}
        response = requests.post(webhook_url, json=data, headers=headers)
        response.raise_for_status()
        return {"result": f"Dental appointment booking link sent to {email}. Please check your email."}
    except requests.RequestException as e:
        print(f"Error booking appointment: {e}")
        return {"result": "There was an error booking your dental appointment. Please try again later."}

@function_tool()
async def assess_dental_urgency(context: RunContext, symptoms: str) -> dict:
    """Assess the urgency of dental symptoms and determine if immediate attention is needed."""
    urgent_keywords = ["severe pain", "swelling", "bleeding", "trauma", "knocked out", "broken"]
    if any(keyword in symptoms.lower() for keyword in urgent_keywords):
        return {"result": "call_human_agent"}
    else:
        return {"result": "Your dental issue doesn't appear to be immediately urgent, but it's still important to schedule an appointment soon for a proper evaluation."}

@function_tool()
async def chat_with_dental_knowledge(context: RunContext, query: str) -> dict:
    """Chat with the dental knowledge base using conversational context for specific information about procedures, care, or treatments."""
    print(f"🔍 Chatting with dental knowledge base: {query}")
    try:
        import asyncio
        
        def sync_chat():
            response = dental_chat_engine.chat(query)
            return str(response)
        
        # Run synchronous chat in thread pool
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(None, sync_chat)
        
        print(f"✅ Chat engine response: {response[:200]}...")
        return {"result": response}
    except Exception as e:
        print(f"❌ Error chatting with dental knowledge: {e}")
        return {"result": "I'm having trouble accessing the dental information right now. Please schedule an appointment for detailed information about our services and pricing."}

async def entrypoint(ctx: JobContext):
    # Auto-detect FREE AI providers
    if os.getenv("GOOGLE_API_KEY") and os.getenv("GOOGLE_API_KEY") != "your_google_gemini_api_key_here":
        print("🟢 Using Google Gemini (FREE)")
        llm_provider = google.LLM(model="gemini-2.0-flash-001")
    else:
        print("🔵 Using OpenAI (fallback)")
        llm_provider = openai.LLM()
    
    # Choose TTS provider
    if os.getenv("ELEVENLABS_API_KEY") and os.getenv("ELEVENLABS_API_KEY") != "your_elevenlabs_api_key_here":
        print("🎙️ Using ElevenLabs TTS")
        voice_id = os.getenv("ELEVENLABS_VOICE_ID", "EXAVITQu4vr4xnSDxMaL")
        tts_provider = elevenlabs.TTS(voice_id=voice_id)
    elif os.getenv("GOOGLE_API_KEY"):
        print("🟢 Using Google TTS")
        tts_provider = google.TTS()
    else:
        print("🔵 Using OpenAI TTS")
        tts_provider = openai.TTS()

    # Create system message using correct list format from help-ref.md
    system_text = ("Your name is Daela, a dental assistant for Knolabs Dental Agency. You are soft, caring with a bit of humour in you when responding. "
                   "You offer appointment booking for dental care services, including urgent attention, routine check-ups, and long-term treatments available at various prices. "
                   "CRITICAL INSTRUCTION: WHENEVER a user asks about prices, costs, fees, charges, procedures, treatments, or any dental services, you MUST FIRST call the chat_with_dental_knowledge function with their query before providing any answer. "
                   "You have access to comprehensive dental pricing and service information through the chat_with_dental_knowledge function - USE IT EVERY TIME for pricing or service questions! "
                   "Never guess or make up prices - always use the chat function first. "
                   "An onsite appointment is required for actual treatment. "
                   "Provide friendly, professional assistance and emphasize the importance of regular dental care. "
                   "The users asking you questions could be of different age. so ask questions one by one. "
                   "Any query outside of the dental service, politely reject stating your purpose. "
                   "Keep your focus on try and get the patient's name and email address in sequence if not already provided while you help user. Encourage user to type email address to avoid any mistakes and reconfirm it after user provides it. "
                   "Remember every patient asking for information or help is a potential lead for the business so always try to get the patient info being polite and not pushing too much but using subtle discussion approach. "
                   "If the care needed is not urgent, provide guidance based on the patient's verbal description and offer assistance. "
                   "Always keep your conversation engaging, short and multiple interactions even when the information you are sharing is lengthy and try to offer the in-person appointment.")
    
    # Create tools list using function_tool wrapper as per documentation
    tools = [
        function_tool(book_appointment),
        function_tool(assess_dental_urgency),
        function_tool(chat_with_dental_knowledge)
    ]
    
    initial_ctx = llm.ChatContext()
    initial_ctx.add_message(role="system", content=system_text)  # Use add_message method from help-ref.md

    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)
    
    # Create Agent with tools and chat context
    agent = Agent(
        instructions=system_text,
        tools=tools,
        chat_ctx=initial_ctx,
    )

    # Create AgentSession with pipeline components only
    session = AgentSession(
        vad=silero.VAD.load(),
        stt=deepgram.STT(),
        llm=llm_provider,
        tts=tts_provider,
    )

    async def follow_up_appointment(email: str):
        await asyncio.sleep(20)
        print(f"Finished waiting, checking dental appointment status for {email}")
        status = f"Your appointment request for {email} has been processed. Our team will contact you soon."
        session.say(status, allow_interruptions=True)

    async def create_sip_participant(phone_number, room_name):
        print("trying to call an agent")
        LIVEKIT_URL = os.getenv('LIVEKIT_URL')
        LIVEKIT_API_KEY = os.getenv('LIVEKIT_API_KEY')
        LIVEKIT_API_SECRET = os.getenv('LIVEKIT_API_SECRET')
        SIP_TRUNK_ID = os.getenv('SIP_TRUNK_ID')

        livekit_api = api.LiveKitAPI(
            LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET
        )

        sip_trunk_id = SIP_TRUNK_ID
        await livekit_api.sip.create_sip_participant(
            api.CreateSIPParticipantRequest(
                sip_trunk_id=sip_trunk_id,
                sip_call_to=phone_number,
                room_name=f"{room_name}",
                participant_identity=f"sip_{phone_number}",
                participant_name="Human Agent",
                play_ringtone=1
            )
        )
        await livekit_api.aclose()

    @ctx.room.on("participant_disconnected")
    def on_customer_agent_finished(RemoteParticipant: rtc.RemoteParticipant):
        print("Human Agent disconnected. AI Agent taking over.")
        # session.say() is called directly - not awaited, not a coroutine
        session.say(
            "Human Agent interaction completed. Politely ask if it was helpful and if user is happy to proceed with the in-person appointment.",
            allow_interruptions=True
        )

    # Start the session with the agent and room
    await session.start(agent, room=ctx.room)
    session.say(
        "Hello! I'm Daela, your dental assistant at Knolabs Dental Agency. Can I know if you are the patient or you're representing the patient?",
        allow_interruptions=True
    )

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))