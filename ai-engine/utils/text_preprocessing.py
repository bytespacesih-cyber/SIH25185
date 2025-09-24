import re

def clean_text(text: str) -> str:
    """
    Basic preprocessing for text (remove special chars, lowercasing).
    """
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", "", text)
    return " ".join(text.split())
