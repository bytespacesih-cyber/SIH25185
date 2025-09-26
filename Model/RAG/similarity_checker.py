import os
import json
import torch
from torch.nn.functional import cosine_similarity
from transformers import pipeline
from dotenv import load_dotenv
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from langchain_google_genai import GoogleGenerativeAI

# -----------------------------
# Load environment variables
# -----------------------------
load_dotenv()

embedding_model = pipeline("feature-extraction", model="sentence-transformers/all-MiniLM-L6-v2")
llm = GoogleGenerativeAI(model="gemini-2.5-flash-lite")

router = APIRouter()

# -----------------------------
# Helper functions
# -----------------------------
def fetch_json_from_file(file) -> dict:
    return json.load(file)

def get_embedding(text: str):
    output = embedding_model(text, truncation=True, padding=True)
    tensor = torch.tensor(output[0])
    return tensor.mean(dim=0)

def miniLM_score(text1: str, text2: str) -> float:
    emb1, emb2 = get_embedding(text1), get_embedding(text2)
    sim = cosine_similarity(emb1.unsqueeze(0), emb2.unsqueeze(0))
    return sim.item() * 100

def gemini_score(text1: str, text2: str) -> float:
    prompt = (
        "Read the following two sentences and determine if they express the same idea.\n"
        "Return a number between 0 and 100 indicating similarity.\n"
        f"Sentence A: {text1}\nSentence B: {text2}\nAnswer with just a number."
    )
    response = llm.invoke(prompt)
    try:
        score = float(response.strip())
    except:
        import re
        m = re.search(r"\d+(\.\d+)?", response.text)
        score = float(m.group(0)) if m else 0.0
    return max(0.0, min(score, 100.0))

def combined_score(mini_score: float, gem_score: float) -> float:
    return (mini_score + gem_score) / 2

def compare_json(json1: dict, json2: dict):
    total_score, count = 0, 0
    details = []
    
    for key in json1.keys() & json2.keys():
        text1, text2 = str(json1[key]), str(json2[key])
        
        mini_score_val = miniLM_score(text1, text2)
        gem_score_val = gemini_score(text1, text2)
        final_score_val = combined_score(mini_score_val, gem_score_val)
        
        total_score += final_score_val
        count += 1
        
        details.append({
            "key": key,
            "text1": text1,
            "text2": text2,
            "miniLM_score": mini_score_val,
            "gemini_score": gem_score_val,
            "combined_score": final_score_val
        })
    
    overall_score = total_score / count if count > 0 else 0
    return {
        "overall_score": overall_score,
        "details": details
    }

# -----------------------------
# API route
# -----------------------------
@router.post("/compare-json")
async def compare_json_files(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    try:
        json1 = fetch_json_from_file(file1.file)
        json2 = fetch_json_from_file(file2.file)
        result = compare_json(json1, json2)
        return result
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
