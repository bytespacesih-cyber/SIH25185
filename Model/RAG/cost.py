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

def cost_estimation(text: str) -> dict:
    prompt = f"""
    You are an AI cost estimator. Analyze the following text and provide:
    1. Estimated cost (in rupees).
    2. Breakdown of costs by category if applicable.
    3. Search for any mentioned budgets or financial figures.
    4. Check for the tools what they are used if it not free of cost and provide the cost.
    5. Any other relevant financial information.
    Only respond in JSON format like:
    {{
        "estimated_cost": 1000,
        "cost_breakdown": {{
            "category_1": 500,
            "category_2": 300,
            "category_3": 200
        }}
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
        return {"report": "Cost found by fallback system", "percentage": response.text}

# --- API Route ---
@router.post("/check-cost")
async def check_cost(file: UploadFile = File(...)):
    try:
        pdf_text = extract_text_from_pdf(file.file)
        result = cost_estimation(pdf_text)
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
