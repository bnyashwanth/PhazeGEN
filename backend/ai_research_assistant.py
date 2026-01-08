from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os
import google.generativeai as genai
from dotenv import load_dotenv

# 1. Load Environment Variables
load_dotenv()

# 2. Configure Gemini (Standard Method)
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
else:
    print("⚠️ WARNING: GEMINI_API_KEY not found in environment variables.")

router = APIRouter(prefix="/ai", tags=["AI Research Assistant"])

# --- Models ---
class ResearchRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = {}

# --- Helper: Formats the raw JSON into readable text for the AI ---
def format_context_for_ai(context: Dict[str, Any]) -> str:
    """Converts the raw context dictionary into a readable string for Gemini."""
    if not context:
        return "No specific genomic data provided."
    
    # Create a clean text representation of the ML findings
    analysis_text = "CURRENT GENOME ANALYSIS DATA:\n"
    for key, value in context.items():
        formatted_key = key.replace("_", " ").title()
        analysis_text += f"- {formatted_key}: {value}\n"
    
    return analysis_text

# --- Helper: The "Offline" Fallback ---
def fallback_summary(context: Dict[str, Any]) -> str:
    return f"""
**⚠️ Analysis Offline (Fallback Mode)**

The AI Research engine is currently unreachable. Here is the raw data from the ML pipeline:

• **Pathogenic Risk:** {context.get("pathogenic_risk", "Unknown")}
• **Resistance Genes:** {len(context.get("resistance_genes", [])) or "None detected"}
• **CRISPR System:** {context.get("crispr_status", "Unknown")}
• **GC Content:** {context.get("gc_content", "N/A")}

*Check your server logs for API errors.*
"""
# ... keep your imports ...

@router.post("/research-assistant")
def research_assistant(req: ResearchRequest):
    message = req.message.strip()
    context = req.context or {}
    
    # 1. Check API Key
    if not api_key:
        return {"response": fallback_summary(context), "mode": "fallback_no_key"}

    try:
        # 2. Build the Advanced "Research Engine" Prompt
        data_string = format_context_for_ai(context)
        
        system_instruction = f"""
        You are **Dr. Phaze**, an advanced AI Research Scientist.
        
        === ANALYTICAL CONTEXT ===
        {data_string}

        === CAPABILITIES ===
        1. **Hypothesis Generation:** If asked to "run hypothesis" or "simulate", create 3 distinct scenarios (Optimistic, Realistic, Pessimistic) regarding treatment outcomes.
        2. **Conflict Analysis:** If asked to "compare" or "resistance vs phage", specifically analyze if the detected 'Resistance Genes' mechanism physically blocks the 'Therapeutic Phages' (e.g., does the efflux pump affect the specific phage receptor?).
        3. **Explainable Reasoning:** Always use "Chain of Thought" reasoning. Explain *why* a risk is low/high based on the specific gene absence/presence.
        4. **Research Report:** If asked for a "Report", format the output as a formal structured document with sections: 'Executive Summary', 'Genomic Profile', 'Therapeutic Strategy', and 'References'.

        === RULES ===
        - Use specific data from the context.
        - Format complex logic using Markdown lists.
        - Be highly professional yet explainable.
        
        USER COMMAND:
        {message}
        """

        # 3. Call Gemini
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(system_instruction)

        return {
            "response": response.text,
            "mode": "gemini_pro"
        }

    except Exception as e:
        print(f"\n❌ GEMINI API ERROR: {str(e)}\n")
        return {
            "response": fallback_summary(context),
            "mode": "fallback_error",
            "debug_error": str(e)
        }