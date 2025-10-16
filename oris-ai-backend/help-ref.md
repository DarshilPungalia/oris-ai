Module livekit.agents.llm
Sub-modules
livekit.agents.llm.mcp
livekit.agents.llm.remote_chat_context
livekit.agents.llm.utils
Functions
def find_function_tools
(
cls_or_obj: Any) ‑> list[livekit.agents.llm.tool_context.FunctionTool | livekit.agents.llm.tool_context.RawFunctionTool]
Expand source code
def function_tool
(
f: F | Raw_F | None = None,
\*,
name: str | None = None,
description: str | None = None,
raw_schema: RawFunctionDescription | dict[str, Any] | None = None) ‑> livekit.agents.llm.tool_context.FunctionTool | livekit.agents.llm.tool_context.RawFunctionTool | Callable[[~F], livekit.agents.llm.tool_context.FunctionTool] | Callable[[~Raw_F], livekit.agents.llm.tool_context.RawFunctionTool]
Expand source code
def is_function_tool
(
f: Callable[..., Any]) ‑> TypeGuard[livekit.agents.llm.tool_context.FunctionTool]
Expand source code
def is_raw_function_tool
(
f: Callable[..., Any]) ‑> TypeGuard[livekit.agents.llm.tool_context.RawFunctionTool]
Expand source code
Classes
class AudioContent
(
\*\*data: Any)
Expand source code
Usage docs: https://docs.pydantic.dev/2.10/concepts/models/

A base class for creating Pydantic models.

Attributes
**class_vars**
The names of the class variables defined on the model.
**private_attributes**
Metadata about the private attributes of the model.
**signature**
The synthesized **init** [Signature][inspect.Signature] of the model.
**pydantic_complete**
Whether model building is completed, or if there are still undefined fields.
**pydantic_core_schema**
The core schema of the model.
**pydantic_custom_init**
Whether the model has a custom **init** function.
**pydantic_decorators**
Metadata containing the decorators defined on the model. This replaces Model.**validators** and Model.**root_validators** from Pydantic V1.
**pydantic_generic_metadata**
Metadata for generic models; contains data used for a similar purpose to args, origin, parameters in typing-module generics. May eventually be replaced by these.
**pydantic_parent_namespace**
Parent namespace of the model, used for automatic rebuilding of models.
**pydantic_post_init**
The name of the post-init method for the model, if defined.
**pydantic_root_model**
Whether the model is a [RootModel][pydantic.root_model.RootModel].
**pydantic_serializer**
The pydantic-core SchemaSerializer used to dump instances of the model.
**pydantic_validator**
The pydantic-core SchemaValidator used to validate instances of the model.
**pydantic_fields**
A dictionary of field names and their corresponding [FieldInfo][pydantic.fields.FieldInfo] objects.
**pydantic_computed_fields**
A dictionary of computed field names and their corresponding [ComputedFieldInfo][pydantic.fields.ComputedFieldInfo] objects.
**pydantic_extra**
A dictionary containing extra values, if [extra][pydantic.config.ConfigDict.extra] is set to 'allow'.
**pydantic_fields_set**
The names of fields explicitly set during instantiation.
**pydantic_private**
Values of private attributes set on the model instance.
Create a new model by parsing and validating input data from keyword arguments.

Raises [ValidationError][pydantic_core.ValidationError] if the input data cannot be validated to form a valid model.

self is explicitly positional-only to allow self as a field name.

Ancestors
pydantic.main.BaseModel
Class variables
var frame : list[AudioFrame]
var model_config
var transcript : str | None
var type : Literal['audio_content']
class AvailabilityChangedEvent
(
llm: LLM,
available: bool)
Expand source code
AvailabilityChangedEvent(llm: 'LLM', available: 'bool')

Instance variables
var available : bool
var llm : livekit.agents.llm.llm.LLM
class ChatChunk
(
\*\*data: Any)
Expand source code
Usage docs: https://docs.pydantic.dev/2.10/concepts/models/

A base class for creating Pydantic models.

Attributes
**class_vars**
The names of the class variables defined on the model.
**private_attributes**
Metadata about the private attributes of the model.
**signature**
The synthesized **init** [Signature][inspect.Signature] of the model.
**pydantic_complete**
Whether model building is completed, or if there are still undefined fields.
**pydantic_core_schema**
The core schema of the model.
**pydantic_custom_init**
Whether the model has a custom **init** function.
**pydantic_decorators**
Metadata containing the decorators defined on the model. This replaces Model.**validators** and Model.**root_validators** from Pydantic V1.
**pydantic_generic_metadata**
Metadata for generic models; contains data used for a similar purpose to args, origin, parameters in typing-module generics. May eventually be replaced by these.
**pydantic_parent_namespace**
Parent namespace of the model, used for automatic rebuilding of models.
**pydantic_post_init**
The name of the post-init method for the model, if defined.
**pydantic_root_model**
Whether the model is a [RootModel][pydantic.root_model.RootModel].
**pydantic_serializer**
The pydantic-core SchemaSerializer used to dump instances of the model.
**pydantic_validator**
The pydantic-core SchemaValidator used to validate instances of the model.
**pydantic_fields**
A dictionary of field names and their corresponding [FieldInfo][pydantic.fields.FieldInfo] objects.
**pydantic_computed_fields**
A dictionary of computed field names and their corresponding [ComputedFieldInfo][pydantic.fields.ComputedFieldInfo] objects.
**pydantic_extra**
A dictionary containing extra values, if [extra][pydantic.config.ConfigDict.extra] is set to 'allow'.
**pydantic_fields_set**
The names of fields explicitly set during instantiation.
**pydantic_private**
Values of private attributes set on the model instance.
Create a new model by parsing and validating input data from keyword arguments.

Raises [ValidationError][pydantic_core.ValidationError] if the input data cannot be validated to form a valid model.

self is explicitly positional-only to allow self as a field name.

Ancestors
pydantic.main.BaseModel
Class variables
var delta : livekit.agents.llm.llm.ChoiceDelta | None
var id : str
var model_config
var usage : livekit.agents.llm.llm.CompletionUsage | None
class ChatContext
(
items: NotGivenOr[list[ChatItem]] = NOT_GIVEN)
Expand source code
class ChatContext:
def **init**(self, items: NotGivenOr[list[ChatItem]] = NOT_GIVEN):
self.\_items: list[ChatItem] = items if is_given(items) else []

    @classmethod
    def empty(cls) -> ChatContext:
        return cls([])

    @property
    def items(self) -> list[ChatItem]:
        return self._items

    @items.setter
    def items(self, items: list[ChatItem]) -> None:
        self._items = items

    def add_message(
        self,
        *,
        role: ChatRole,
        content: list[ChatContent] | str,
        id: NotGivenOr[str] = NOT_GIVEN,
        interrupted: NotGivenOr[bool] = NOT_GIVEN,
        created_at: NotGivenOr[float] = NOT_GIVEN,
    ) -> ChatMessage:
        kwargs: dict[str, Any] = {}
        if is_given(id):
            kwargs["id"] = id
        if is_given(interrupted):
            kwargs["interrupted"] = interrupted
        if is_given(created_at):
            kwargs["created_at"] = created_at

        if isinstance(content, str):
            message = ChatMessage(role=role, content=[content], **kwargs)
        else:
            message = ChatMessage(role=role, content=content, **kwargs)

        if is_given(created_at):
            idx = self.find_insertion_index(created_at=created_at)
            self._items.insert(idx, message)
        else:
            self._items.append(message)
        return message

    def insert(self, item: ChatItem | Sequence[ChatItem]) -> None:
        """Insert an item or list of items into the chat context by creation time."""
        items = list(item) if isinstance(item, Sequence) else [item]

        for _item in items:
            idx = self.find_insertion_index(created_at=_item.created_at)
            self._items.insert(idx, _item)

    def get_by_id(self, item_id: str) -> ChatItem | None:
        return next((item for item in self.items if item.id == item_id), None)

    def index_by_id(self, item_id: str) -> int | None:
        return next((i for i, item in enumerate(self.items) if item.id == item_id), None)

    def copy(
        self,
        *,
        exclude_function_call: bool = False,
        exclude_instructions: bool = False,
        exclude_empty_message: bool = False,
        tools: NotGivenOr[Sequence[FunctionTool | RawFunctionTool | str | Any]] = NOT_GIVEN,
    ) -> ChatContext:
        items = []

        from .tool_context import (
            get_function_info,
            get_raw_function_info,
            is_function_tool,
            is_raw_function_tool,
        )

        valid_tools = set[str]()
        if is_given(tools):
            for tool in tools:
                if isinstance(tool, str):
                    valid_tools.add(tool)
                elif is_function_tool(tool):
                    valid_tools.add(get_function_info(tool).name)
                elif is_raw_function_tool(tool):
                    valid_tools.add(get_raw_function_info(tool).name)
                # TODO(theomonnom): other tools

        for item in self.items:
            if exclude_function_call and item.type in [
                "function_call",
                "function_call_output",
            ]:
                continue

            if (
                exclude_instructions
                and item.type == "message"
                and item.role in ["system", "developer"]
            ):
                continue

            if exclude_empty_message and item.type == "message" and not item.content:
                continue

            if (
                is_given(tools)
                and (item.type == "function_call" or item.type == "function_call_output")
                and item.name not in valid_tools
            ):
                continue

            items.append(item)

        return ChatContext(items)

    def truncate(self, *, max_items: int) -> ChatContext:


"""

        if len(self._items) <= max_items:
            return self

        instructions = next(
            (item for item in self._items if item.type == "message" and item.role == "system"),
            None,
        )

        new_items = self._items[-max_items:]
        # chat ctx shouldn't start with function_call or function_call_output
        while new_items and new_items[0].type in [
            "function_call",
            "function_call_output",
        ]:
            new_items.pop(0)

        if instructions:
            new_items.insert(0, instructions)

        self._items[:] = new_items
        return self

    def merge(
        self,
        other_chat_ctx: ChatContext,
        *,
        exclude_function_call: bool = False,
        exclude_instructions: bool = False,
    ) -> ChatContext:
        """Add messages from `other_chat_ctx` into this one, avoiding duplicates, and keep items sorted by created_at."""
        existing_ids = {item.id for item in self._items}

        for item in other_chat_ctx.items:
            if exclude_function_call and item.type in [
                "function_call",
                "function_call_output",
            ]:
                continue

            if (
                exclude_instructions
                and item.type == "message"
                and item.role in ["system", "developer"]
            ):
                continue

            if item.id not in existing_ids:
                idx = self.find_insertion_index(created_at=item.created_at)
                self._items.insert(idx, item)
                existing_ids.add(item.id)

        return self

    def to_dict(
        self,
        *,
        exclude_image: bool = True,
        exclude_audio: bool = True,
        exclude_timestamp: bool = True,
        exclude_function_call: bool = False,
    ) -> dict[str, Any]:
        items: list[ChatItem] = []
        for item in self.items:
            if exclude_function_call and item.type in [
                "function_call",
                "function_call_output",
            ]:
                continue

            if item.type == "message":
                item = item.model_copy()
                if exclude_image:
                    item.content = [c for c in item.content if not isinstance(c, ImageContent)]
                if exclude_audio:
                    item.content = [c for c in item.content if not isinstance(c, AudioContent)]

            items.append(item)

        exclude_fields = set()
        if exclude_timestamp:
            exclude_fields.add("created_at")

        return {
            "items": [
                item.model_dump(
                    mode="json",
                    exclude_none=True,
                    exclude_defaults=False,
                    exclude=exclude_fields,
                )
                for item in items
            ],
        }

    @overload
    def to_provider_format(
        self, format: Literal["openai"], *, inject_dummy_user_message: bool = True
    ) -> tuple[list[dict], Literal[None]]: ...

    @overload
    def to_provider_format(
        self, format: Literal["google"], *, inject_dummy_user_message: bool = True
    ) -> tuple[list[dict], _provider_format.google.GoogleFormatData]: ...

    @overload
    def to_provider_format(
        self, format: Literal["aws"], *, inject_dummy_user_message: bool = True
    ) -> tuple[list[dict], _provider_format.aws.BedrockFormatData]: ...

    @overload
    def to_provider_format(
        self, format: Literal["anthropic"], *, inject_dummy_user_message: bool = True
    ) -> tuple[list[dict], _provider_format.anthropic.AnthropicFormatData]: ...

    @overload
    def to_provider_format(
        self, format: Literal["mistralai"], *, inject_dummy_user_message: bool = True
    ) -> tuple[list[dict], Literal[None]]: ...

    @overload
    def to_provider_format(self, format: str, **kwargs: Any) -> tuple[list[dict], Any]: ...

    def to_provider_format(
        self,
        format: Literal["openai", "google", "aws", "anthropic", "mistralai"] | str,
        *,
        inject_dummy_user_message: bool = True,
        **kwargs: Any,
    ) -> tuple[list[dict], Any]:


"""

        kwargs["inject_dummy_user_message"] = inject_dummy_user_message

        if format == "openai":
            return _provider_format.openai.to_chat_ctx(self, **kwargs)
        elif format == "google":
            return _provider_format.google.to_chat_ctx(self, **kwargs)
        elif format == "aws":
            return _provider_format.aws.to_chat_ctx(self, **kwargs)
        elif format == "anthropic":
            return _provider_format.anthropic.to_chat_ctx(self, **kwargs)
        elif format == "mistralai":
            return _provider_format.mistralai.to_chat_ctx(self, **kwargs)
        else:
            raise ValueError(f"Unsupported provider format: {format}")

    def find_insertion_index(self, *, created_at: float) -> int:


"""

        for i in reversed(range(len(self._items))):
            if self._items[i].created_at <= created_at:
                return i + 1

        return 0

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> ChatContext:
        item_adapter = TypeAdapter(list[ChatItem])
        items = item_adapter.validate_python(data["items"])
        return cls(items)

    @property
    def readonly(self) -> bool:
        return False

    def is_equivalent(self, other: ChatContext) -> bool:


"""

        if self is other:
            return True

        if len(self.items) != len(other.items):
            return False

        for a, b in zip(self.items, other.items):
            if a.id != b.id or a.type != b.type:
                return False

            if a.type == "message" and b.type == "message":
                if a.role != b.role or a.interrupted != b.interrupted or a.content != b.content:
                    return False

            elif a.type == "function_call" and b.type == "function_call":
                if a.name != b.name or a.call_id != b.call_id or a.arguments != b.arguments:
                    return False

            elif a.type == "function_call_output" and b.type == "function_call_output":
                if (
                    a.name != b.name
                    or a.call_id != b.call_id
                    or a.output != b.output
                    or a.is_error != b.is_error
                ):
                    return False

        return True

Subclasses
livekit.agents.llm.chat_context.\_ReadOnlyChatContext
Static methods
def empty
(
) ‑> livekit.agents.llm.chat_context.ChatContext
def from_dict
(
data: dict[str, Any]) ‑> livekit.agents.llm.chat_context.ChatContext
Instance variables
prop items : list[ChatItem]
Expand source code
prop readonly : bool
Expand source code
Methods
def add_message
(
self,
_,
role: ChatRole,
content: list[ChatContent] | str,
id: NotGivenOr[str] = NOT_GIVEN,
interrupted: NotGivenOr[bool] = NOT_GIVEN,
created_at: NotGivenOr[float] = NOT_GIVEN) ‑> livekit.agents.llm.chat_context.ChatMessage
Expand source code
def copy
(
self,
_,
exclude_function_call: bool = False,
exclude_instructions: bool = False,
exclude_empty_message: bool = False,
tools: NotGivenOr[Sequence[FunctionTool | RawFunctionTool | str | Any]] = NOT_GIVEN) ‑> ChatContext
Expand source code
def find_insertion_index
(
self, \*, created_at: float) ‑> int
Expand source code
Returns the index to insert an item by creation time.

Iterates in reverse, assuming items are sorted by created_at. Finds the position after the last item with created_at <= the given timestamp.

def get_by_id
(
self, item_id: str) ‑> livekit.agents.llm.chat_context.ChatMessage | livekit.agents.llm.chat_context.FunctionCall | livekit.agents.llm.chat_context.FunctionCallOutput | None
Expand source code
def index_by_id
(
self, item_id: str) ‑> int | None
Expand source code
def insert
(
self, item: ChatItem | Sequence[ChatItem]) ‑> None
Expand source code
Insert an item or list of items into the chat context by creation time.

def is_equivalent
(
self,
other: ChatContext) ‑> bool
Expand source code
Return True if other has the same sequence of items with matching essential fields (IDs, types, and payload) as this context.

Comparison rules: - Messages: compares the full content list, role and interrupted. - Function calls: compares name, call_id, and arguments. - Function call outputs: compares name, call_id, output, and is_error.

Does not consider timestamps or other metadata.

def merge
(
self,
other_chat_ctx: ChatContext,
\*,
exclude_function_call: bool = False,
exclude_instructions: bool = False) ‑> livekit.agents.llm.chat_context.ChatContext
Expand source code
Add messages from other_chat_ctx into this one, avoiding duplicates, and keep items sorted by created_at.

def to_dict
(
self,
_,
exclude_image: bool = True,
exclude_audio: bool = True,
exclude_timestamp: bool = True,
exclude_function_call: bool = False) ‑> dict[str, typing.Any]
Expand source code
def to_provider_format
(
self,
format: "Literal['openai', 'google', 'aws', 'anthropic', 'mistralai'] | str",
_,
inject_dummy_user_message: bool = True,
\*\*kwargs: Any) ‑> tuple[list[dict], typing.Any]
Expand source code
Convert the chat context to a provider-specific format.

If inject_dummy_user_message is True, a dummy user message will be added to the beginning or end of the chat context depending on the provider.

This is necessary because some providers expect a user message to be present for generating a response.

def truncate
(
self, \*, max_items: int) ‑> livekit.agents.llm.chat_context.ChatContext
Expand source code
Truncate the chat context to the last N items in place.

Removes leading function calls to avoid partial function outputs. Preserves the first system message by adding it back to the beginning.

class ChatMessage
(
\*\*data: Any)
Expand source code
class ChatMessage(BaseModel):
id: str = Field(default*factory=lambda: utils.shortuuid("item*"))
type: Literal["message"] = "message"
role: ChatRole
content: list[ChatContent]
interrupted: bool = False
transcript_confidence: float | None = None
hash: bytes | None = None
created_at: float = Field(default_factory=time.time)

    @property
    def text_content(self) -> str | None:
        """
        Returns a string of all text content in the message.

        Multiple text content items will be joined by a newline.
        """
        text_parts = [c for c in self.content if isinstance(c, str)]
        if not text_parts:
            return None
        return "\n".join(text_parts)

Usage docs: https://docs.pydantic.dev/2.10/concepts/models/

A base class for creating Pydantic models.

Attributes
**class_vars**
The names of the class variables defined on the model.
**private_attributes**
Metadata about the private attributes of the model.
**signature**
The synthesized **init** [Signature][inspect.Signature] of the model.
**pydantic_complete**
Whether model building is completed, or if there are still undefined fields.
**pydantic_core_schema**
The core schema of the model.
**pydantic_custom_init**
Whether the model has a custom **init** function.
**pydantic_decorators**
Metadata containing the decorators defined on the model. This replaces Model.**validators** and Model.**root_validators** from Pydantic V1.
**pydantic_generic_metadata**
Metadata for generic models; contains data used for a similar purpose to args, origin, parameters in typing-module generics. May eventually be replaced by these.
**pydantic_parent_namespace**
Parent namespace of the model, used for automatic rebuilding of models.
**pydantic_post_init**
The name of the post-init method for the model, if defined.
**pydantic_root_model**
Whether the model is a [RootModel][pydantic.root_model.RootModel].
**pydantic_serializer**
The pydantic-core SchemaSerializer used to dump instances of the model.
**pydantic_validator**
The pydantic-core SchemaValidator used to validate instances of the model.
**pydantic_fields**
A dictionary of field names and their corresponding [FieldInfo][pydantic.fields.FieldInfo] objects.
**pydantic_computed_fields**
A dictionary of computed field names and their corresponding [ComputedFieldInfo][pydantic.fields.ComputedFieldInfo] objects.
**pydantic_extra**
A dictionary containing extra values, if [extra][pydantic.config.ConfigDict.extra] is set to 'allow'.
**pydantic_fields_set**
The names of fields explicitly set during instantiation.
**pydantic_private**
Values of private attributes set on the model instance.
Create a new model by parsing and validating input data from keyword arguments.

Raises [ValidationError][pydantic_core.ValidationError] if the input data cannot be validated to form a valid model.

self is explicitly positional-only to allow self as a field name.

Ancestors
pydantic.main.BaseModel
Class variables
var content : list[livekit.agents.llm.chat_context.ImageContent | livekit.agents.llm.chat_context.AudioContent | str]
var created_at : float
var hash : bytes | None
var id : str
var interrupted : bool
var model_config
var role : Literal['developer', 'system', 'user', 'assistant']
var transcript_confidence : float | None
var type : Literal['message']
Instance variables
prop text_content : str | None
Expand source code
Returns a string of all text content in the message.

Multiple text content items will be joined by a newline.

class ChoiceDelta
(
\*\*data: Any)
Expand source code
Usage docs: https://docs.pydantic.dev/2.10/concepts/models/

A base class for creating Pydantic models.

Attributes
**class_vars**
The names of the class variables defined on the model.
**private_attributes**
Metadata about the private attributes of the model.
**signature**
The synthesized **init** [Signature][inspect.Signature] of the model.
**pydantic_complete**
Whether model building is completed, or if there are still undefined fields.
**pydantic_core_schema**
The core schema of the model.
**pydantic_custom_init**
Whether the model has a custom **init** function.
**pydantic_decorators**
Metadata containing the decorators defined on the model. This replaces Model.**validators** and Model.**root_validators** from Pydantic V1.
**pydantic_generic_metadata**
Metadata for generic models; contains data used for a similar purpose to args, origin, parameters in typing-module generics. May eventually be replaced by these.
**pydantic_parent_namespace**
Parent namespace of the model, used for automatic rebuilding of models.
**pydantic_post_init**
The name of the post-init method for the model, if defined.
**pydantic_root_model**
Whether the model is a [RootModel][pydantic.root_model.RootModel].
**pydantic_serializer**
The pydantic-core SchemaSerializer used to dump instances of the model.
**pydantic_validator**
The pydantic-core SchemaValidator used to validate instances of the model.
**pydantic_fields**
A dictionary of field names and their corresponding [FieldInfo][pydantic.fields.FieldInfo] objects.
**pydantic_computed_fields**
A dictionary of computed field names and their corresponding [ComputedFieldInfo][pydantic.fields.ComputedFieldInfo] objects.
**pydantic_extra**
A dictionary containing extra values, if [extra][pydantic.config.ConfigDict.extra] is set to 'allow'.
**pydantic_fields_set**
The names of fields explicitly set during instantiation.
**pydantic_private**
Values of private attributes set on the model instance.
Create a new model by parsing and validating input data from keyword arguments.

Raises [ValidationError][pydantic_core.ValidationError] if the input data cannot be validated to form a valid model.

self is explicitly positional-only to allow self as a field name.

Ancestors
pydantic.main.BaseModel
Class variables
var content : str | None
var model_config
var role : Literal['developer', 'system', 'user', 'assistant'] | None
var tool_calls : list[livekit.agents.llm.llm.FunctionToolCall]
class CompletionUsage
(
\*\*data: Any)
Expand source code
Usage docs: https://docs.pydantic.dev/2.10/concepts/models/

A base class for creating Pydantic models.

Attributes
**class_vars**
The names of the class variables defined on the model.
**private_attributes**
Metadata about the private attributes of the model.
**signature**
The synthesized **init** [Signature][inspect.Signature] of the model.
**pydantic_complete**
Whether model building is completed, or if there are still undefined fields.
**pydantic_core_schema**
The core schema of the model.
**pydantic_custom_init**
Whether the model has a custom **init** function.
**pydantic_decorators**
Metadata containing the decorators defined on the model. This replaces Model.**validators** and Model.**root_validators** from Pydantic V1.
**pydantic_generic_metadata**
Metadata for generic models; contains data used for a similar purpose to args, origin, parameters in typing-module generics. May eventually be replaced by these.
**pydantic_parent_namespace**
Parent namespace of the model, used for automatic rebuilding of models.
**pydantic_post_init**
The name of the post-init method for the model, if defined.
**pydantic_root_model**
Whether the model is a [RootModel][pydantic.root_model.RootModel].
**pydantic_serializer**
The pydantic-core SchemaSerializer used to dump instances of the model.
**pydantic_validator**
The pydantic-core SchemaValidator used to validate instances of the model.
**pydantic_fields**
A dictionary of field names and their corresponding [FieldInfo][pydantic.fields.FieldInfo] objects.
**pydantic_computed_fields**
A dictionary of computed field names and their corresponding [ComputedFieldInfo][pydantic.fields.ComputedFieldInfo] objects.
**pydantic_extra**
A dictionary containing extra values, if [extra][pydantic.config.ConfigDict.extra] is set to 'allow'.
**pydantic_fields_set**
The names of fields explicitly set during instantiation.
**pydantic_private**
Values of private attributes set on the model instance.
Create a new model by parsing and validating input data from keyword arguments.

Raises [ValidationError][pydantic_core.ValidationError] if the input data cannot be validated to form a valid model.

self is explicitly positional-only to allow self as a field name.

Ancestors
pydantic.main.BaseModel
Class variables
var cache_creation_tokens : int
The number of tokens used to create the cache.

var cache_read_tokens : int
The number of tokens read from the cache.

var completion_tokens : int
The number of tokens in the completion.

var model_config
var prompt_cached_tokens : int
The number of cached input tokens used.

var prompt_tokens : int
The number of input tokens used (includes cached tokens).

var total_tokens : int
The total number of tokens used (completion + prompt tokens).

class FallbackAdapter
(
llm: list[LLM],
\*,
attempt_timeout: float = 5.0,
max_retry_per_llm: int = 0,
retry_interval: float = 0.5,
retry_on_chunk_sent: bool = False)
Expand source code
Helper class that provides a standard way to create an ABC using inheritance.

FallbackAdapter is an LLM that can fallback to a different LLM if the current LLM fails.

Args
llm : list[LLM]
List of LLM instances to fallback to.
attempt_timeout : float, optional
Timeout for each LLM attempt. Defaults to 5.0.
max_retry_per_llm : int, optional
Internal retries per LLM. Defaults to 0, which means no internal retries, the failed LLM will be skipped and the next LLM will be used.
retry_interval : float, optional
Interval between retries. Defaults to 0.5.
retry_on_chunk_sent : bool, optional
Whether to retry when a LLM failed after chunks are sent. Defaults to False.
Raises
ValueError
If no LLM instances are provided.
Ancestors
livekit.agents.llm.llm.LLM abc.ABC EventEmitter typing.Generic
Instance variables
prop model : str
Expand source code
Get the model name/identifier for this LLM instance.

Returns
The model name if available, "unknown" otherwise.

Note
Plugins should override this property to provide their model information.

prop provider : str
Expand source code
Get the provider name/identifier for this LLM instance.

Returns
The provider name if available, "unknown" otherwise.

Note
Plugins should override this property to provide their provider information.

Methods
async def aclose
(
self) ‑> None
Expand source code
def chat
(
self,
\*,
chat_ctx: ChatContext,
tools: list[FunctionTool | RawFunctionTool] | None = None,
conn_options: APIConnectOptions = APIConnectOptions(max_retry=0, retry_interval=2.0, timeout=10.0),
parallel_tool_calls: NotGivenOr[bool] = NOT_GIVEN,
tool_choice: NotGivenOr[ToolChoice] = NOT_GIVEN,
extra_kwargs: NotGivenOr[dict[str, Any]] = NOT_GIVEN) ‑> livekit.agents.llm.llm.LLMStream
Expand source code
Inherited members
EventEmitter: emit off on once
class FunctionCall
(
\*\*data: Any)
Expand source code
Usage docs: https://docs.pydantic.dev/2.10/concepts/models/

A base class for creating Pydantic models.

Attributes
**class_vars**
The names of the class variables defined on the model.
**private_attributes**
Metadata about the private attributes of the model.
**signature**
The synthesized **init** [Signature][inspect.Signature] of the model.
**pydantic_complete**
Whether model building is completed, or if there are still undefined fields.
**pydantic_core_schema**
The core schema of the model.
**pydantic_custom_init**
Whether the model has a custom **init** function.
**pydantic_decorators**
Metadata containing the decorators defined on the model. This replaces Model.**validators** and Model.**root_validators** from Pydantic V1.
**pydantic_generic_metadata**
Metadata for generic models; contains data used for a similar purpose to args, origin, parameters in typing-module generics. May eventually be replaced by these.
**pydantic_parent_namespace**
Parent namespace of the model, used for automatic rebuilding of models.
**pydantic_post_init**
The name of the post-init method for the model, if defined.
**pydantic_root_model**
Whether the model is a [RootModel][pydantic.root_model.RootModel].
**pydantic_serializer**
The pydantic-core SchemaSerializer used to dump instances of the model.
**pydantic_validator**
The pydantic-core SchemaValidator used to validate instances of the model.
**pydantic_fields**
A dictionary of field names and their corresponding [FieldInfo][pydantic.fields.FieldInfo] objects.
**pydantic_computed_fields**
A dictionary of computed field names and their corresponding [ComputedFieldInfo][pydantic.fields.ComputedFieldInfo] objects.
**pydantic_extra**
A dictionary containing extra values, if [extra][pydantic.config.ConfigDict.extra] is set to 'allow'.
**pydantic_fields_set**
The names of fields explicitly set during instantiation.
**pydantic_private**
Values of private attributes set on the model instance.
Create a new model by parsing and validating input data from keyword arguments.

Raises [ValidationError][pydantic_core.ValidationError] if the input data cannot be validated to form a valid model.

self is explicitly positional-only to allow self as a field name.

Ancestors
pydantic.main.BaseModel
Class variables
var arguments : str
var call_id : str
var created_at : float
var id : str
var model_config
var name : str
var type : Literal['function_call']
class FunctionCallOutput
(
\*\*data: Any)
Expand source code
Usage docs: https://docs.pydantic.dev/2.10/concepts/models/

A base class for creating Pydantic models.

Attributes
**class_vars**
The names of the class variables defined on the model.
**private_attributes**
Metadata about the private attributes of the model.
**signature**
The synthesized **init** [Signature][inspect.Signature] of the model.
**pydantic_complete**
Whether model building is completed, or if there are still undefined fields.
**pydantic_core_schema**
The core schema of the model.
**pydantic_custom_init**
Whether the model has a custom **init** function.
**pydantic_decorators**
Metadata containing the decorators defined on the model. This replaces Model.**validators** and Model.**root_validators** from Pydantic V1.
**pydantic_generic_metadata**
Metadata for generic models; contains data used for a similar purpose to args, origin, parameters in typing-module generics. May eventually be replaced by these.
**pydantic_parent_namespace**
Parent namespace of the model, used for automatic rebuilding of models.
**pydantic_post_init**
The name of the post-init method for the model, if defined.
**pydantic_root_model**
Whether the model is a [RootModel][pydantic.root_model.RootModel].
**pydantic_serializer**
The pydantic-core SchemaSerializer used to dump instances of the model.
**pydantic_validator**
The pydantic-core SchemaValidator used to validate instances of the model.
**pydantic_fields**
A dictionary of field names and their corresponding [FieldInfo][pydantic.fields.FieldInfo] objects.
**pydantic_computed_fields**
A dictionary of computed field names and their corresponding [ComputedFieldInfo][pydantic.fields.ComputedFieldInfo] objects.
**pydantic_extra**
A dictionary containing extra values, if [extra][pydantic.config.ConfigDict.extra] is set to 'allow'.
**pydantic_fields_set**
The names of fields explicitly set during instantiation.
**pydantic_private**
Values of private attributes set on the model instance.
Create a new model by parsing and validating input data from keyword arguments.

Raises [ValidationError][pydantic_core.ValidationError] if the input data cannot be validated to form a valid model.

self is explicitly positional-only to allow self as a field name.

Ancestors
pydantic.main.BaseModel
Class variables
var call_id : str
var created_at : float
var id : str
var is_error : bool
var model_config
var name : str
var output : str
var type : Literal['function_call_output']
class FunctionTool
(
\*args, \*\*kwargs)
Expand source code
Base class for protocol classes.

Protocol classes are defined as::

class Proto(Protocol):
def meth(self) -> int:
...
Such classes are primarily used with static type checkers that recognize structural subtyping (static duck-typing).

For example::

class C:
def meth(self) -> int:
return 0

def func(x: Proto) -> int:
return x.meth()

func(C()) # Passes static type check
See PEP 544 for details. Protocol classes decorated with @typing.runtime_checkable act as simple-minded runtime protocols that check only the presence of given attributes, ignoring their type signatures. Protocol classes can be generic, they are defined as::

class GenProto[T](Protocol):
def meth(self) -> T:
...
Ancestors
typing.Protocol typing.Generic
class FunctionToolCall
(
\*\*data: Any)
Expand source code
Usage docs: https://docs.pydantic.dev/2.10/concepts/models/

A base class for creating Pydantic models.

Attributes
**class_vars**
The names of the class variables defined on the model.
**private_attributes**
Metadata about the private attributes of the model.
**signature**
The synthesized **init** [Signature][inspect.Signature] of the model.
**pydantic_complete**
Whether model building is completed, or if there are still undefined fields.
**pydantic_core_schema**
The core schema of the model.
**pydantic_custom_init**
Whether the model has a custom **init** function.
**pydantic_decorators**
Metadata containing the decorators defined on the model. This replaces Model.**validators** and Model.**root_validators** from Pydantic V1.
**pydantic_generic_metadata**
Metadata for generic models; contains data used for a similar purpose to args, origin, parameters in typing-module generics. May eventually be replaced by these.
**pydantic_parent_namespace**
Parent namespace of the model, used for automatic rebuilding of models.
**pydantic_post_init**
The name of the post-init method for the model, if defined.
**pydantic_root_model**
Whether the model is a [RootModel][pydantic.root_model.RootModel].
**pydantic_serializer**
The pydantic-core SchemaSerializer used to dump instances of the model.
**pydantic_validator**
The pydantic-core SchemaValidator used to validate instances of the model.
**pydantic_fields**
A dictionary of field names and their corresponding [FieldInfo][pydantic.fields.FieldInfo] objects.
**pydantic_computed_fields**
A dictionary of computed field names and their corresponding [ComputedFieldInfo][pydantic.fields.ComputedFieldInfo] objects.
**pydantic_extra**
A dictionary containing extra values, if [extra][pydantic.config.ConfigDict.extra] is set to 'allow'.
**pydantic_fields_set**
The names of fields explicitly set during instantiation.
**pydantic_private**
Values of private attributes set on the model instance.
Create a new model by parsing and validating input data from keyword arguments.

Raises [ValidationError][pydantic_core.ValidationError] if the input data cannot be validated to form a valid model.

self is explicitly positional-only to allow self as a field name.

Ancestors
pydantic.main.BaseModel
Class variables
var arguments : str
var call_id : str
var model_config
var name : str
var type : Literal['function']
class GenerationCreatedEvent
(
message_stream: AsyncIterable[MessageGeneration],
function_stream: AsyncIterable[FunctionCall],
user_initiated: bool,
response_id: str | None = None)
Expand source code
GenerationCreatedEvent(message_stream: 'AsyncIterable[MessageGeneration]', function_stream: 'AsyncIterable[FunctionCall]', user_initiated: 'bool', response_id: 'str | None' = None)

Instance variables
var function_stream : AsyncIterable[livekit.agents.llm.chat_context.FunctionCall]
var message_stream : AsyncIterable[livekit.agents.llm.realtime.MessageGeneration]
var response_id : str | None
The response ID associated with this generation, used for metrics attribution

var user_initiated : bool
True if the message was generated by the user using generate_reply()

class ImageContent
(
\*\*data: Any)
Expand source code
ImageContent is used to input images into the ChatContext on supported LLM providers / plugins.

You may need to consult your LLM provider's documentation on supported URL types.

# Pass a VideoFrame directly, which will be automatically converted to a JPEG data URL internally

async for event in rtc.VideoStream(video_track):
chat_image = ImageContent(image=event.frame) # this instance is now available for your ChatContext

# Encode your VideoFrame yourself for more control, and pass the result as a data URL (see EncodeOptions for more details)

from livekit.agents.utils.images import encode, EncodeOptions, ResizeOptions

image_bytes = encode(
event.frame,
EncodeOptions(
format="PNG",
resize_options=ResizeOptions(width=512, height=512, strategy="scale_aspect_fit"),
),
)
chat_image = ImageContent(
image=f"data:image/png;base64,{base64.b64encode(image_bytes).decode('utf-8')}"
)

# With an external URL

chat_image = ImageContent(image="https://example.com/image.jpg")
Create a new model by parsing and validating input data from keyword arguments.

Raises [ValidationError][pydantic_core.ValidationError] if the input data cannot be validated to form a valid model.

self is explicitly positional-only to allow self as a field name.

Ancestors
pydantic.main.BaseModel
Class variables
var id : str
Unique identifier for the image

var image : str | VideoFrame
Either a string URL or a VideoFrame object

var inference_detail : Literal['auto', 'high', 'low']
Detail parameter for LLM provider, if supported.

Currently only supported by OpenAI (see https://platform.openai.com/docs/guides/vision?lang=node#low-or-high-fidelity-image-understanding)

var inference_height : int | None
Resizing parameter for rtc.VideoFrame inputs (ignored for URL images)

var inference_width : int | None
Resizing parameter for rtc.VideoFrame inputs (ignored for URL images)

var mime_type : str | None
MIME type of the image

var model_config
var type : Literal['image_content']
Methods
def model_post_init
(
self: BaseModel, context: Any, /) ‑> None
Expand source code
This function is meant to behave like a BaseModel method to initialise private attributes.

It takes context as an argument since that's what pydantic-core passes when calling it.

Args
self
The BaseModel instance.
context
The context.
class InputSpeechStartedEvent
Expand source code
InputSpeechStartedEvent()

class InputSpeechStoppedEvent
(
user_transcription_enabled: bool)
Expand source code
InputSpeechStoppedEvent(user_transcription_enabled: 'bool')

Instance variables
var user_transcription_enabled : bool
class InputTranscriptionCompleted
(
item_id: str, transcript: str, is_final: bool)
Expand source code
InputTranscriptionCompleted(item_id: 'str', transcript: 'str', is_final: 'bool')

Instance variables
var is_final : bool
var item_id : str
id of the item

var transcript : str
transcript of the input audio

class LLM
Expand source code
Helper class that provides a standard way to create an ABC using inheritance.

Ancestors
abc.ABC EventEmitter typing.Generic
Subclasses
LLM livekit.agents.llm.fallback_adapter.FallbackAdapter livekit.plugins.anthropic.llm.LLM livekit.plugins.aws.llm.LLM livekit.plugins.google.llm.LLM livekit.plugins.langchain.langgraph.LLMAdapter livekit.plugins.mistralai.llm.LLM livekit.plugins.openai.llm.LLM
Instance variables
prop label : str
Expand source code
prop model : str
Expand source code
Get the model name/identifier for this LLM instance.

Returns
The model name if available, "unknown" otherwise.

Note
Plugins should override this property to provide their model information.

prop provider : str
Expand source code
Get the provider name/identifier for this LLM instance.

Returns
The provider name if available, "unknown" otherwise.

Note
Plugins should override this property to provide their provider information.

Methods
async def aclose
(
self) ‑> None
Expand source code
def chat
(
self,
\*,
chat_ctx: ChatContext,
tools: list[FunctionTool | RawFunctionTool] | None = None,
conn_options: APIConnectOptions = APIConnectOptions(max_retry=3, retry_interval=2.0, timeout=10.0),
parallel_tool_calls: NotGivenOr[bool] = NOT_GIVEN,
tool_choice: NotGivenOr[ToolChoice] = NOT_GIVEN,
extra_kwargs: NotGivenOr[dict[str, Any]] = NOT_GIVEN) ‑> livekit.agents.llm.llm.LLMStream
Expand source code
def prewarm
(
self) ‑> None
Expand source code
Pre-warm connection to the LLM service

Inherited members
EventEmitter: emit off on once
class LLMError
(
\*\*data: Any)
Expand source code
Usage docs: https://docs.pydantic.dev/2.10/concepts/models/

A base class for creating Pydantic models.

Attributes
**class_vars**
The names of the class variables defined on the model.
**private_attributes**
Metadata about the private attributes of the model.
**signature**
The synthesized **init** [Signature][inspect.Signature] of the model.
**pydantic_complete**
Whether model building is completed, or if there are still undefined fields.
**pydantic_core_schema**
The core schema of the model.
**pydantic_custom_init**
Whether the model has a custom **init** function.
**pydantic_decorators**
Metadata containing the decorators defined on the model. This replaces Model.**validators** and Model.**root_validators** from Pydantic V1.
**pydantic_generic_metadata**
Metadata for generic models; contains data used for a similar purpose to args, origin, parameters in typing-module generics. May eventually be replaced by these.
**pydantic_parent_namespace**
Parent namespace of the model, used for automatic rebuilding of models.
**pydantic_post_init**
The name of the post-init method for the model, if defined.
**pydantic_root_model**
Whether the model is a [RootModel][pydantic.root_model.RootModel].
**pydantic_serializer**
The pydantic-core SchemaSerializer used to dump instances of the model.
**pydantic_validator**
The pydantic-core SchemaValidator used to validate instances of the model.
**pydantic_fields**
A dictionary of field names and their corresponding [FieldInfo][pydantic.fields.FieldInfo] objects.
**pydantic_computed_fields**
A dictionary of computed field names and their corresponding [ComputedFieldInfo][pydantic.fields.ComputedFieldInfo] objects.
**pydantic_extra**
A dictionary containing extra values, if [extra][pydantic.config.ConfigDict.extra] is set to 'allow'.
**pydantic_fields_set**
The names of fields explicitly set during instantiation.
**pydantic_private**
Values of private attributes set on the model instance.
Create a new model by parsing and validating input data from keyword arguments.

Raises [ValidationError][pydantic_core.ValidationError] if the input data cannot be validated to form a valid model.

self is explicitly positional-only to allow self as a field name.

Ancestors
pydantic.main.BaseModel
Class variables
var error : Exception
var label : str
var model_config
var recoverable : bool
var timestamp : float
var type : Literal['llm_error']
class LLMStream
(
llm: LLM,
\*,
chat_ctx: ChatContext,
tools: list[FunctionTool | RawFunctionTool],
conn_options: APIConnectOptions)
Expand source code
Helper class that provides a standard way to create an ABC using inheritance.

Ancestors
abc.ABC
Subclasses
LLMStream livekit.agents.llm.fallback_adapter.FallbackLLMStream livekit.plugins.anthropic.llm.LLMStream livekit.plugins.aws.llm.LLMStream livekit.plugins.google.llm.LLMStream livekit.plugins.langchain.langgraph.LangGraphStream livekit.plugins.mistralai.llm.LLMStream
Instance variables
prop chat_ctx : ChatContext
Expand source code
prop tools : list[FunctionTool | RawFunctionTool]
Expand source code
Methods
async def aclose
(
self) ‑> None
Expand source code
def to_str_iterable
(
self) ‑> AsyncIterable[str]
Expand source code
Convert the LLMStream to an async iterable of strings. This assumes the stream will not call any tools.

class MessageGeneration
(
message_id: str,
text_stream: AsyncIterable[str],
audio_stream: AsyncIterable[rtc.AudioFrame],
modalities: "Awaitable[list[Literal['text', 'audio']]]")
Expand source code
MessageGeneration(message_id: 'str', text_stream: 'AsyncIterable[str]', audio_stream: 'AsyncIterable[rtc.AudioFrame]', modalities: "Awaitable[list[Literal['text', 'audio']]]")

Instance variables
var audio_stream : AsyncIterable[AudioFrame]
var message_id : str
var modalities : Awaitable[list[typing.Literal['text', 'audio']]]
var text_stream : AsyncIterable[str]
class RawFunctionTool
(
\*args, \*\*kwargs)
Expand source code
Base class for protocol classes.

Protocol classes are defined as::

class Proto(Protocol):
def meth(self) -> int:
...
Such classes are primarily used with static type checkers that recognize structural subtyping (static duck-typing).

For example::

class C:
def meth(self) -> int:
return 0

def func(x: Proto) -> int:
return x.meth()

func(C()) # Passes static type check
See PEP 544 for details. Protocol classes decorated with @typing.runtime_checkable act as simple-minded runtime protocols that check only the presence of given attributes, ignoring their type signatures. Protocol classes can be generic, they are defined as::

class GenProto[T](Protocol):
def meth(self) -> T:
...
Ancestors
typing.Protocol typing.Generic
class RealtimeCapabilities
(
message_truncation: bool,
turn_detection: bool,
user_transcription: bool,
auto_tool_reply_generation: bool,
audio_output: bool,
manual_function_calls: bool)
Expand source code
RealtimeCapabilities(message_truncation: 'bool', turn_detection: 'bool', user_transcription: 'bool', auto_tool_reply_generation: 'bool', audio_output: 'bool', manual_function_calls: 'bool')

Instance variables
var audio_output : bool
var auto_tool_reply_generation : bool
var manual_function_calls : bool
var message_truncation : bool
var turn_detection : bool
var user_transcription : bool
class RealtimeError
(
message: str)
Expand source code
Common base class for all non-exit exceptions.

Ancestors
builtins.Exception builtins.BaseException
class RealtimeModel
(
\*,
capabilities: RealtimeCapabilities)
Expand source code
Subclasses
livekit.plugins.aws.experimental.realtime.realtime_model.RealtimeModel RealtimeModel livekit.plugins.openai.realtime.realtime_model.RealtimeModel livekit.plugins.openai.realtime.realtime_model_beta.RealtimeModelBeta RealtimeModel
Instance variables
prop capabilities : RealtimeCapabilities
Expand source code
prop label : str
Expand source code
prop model : str
Expand source code
prop provider : str
Expand source code
Methods
async def aclose
(
self) ‑> None
Expand source code
def session
(
self) ‑> livekit.agents.llm.realtime.RealtimeSession
Expand source code
class RealtimeModelError
(
\*\*data: Any)
Expand source code
Usage docs: https://docs.pydantic.dev/2.10/concepts/models/

A base class for creating Pydantic models.

Attributes
**class_vars**
The names of the class variables defined on the model.
**private_attributes**
Metadata about the private attributes of the model.
**signature**
The synthesized **init** [Signature][inspect.Signature] of the model.
**pydantic_complete**
Whether model building is completed, or if there are still undefined fields.
**pydantic_core_schema**
The core schema of the model.
**pydantic_custom_init**
Whether the model has a custom **init** function.
**pydantic_decorators**
Metadata containing the decorators defined on the model. This replaces Model.**validators** and Model.**root_validators** from Pydantic V1.
**pydantic_generic_metadata**
Metadata for generic models; contains data used for a similar purpose to args, origin, parameters in typing-module generics. May eventually be replaced by these.
**pydantic_parent_namespace**
Parent namespace of the model, used for automatic rebuilding of models.
**pydantic_post_init**
The name of the post-init method for the model, if defined.
**pydantic_root_model**
Whether the model is a [RootModel][pydantic.root_model.RootModel].
**pydantic_serializer**
The pydantic-core SchemaSerializer used to dump instances of the model.
**pydantic_validator**
The pydantic-core SchemaValidator used to validate instances of the model.
**pydantic_fields**
A dictionary of field names and their corresponding [FieldInfo][pydantic.fields.FieldInfo] objects.
**pydantic_computed_fields**
A dictionary of computed field names and their corresponding [ComputedFieldInfo][pydantic.fields.ComputedFieldInfo] objects.
**pydantic_extra**
A dictionary containing extra values, if [extra][pydantic.config.ConfigDict.extra] is set to 'allow'.
**pydantic_fields_set**
The names of fields explicitly set during instantiation.
**pydantic_private**
Values of private attributes set on the model instance.
Create a new model by parsing and validating input data from keyword arguments.

Raises [ValidationError][pydantic_core.ValidationError] if the input data cannot be validated to form a valid model.

self is explicitly positional-only to allow self as a field name.

Ancestors
pydantic.main.BaseModel
Class variables
var error : Exception
var label : str
var model_config
var recoverable : bool
var timestamp : float
var type : Literal['realtime_model_error']
class RealtimeSession
(
realtime_model: RealtimeModel)
Expand source code
Helper class that provides a standard way to create an ABC using inheritance.

Ancestors
abc.ABC EventEmitter typing.Generic
Subclasses
livekit.plugins.aws.experimental.realtime.realtime_model.RealtimeSession RealtimeSession livekit.plugins.openai.realtime.realtime_model.RealtimeSession livekit.plugins.openai.realtime.realtime_model_beta.RealtimeSessionBeta RealtimeSession
Instance variables
prop chat_ctx : ChatContext
Expand source code
prop realtime_model : RealtimeModel
Expand source code
prop tools : ToolContext
Expand source code
Methods
async def aclose
(
self) ‑> None
Expand source code
def clear_audio
(
self) ‑> None
Expand source code
def commit_audio
(
self) ‑> None
Expand source code
def generate_reply
(
self, \*, instructions: NotGivenOr[str] = NOT_GIVEN) ‑> \_asyncio.Future[livekit.agents.llm.realtime.GenerationCreatedEvent]
Expand source code
def interrupt
(
self) ‑> None
Expand source code
def push_audio
(
self, frame: rtc.AudioFrame) ‑> None
Expand source code
def push_video
(
self, frame: rtc.VideoFrame) ‑> None
Expand source code
def start_user_activity
(
self) ‑> None
Expand source code
notifies the model that user activity has started

def truncate
(
self,
_,
message_id: str,
modalities: "list[Literal['text', 'audio']]",
audio_end_ms: int,
audio_transcript: NotGivenOr[str] = NOT_GIVEN) ‑> None
Expand source code
async def update_chat_ctx
(
self,
chat_ctx: ChatContext) ‑> None
Expand source code
async def update_instructions
(
self, instructions: str) ‑> None
Expand source code
def update_options
(
self, _, tool_choice: NotGivenOr[ToolChoice | None] = NOT_GIVEN) ‑> None
Expand source code
async def update_tools
(
self,
tools: list[FunctionTool | RawFunctionTool | Any]) ‑> None
Expand source code
Inherited members
EventEmitter: emit off on once
class RealtimeSessionReconnectedEvent
Expand source code
RealtimeSessionReconnectedEvent()

class StopResponse
Expand source code
Common base class for all non-exit exceptions.

Exception raised within AI functions.

This exception can be raised by the user to indicate that the agent should not generate a response for the current function call.

Ancestors
builtins.Exception builtins.BaseException
class ToolContext
(
tools: list[FunctionTool | RawFunctionTool])
Expand source code
Stateless container for a set of AI functions

Static methods
def empty
(
) ‑> livekit.agents.llm.tool_context.ToolContext
Instance variables
prop function_tools : dict[str, FunctionTool | RawFunctionTool]
Expand source code
Methods
def copy
(
self) ‑> livekit.agents.llm.tool_context.ToolContext
Expand source code
def update_tools
(
self,
tools: list[FunctionTool | RawFunctionTool]) ‑> None
Expand source code
class ToolError
(
message: str)
Expand source code
Common base class for all non-exit exceptions.

Exception raised within AI functions.

This exception should be raised by users when an error occurs in the context of AI operations. The provided message will be visible to the LLM, allowing it to understand the context of the error during FunctionOutput generation.

Ancestors
builtins.Exception builtins.BaseException
Instance variables
prop message : str
Expand source code
Super-module
livekit.agents
Sub-modules
livekit.agents.llm.mcp
livekit.agents.llm.remote_chat_context
livekit.agents.llm.utils
Functions
find_function_tools
function_tool
is_function_tool
is_raw_function_tool
Classes
AudioContent
frame
model_config
transcript
type
AvailabilityChangedEvent
available
llm
ChatChunk
delta
id
model_config
usage
ChatContext
add_message
copy
empty
find_insertion_index
from_dict
get_by_id
index_by_id
insert
is_equivalent
items
merge
readonly
to_dict
to_provider_format
truncate
ChatMessage
content
created_at
hash
id
interrupted
model_config
role
text_content
transcript_confidence
type
ChoiceDelta
content
model_config
role
tool_calls
CompletionUsage
cache_creation_tokens
cache_read_tokens
completion_tokens
model_config
prompt_cached_tokens
prompt_tokens
total_tokens
FallbackAdapter
aclose
chat
model
provider
FunctionCall
arguments
call_id
created_at
id
model_config
name
type
FunctionCallOutput
call_id
created_at
id
is_error
model_config
name
output
type
FunctionTool
FunctionToolCall
arguments
call_id
model_config
name
type
GenerationCreatedEvent
function_stream
message_stream
response_id
user_initiated
ImageContent
id
image
inference_detail
inference_height
inference_width
mime_type
model_config
model_post_init
type
InputSpeechStartedEvent
InputSpeechStoppedEvent
user_transcription_enabled
InputTranscriptionCompleted
is_final
item_id
transcript
LLM
aclose
chat
label
model
prewarm
provider
LLMError
error
label
model_config
recoverable
timestamp
type
LLMStream
aclose
chat_ctx
to_str_iterable
tools
MessageGeneration
audio_stream
message_id
modalities
text_stream
RawFunctionTool
RealtimeCapabilities
audio_output
auto_tool_reply_generation
manual_function_calls
message_truncation
turn_detection
user_transcription
RealtimeError
RealtimeModel
aclose
capabilities
label
model
provider
session
RealtimeModelError
error
label
model_config
recoverable
timestamp
type
RealtimeSession
aclose
chat_ctx
clear_audio
commit_audio
generate_reply
interrupt
push_audio
push_video
realtime_model
start_user_activity
tools
truncate
update_chat_ctx
update_instructions
update_options
update_tools
RealtimeSessionReconnectedEvent
StopResponse
ToolContext
copy
empty
function_tools
update_tools
ToolError
message
Generated by pdoc 0.11.6.
Apollo.io
