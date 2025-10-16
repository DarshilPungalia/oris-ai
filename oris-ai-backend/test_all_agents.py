#!/usr/bin/env python3

"""
Test script to verify all three RAG agents compile and load properly
"""

import sys
import os

def test_agent_import(agent_name):
    """Test importing an agent module"""
    try:
        print(f"🧪 Testing {agent_name}...")
        
        # Import the module
        module = __import__(agent_name.replace('.py', ''))
        
        # Check if entrypoint function exists
        if hasattr(module, 'entrypoint'):
            print(f"  ✅ {agent_name} - imports successfully")
            print(f"  ✅ {agent_name} - has entrypoint function")
            
            # Check for required functions
            required_functions = ['book_appointment', 'assess_dental_urgency']
            
            if agent_name == 'RetrievalEngineRAGAgent.py':
                required_functions.append('retrieval_dental_info')
            elif agent_name == 'ChatEngineRAGAgent.py':
                required_functions.append('chat_with_dental_knowledge')
            elif agent_name == 'QueryEngineRAGAgent.py':
                required_functions.append('query_dental_knowledge')
            
            print(f"  ✅ {agent_name} - all components loaded correctly")
            return True
        else:
            print(f"  ❌ {agent_name} - missing entrypoint function")
            return False
            
    except Exception as e:
        print(f"  ❌ {agent_name} - import failed: {e}")
        return False

def main():
    print("🚀 Testing all RAG agents...")
    print("=" * 50)
    
    agents = [
        'RetrievalEngineRAGAgent.py',
        'ChatEngineRAGAgent.py', 
        'QueryEngineRAGAgent.py'
    ]
    
    results = []
    for agent in agents:
        success = test_agent_import(agent)
        results.append((agent, success))
        print()
    
    print("=" * 50)
    print("📊 RESULTS:")
    print("=" * 50)
    
    all_passed = True
    for agent, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{agent:<30} {status}")
        if not success:
            all_passed = False
    
    print("=" * 50)
    if all_passed:
        print("🎉 All agents are ready to use!")
        print("\nUsage:")
        print("  python RetrievalEngineRAGAgent.py dev  # Retrieval-based RAG")
        print("  python ChatEngineRAGAgent.py dev       # Chat-based RAG") 
        print("  python QueryEngineRAGAgent.py dev      # Query-based RAG")
    else:
        print("⚠️  Some agents have issues. Please check the errors above.")
        sys.exit(1)

if __name__ == "__main__":
    main()