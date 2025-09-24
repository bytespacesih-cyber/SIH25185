import fitz  # PyMuPDF

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from a PDF file.
    """
    text = ""
    try:
        doc = fitz.open(file_path)
        for page in doc:
            text += page.get_text()
        return text if text.strip() else "⚠️ No text extracted from PDF."
    except Exception as e:
        return f"⚠️ PDF parsing failed: {e}"
