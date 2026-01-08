from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
from dotenv import load_dotenv
# AIzaSyDLjnTt5Dl2kkKfiMk-hJYWDN1wQ7gAQeI
#AIzaSyDNbQvLb8HlDUBmHKcevhsG0VR9H2RtsuI
# Import the pipelines and services
from ml_engine.pipeline.main_pipeline import run_analysis_pipeline#
from ml_engine.services.chat_service import generate_chat_response
from ai_research_assistant import router as ai_router

# from dotenv import load_dotenv


app = FastAPI(title="PhazeGEN API", version="1.0.0")
app.include_router(ai_router)


# CORS Setup for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Models ---
class TextPayload(BaseModel):
    sequence: str

class ChatPayload(BaseModel):
    message: str
    context: Dict[str, Any]  # The analysis results passed back to server

# --- Endpoints ---
@app.get("/")
def read_root():
    return {"status": "PhazeGEN API Active", "version": "1.0.0"}

@app.post("/analyze/text")
def analyze_text(payload: TextPayload):
    try:
        results = run_analysis_pipeline(payload.sequence)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/file")
async def analyze_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        decoded_content = content.decode("utf-8")
        results = run_analysis_pipeline(decoded_content)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
def chat_with_ai(payload: ChatPayload):
    try:
        response = generate_chat_response(payload.message, payload.context)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)