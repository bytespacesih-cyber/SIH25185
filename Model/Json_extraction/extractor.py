import os
import json
import chardet
import PyPDF2
import docx
import re
import google.generativeai as genai
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse

# -----------------------------
# Configure Gemini API
# -----------------------------
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

router = APIRouter()

# -----------------------------
# Helper functions
# -----------------------------
def extract_text(file) -> str:
    filename = file.filename
    ext = os.path.splitext(filename)[1].lower()

    if ext == ".pdf":
        text = ""
        reader = PyPDF2.PdfReader(file.file)
        for page in reader.pages:
            text += page.extract_text() or ""
        return text

    elif ext == ".docx":
        doc = docx.Document(file.file)
        return "\n".join([p.text for p in doc.paragraphs if p.text.strip()])

    elif ext in [".txt", ".csv"]:
        raw = file.file.read()
        enc = chardet.detect(raw)["encoding"] or "utf-8"
        return raw.decode(enc, errors="ignore")

    else:
        raise ValueError(f"Unsupported file type: {ext}")

def generate_json(file_content: str):
    prompt = """
    Extract the following details from the document and return ONLY valid JSON:
    {
        "title": "...",
        "author": "...",
        "affiliation": "...",
        "abstract": "...",
        "keywords": ["...", "..."],
        "introduction": "...",
        "methodology": "...",
        "results": "...",
        "discussion": "...",
        "conclusion": "...",
        "references": ["...", "..."],
        "timeline": "...",
        "research_needs": ["...", "..."],
        "funding_sources": ["...", "..."],
        "collaborating_institutions": ["...", "..."]
    }
    Respond with JSON ONLY. No explanations, no markdown.
    """
    response = model.generate_content([prompt, file_content])
    raw_text = response.text.strip()
    match = re.search(r"\{.*\}", raw_text, re.DOTALL)
    if match:
        raw_text = match.group(0)
    try:
        return json.loads(raw_text)
    except json.JSONDecodeError:
        return {"raw_output": raw_text}

# -----------------------------
# API route
# -----------------------------
@router.post("/extract-json")
async def extract_json(file: UploadFile = File(...)):
    try:
        content = extract_text(file)
        parsed_json = generate_json(content)
        return parsed_json
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
