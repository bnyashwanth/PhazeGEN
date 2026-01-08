import os
import random

# ==========================================
# CONFIGURATION
# ==========================================
USE_REAL_AI = False  # Set to True when you have an API Key

# Option A: Azure OpenAI
AZURE_ENDPOINT = "https://YOUR-RESOURCE.openai.azure.com/"
AZURE_API_KEY = "YOUR-KEY"
DEPLOYMENT_NAME = "gpt-35-turbo"

# Option B: Standard OpenAI
OPENAI_API_KEY = "sk-..." 

# ==========================================
# MAIN LOGIC
# ==========================================

def generate_chat_response(user_message: str, context: dict):
    if USE_REAL_AI:
        return call_real_ai(user_message, context)
    else:
        return mock_doctor_ai(user_message, context)

def call_real_ai(user_message: str, context: dict):
    try:
        from openai import AzureOpenAI, OpenAI
        
        # 1. EXTRACT THERAPEUTICS DATA
        therapeutics = context.get('therapeutics', [])
        best_tx = therapeutics[0]['name'] if therapeutics else "None"
        best_score = therapeutics[0]['success_prob'] if therapeutics else 0
        
        # 2. BUILD THE SYSTEM PROMPT
        system_prompt = f"""
        You are Dr. Phaze, an expert AI in antimicrobial resistance.
        
        ANALYSIS DATA:
        - Risk Level: {context.get('risk_level', 'Unknown')}
        - Risk Score: {context.get('risk_score', 0)*100:.0f}/100
        - Resistance Genes: {[g['gene'] for g in context.get('resistance_genes', [])]}
        - CRISPR Systems: {context.get('crispr_status', 'Unknown')}
        - Best Therapeutic Candidate: {best_tx} (Efficacy: {best_score}%)
        - Total Treatments Simulated: {len(therapeutics)}
        
        INSTRUCTIONS:
        - Answer the user's question based strictly on the data above.
        - If asked to "Summarize" or "Report", provide a clinical summary of the Risk and the Best Treatment strategy.
        - Be concise and professional.
        """

        # 3. CALL THE API
        if "azure.com" in AZURE_ENDPOINT:
            client = AzureOpenAI(
                azure_endpoint=AZURE_ENDPOINT,
                api_key=AZURE_API_KEY,
                api_version="2023-05-15"
            )
            model = DEPLOYMENT_NAME
        else:
            client = OpenAI(api_key=OPENAI_API_KEY)
            model = "gpt-3.5-turbo"

        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
        )
        return response.choices[0].message.content

    except Exception as e:
        return f"AI Connection Error: {str(e)}"

def mock_doctor_ai(user_message: str, context: dict):
    """
    Offline Mode Logic
    """
    msg = user_message.lower()
    risk = context.get('risk_level', 'Unknown')
    therapeutics = context.get('therapeutics', [])
    best_tx = therapeutics[0] if therapeutics else None

    # REPORT / SUMMARY REQUEST
    if any(x in msg for x in ["report", "summary", "summarize", "conclusion"]):
        if best_tx:
            return (f"**Clinical Summary:**\n\n"
                    f"The genome presents a **{risk}** pathogenic risk. "
                    f"Our In-Silico trials identified **{best_tx['name']}** as the top candidate "
                    f"with **{best_tx['success_prob']}% efficacy**, targeting the {best_tx['target']}. "
                    f"I recommend generating the full PDF report for details.")
        else:
            return f"**Summary:** This genome is classified as **{risk} Risk**. No therapeutic simulations have been run yet."

    # RISK QUESTIONS
    if any(x in msg for x in ["risk", "dangerous", "safe"]):
        return f"⚠️ **Risk Assessment**: This genome is classified as **{risk}**. Please refer to the dashboard for details."

    # TREATMENT QUESTIONS
    if any(x in msg for x in ["treat", "drug", "medicine", "cure"]):
        if best_tx:
            return f"✅ **Top Recommendation**: I suggest **{best_tx['name']}** ({best_tx['type']}). It shows a {best_tx['success_prob']}% success probability in simulations."
        return "No specific treatments identified."

    return "I am Dr. Phaze. Ask me to **summarize the results**, explain the **risk**, or recommend a **treatment**."