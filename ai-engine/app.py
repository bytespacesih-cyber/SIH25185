from fastapi import FastAPI, UploadFile, Form
from services.evaluator import evaluate_proposal
from services.ocr_service import process_document
from services.feedback_suggester import generate_feedback
from services.research_paper_finder import find_related_papers

app = FastAPI(title="NaCCER AI Engine", version="1.0.0")


@app.get("/")
def root():
    return {"message": "NaCCER AI Engine running 🚀"}


@app.post("/ocr")
async def ocr_endpoint(file: UploadFile):
    text = await process_document(file)
    return {"extracted_text": text}


@app.post("/evaluate")
async def evaluate_endpoint(text: str = Form(...)):
    result = evaluate_proposal(text)
    return {"evaluation": result}


@app.post("/feedback")
async def feedback_endpoint(text: str = Form(...)):
    suggestions = generate_feedback(text)
    return {"feedback": suggestions}


@app.get("/research")
def research_endpoint(query: str):
    papers = find_related_papers(query)
    return {"related_papers": papers}
