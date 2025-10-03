import os
import PyPDF2
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse

# Load environment variables
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)

router = APIRouter()

# --- Helpers ---
def extract_text_from_pdf(file) -> str:
    text = ""
    reader = PyPDF2.PdfReader(file)
    for page in reader.pages:
        if page.extract_text():
            text += page.extract_text() + "\n"
    return text

def give_novelty_report(text: str) -> dict:
    prompt = f"""
    You are an AI novelty detector. Analyze the following text and provide:
    1. Estimated novelty percentage (0-100%).
    2. List of any unique or original sections if any.
    Only respond in JSON format like:
    {{
        "novelty_percentage": 70,
        "unique_sections": ["text part 1...", "text part 2..."]
    }}

    Text to check:
    {text[:4000]}
    """
    model = genai.GenerativeModel("gemini-2.5-flash-lite")
    response = model.generate_content(prompt)

    import json
    try:
        return json.loads(response.text)
    except Exception:
        return {"report": "There is novetly found by fallback system", "percentage": response.text}

# --- API Route ---
@router.post("/check-novelty")
async def check_novelty(file: UploadFile = File(...)):
    try:
        pdf_text = extract_text_from_pdf(file.file)
        result = give_novelty_report(pdf_text)
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
