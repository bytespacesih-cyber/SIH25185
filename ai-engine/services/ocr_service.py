import pytesseract
from PIL import Image
import io

async def process_document(file):
    """
    Mock OCR service (for handwritten proposals).
    """
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        text = pytesseract.image_to_string(image)
        return text if text.strip() else "No text detected."
    except Exception:
        return "⚠️ OCR service unavailable. Returning mock text."
