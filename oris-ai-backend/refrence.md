Module livekit.agents.voice_assistant
Classes
class AssistantCallContext
(
assistant: "'VoicePipelineAgent'",
llm_stream: LLMStream)
Expand source code
Static methods
def get_current
(
) ‑> AgentCallContext
Expand source code
Instance variables
prop agent : 'VoicePipelineAgent'
Expand source code
prop chat_ctx : ChatContext
Expand source code
prop extra_chat_messages : list[ChatMessage]
Expand source code
Methods
def add_extra_chat_message
(
self, message: ChatMessage) ‑> None
Expand source code
Append chat message to the end of function outputs for the answer LLM call

def get_metadata
(
self, key: str, default: Any = None) ‑> Any
Expand source code
def llm_stream
(
self) ‑> LLMStream
Expand source code
def store_metadata
(
self, key: str, value: Any) ‑> None
Expand source code
class AssistantTranscriptionOptions
(
user_transcription: bool = True,
agent_transcription: bool = True,
agent_transcription_speed: float = 1.0,
sentence_tokenizer: tokenize.SentenceTokenizer = <livekit.agents.tokenize.basic.SentenceTokenizer object>,
word_tokenizer: tokenize.WordTokenizer = <livekit.agents.tokenize.basic.WordTokenizer object>,
hyphenate_word: Callable[[str], list[str]] = <function hyphenate_word>)
Expand source code
AgentTranscriptionOptions(user_transcription: 'bool' = True, agent_transcription: 'bool' = True, agent_transcription_speed: 'float' = 1.0, sentence_tokenizer: 'tokenize.SentenceTokenizer' = , word_tokenizer: 'tokenize.WordTokenizer' = , hyphenate_word: 'Callable[[str], list[str]]' = )

Instance variables
var agent_transcription : bool
Whether to forward the agent transcription to the client

var agent_transcription_speed : float
The speed at which the agent's speech transcription is forwarded to the client. We try to mimic the agent's speech speed by adjusting the transcription speed.

var sentence_tokenizer : SentenceTokenizer
The tokenizer used to split the speech into sentences. This is used to decide when to mark a transcript as final for the agent transcription.

var user_transcription : bool
Whether to forward the user transcription to the client

var word_tokenizer : WordTokenizer
The tokenizer used to split the speech into words. This is used to simulate the "interim results" of the agent transcription.

Methods
def hyphenate_word
(
word: str) ‑> list[str]
Expand source code
class VoiceAssistant
(
\*,
vad: vad.VAD,
stt: stt.STT,
llm: LLM,
tts: tts.TTS,
noise_cancellation: rtc.NoiseCancellationOptions | None = None,
turn_detector: \_TurnDetector | None = None,
chat_ctx: ChatContext | None = None,
fnc_ctx: FunctionContext | None = None,
allow_interruptions: bool = True,
interrupt_speech_duration: float = 0.5,
interrupt_min_words: int = 0,
min_endpointing_delay: float = 0.5,
max_endpointing_delay: float = 6.0,
max_nested_fnc_calls: int = 1,
preemptive_synthesis: bool = False,
transcription: AgentTranscriptionOptions = AgentTranscriptionOptions(user_transcription=True, agent_transcription=True, agent_transcription_speed=1.0, sentence_tokenizer=<livekit.agents.tokenize.basic.SentenceTokenizer object>, word_tokenizer=<livekit.agents.tokenize.basic.WordTokenizer object>, hyphenate_word=<function hyphenate_word>),
before_llm_cb: BeforeLLMCallback = <function _default_before_llm_cb>,
before_tts_cb: BeforeTTSCallback = <function _default_before_tts_cb>,
plotting: bool = False,
loop: asyncio.AbstractEventLoop | None = None,
will_synthesize_assistant_reply: WillSynthesizeAssistantReply | None = None)
Expand source code
A pipeline agent (VAD + STT + LLM + TTS) implementation.

Create a new VoicePipelineAgent.

Args
vad
Voice Activity Detection (VAD) instance.
stt
Speech-to-Text (STT) instance.
llm
Large Language Model (LLM) instance.
tts
Text-to-Speech (TTS) instance.
chat_ctx
Chat context for the assistant.
fnc_ctx
Function context for the assistant.
allow_interruptions
Whether to allow the user to interrupt the assistant.
interrupt_speech_duration
Minimum duration of speech to consider for interruption.
interrupt_min_words
Minimum number of words to consider for interruption. Defaults to 0 as this may increase the latency depending on the STT.
min_endpointing_delay
Delay to wait before considering the user finished speaking.
max_nested_fnc_calls
Maximum number of nested function calls allowed for chaining function calls (e.g functions that depend on each other).
preemptive_synthesis
Whether to preemptively synthesize responses.
transcription
Options for assistant transcription.
before_llm_cb
Callback called when the assistant is about to synthesize a reply. This can be used to customize the reply (e.g: inject context/RAG).

Returning None will create a default LLM stream. You can also return your own llm stream by calling the llm.chat() method.

Returning False will cancel the synthesis of the reply.

before_tts_cb
Callback called when the assistant is about to synthesize a speech. This can be used to customize text before the speech synthesis. (e.g: editing the pronunciation of a word).
plotting
Whether to enable plotting for debugging. matplotlib must be installed.
loop
Event loop to use. Default to asyncio.get_event_loop().
Ancestors
EventEmitter typing.Generic
Class variables
var MIN_TIME_PLAYED_FOR_COMMIT
Minimum time played for the user speech to be committed to the chat context

Instance variables
prop chat_ctx : ChatContext
Expand source code
prop fnc_ctx : FunctionContext | None
Expand source code
prop llm : LLM
Expand source code
prop stt : stt.STT
Expand source code
prop tts : tts.TTS
Expand source code
prop vad : vad.VAD
Expand source code
Methods
async def aclose
(
self) ‑> None
Expand source code
Close the voice assistant

def interrupt
(
self, interrupt_all: bool = True) ‑> None
Expand source code
Interrupt the current speech

Args
interrupt_all
Whether to interrupt all pending speech
def on
(
self, event: EventTypes, callback: Callable[[Any], None] | None = None)
Expand source code
Register a callback for an event

Args
event
the event to listen to (see EventTypes) - user_started_speaking: the user started speaking - user_stopped_speaking: the user stopped speaking - agent_started_speaking: the agent started speaking - agent_stopped_speaking: the agent stopped speaking - user_speech_committed: the user speech was committed to the chat context - agent_speech_committed: the agent speech was committed to the chat context - agent_speech_interrupted: the agent speech was interrupted - function_calls_collected: received the complete set of functions to be executed - function_calls_finished: all function calls have been completed
callback
the callback to call when the event is emitted
async def say
(
self,
source: str | LLMStream | AsyncIterable[str],
\*,
allow_interruptions: bool = True,
add_to_chat_ctx: bool = True) ‑> SpeechHandle
Expand source code
Play a speech source through the voice assistant.

Args
source
The source of the speech to play. It can be a string, an LLMStream, or an asynchronous iterable of strings.
allow_interruptions
Whether to allow interruptions during the speech playback.
add_to_chat_ctx
Whether to add the speech to the chat context.
Returns
The speech handle for the speech that was played, can be used to wait for the speech to finish.

def start
(
self, room: rtc.Room, participant: rtc.RemoteParticipant | str | None = None) ‑> None
Expand source code
Start the voice assistant

Args
room
the room to use
participant
the participant to listen to, can either be a participant or a participant identity If None, the first participant found in the room will be selected
Inherited members
EventEmitter: emit off once
