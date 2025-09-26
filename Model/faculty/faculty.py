import os
import json
import pandas as pd
import PyPDF2
import re
from dotenv import load_dotenv
import google.genai as genai

# -----------------------------
# Load environment variables
# -----------------------------
load_dotenv()
API_KEY = "AIzaSyDr6ToTalLF5iVhQW-wROF_cYgOSoyvsYE"
genai.configure(api_key=API_KEY)  # Set the API key globally


if API_KEY is None:
    raise ValueError("API key not found. Please set the API_KEY environment variable.")
# -----------------------------
# Load faculty dataset
# -----------------------------
df = pd.read_csv(
    r"C:\Users\Shanmuga Shyam. B\OneDrive\Desktop\sih-180\Model\faculty\IIT Faculty Dataset.csv",
    skiprows=3
)
df.columns = df.columns.str.strip()
df.fillna('', inplace=True)

# Create list of all research areas
research_areas = []
for areas in df['research_areas']:
    for area in areas.split(','):
        area = area.strip().lower()
        if area and area not in research_areas:
            research_areas.append(area)

# -----------------------------
# Extract title and abstract from PDF
# -----------------------------
def extract_title_abstract(pdf_path, max_words=300):
    text = ""
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + " "

    text = " ".join(line.strip() for line in text.split('\n') if line.strip())

    abstract_match = re.search(r'abstract[:\s]*([\s\S]+?)(?=\n[A-Z][a-z]|$)', text, re.IGNORECASE)
    if abstract_match:
        abstract_text = abstract_match.group(1)
    else:
        abstract_text = " ".join(text.split()[1:max_words+1])

    title = text.split('\n')[0] if '\n' in text else text.split('.')[0]
    abstract_words = abstract_text.split()[:max_words]
    abstract = " ".join(abstract_words)

    return {"title": title.strip(), "abstract": abstract.strip()}

# -----------------------------
# Main logic
# -----------------------------
if __name__ == "__main__":
    pdf_path = r"C:\Users\Shanmuga Shyam. B\Downloads\Advanced Anomaly Detection for CCTV Deep Learning Based Real Time Alerts for Unusual Behavior (2).pdf"
    paper = extract_title_abstract(pdf_path)

    prompt = f"""
    You are given a list of research areas: {research_areas}.
    You are also given a research paper with the following title and abstract:
    Title: {paper['title']}
    Abstract: {paper['abstract']}

    Suggest the top 5 most relevant research areas from the given list that the paper belongs to.
    Return the response in JSON format with key "research_areas" and value as a list.
    """

    # Generate response using google-genai
    response = genai.generate_text(
        model="gemini-2.5",  # Replace with a working model from your account
        prompt=prompt
    )

    print(response.text)
