from utils.text_preprocessing import clean_text

def evaluate_proposal(text: str):
    """
    Mock evaluation combining novelty, plagiarism, feasibility, budget, and timeline.
    Later, you will connect real models from models/*.py
    """
    processed = clean_text(text)

    return {
        "novelty_score": 0.78,   # Mock value
        "plagiarism_score": 0.12,
        "feasibility_score": 0.85,
        "budget_check": "Compliant",
        "timeline_prediction": "18 months",
        "processed_text_sample": processed[:120]
    }
