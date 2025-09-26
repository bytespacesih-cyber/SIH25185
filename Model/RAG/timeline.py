import os
from dotenv import load_dotenv
import PyPDF2
import google.generativeai as genai
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse

# -----------------------------
# Load environment variables
# -----------------------------
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)

router = APIRouter()

# -----------------------------
# Helper functions
# -----------------------------
def extract_text_from_pdf(file) -> str:
    text = ""
    reader = PyPDF2.PdfReader(file)
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

def generate_timeline(text: str):
    prompt = f"""
    You are an AI timeline generator. Analyze the following text and provide:
    1. A timeline of events mentioned in the text.
    2. Key dates and their corresponding events.
    Only respond in JSON format like:
    {{
        "timeline": [
            {{
                "date": "YYYY-MM-DD",
                "event": "Description of the event"
            }}
        ]
    }}

    Text to analyze:
    {text}
    """
    # Use a valid model version
    model = genai.GenerativeModel("gemini-2.5-flash-lite")
    response = model.generate_content(prompt)
    return response.text


# -----------------------------
# API route
# -----------------------------
@router.post("/timeline")
async def pdf_timeline(file: UploadFile = File(...)):
    try:
        text = extract_text_from_pdf(file.file)
        result = generate_timeline(text)
        return {"timeline_json": result}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
