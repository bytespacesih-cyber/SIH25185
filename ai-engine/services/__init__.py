from .evaluator import evaluate_proposal
from .ocr_service import process_document
from .feedback_suggester import generate_feedback
from .research_paper_finder import find_related_papers

__all__ = [
    "evaluate_proposal",
    "process_document",
    "generate_feedback",
    "find_related_papers"
]
