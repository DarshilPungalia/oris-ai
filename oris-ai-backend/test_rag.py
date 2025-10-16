#!/usr/bin/env python3

import os
from dotenv import load_dotenv
from llama_index.core import (
    SimpleDirectoryReader,
    StorageContext,
    VectorStoreIndex,
    load_index_from_storage,
    Settings,
)
from llama_index.embeddings.google_genai import GoogleGenAIEmbedding
from llama_index.core.schema import MetadataMode

load_dotenv()

# Configure Google GenAI embeddings for FREE usage
Settings.embed_model = GoogleGenAIEmbedding(
    model_name="text-embedding-004",
    embed_batch_size=100,
    api_key=os.getenv("GOOGLE_API_KEY")
)

print("🔧 Testing RAG retrieval system...")

# Initialize RAG components
PERSIST_DIR = "./dental-knowledge-storage"
if not os.path.exists(PERSIST_DIR):
    print("📁 Creating new dental knowledge index...")
    # Load dental knowledge documents and create index
    documents = SimpleDirectoryReader("dental_data").load_data()
    index = VectorStoreIndex.from_documents(documents)
    index.storage_context.persist(persist_dir=PERSIST_DIR)
    print(f"✅ Created index with {len(documents)} documents")
else:
    print("📂 Loading existing dental knowledge index...")
    # Load existing dental knowledge index
    storage_context = StorageContext.from_defaults(persist_dir=PERSIST_DIR)
    index = load_index_from_storage(storage_context)
    print("✅ Loaded existing index")

def test_retrieval(query: str) -> str:
    """Test the dental knowledge retrieval function"""
    print(f"\n🔍 Testing query: '{query}'")
    try:
        retriever = index.as_retriever(similarity_top_k=3)
        nodes = retriever.retrieve(query)
        
        print(f"📄 Found {len(nodes)} relevant documents")
        
        if not nodes:
            return "No relevant information found in knowledge base"
        
        context_str = "\n\n".join([node.get_content(metadata_mode=MetadataMode.LLM) for node in nodes])
        
        print("📝 Retrieved content preview:")
        for i, node in enumerate(nodes, 1):
            content = node.get_content(metadata_mode=MetadataMode.LLM)
            print(f"  Document {i}: {content[:150]}...")
            print(f"  Score: {node.score}")
        
        return context_str
    except Exception as e:
        print(f"❌ Error retrieving information: {e}")
        return f"Error: {e}"

# Test different queries
test_queries = [
    "price of dental cleaning",
    "cost of teeth whitening", 
    "dental examination price",
    "routine dental care",
    "preventive care services"
]

print("\n" + "="*50)
print("🧪 TESTING RAG RETRIEVAL")
print("="*50)

for query in test_queries:
    result = test_retrieval(query)
    print(f"\n{'='*20}")
    print(f"Result length: {len(result)} characters")
    if result and len(result) < 500:
        print(f"Full result: {result}")
    print("="*20)

print("\n✅ RAG testing completed!")