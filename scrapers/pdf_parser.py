import io
import requests
import pdfplumber
import logging
from typing import Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def extract_text_from_pdf_url(pdf_url: str) -> Optional[str]:
    """
    Downloads a PDF from a URL and extracts its text using pdfplumber.
    Useful for extracting government notification text.
    """
    try:
        logger.info(f"Downloading PDF from {pdf_url}")
        response = requests.get(pdf_url, timeout=15)
        response.raise_for_status()
        
        pdf_file = io.BytesIO(response.content)
        
        extracted_text = []
        with pdfplumber.open(pdf_file) as pdf:
            # We limit to first 5 pages to avoid massive text dumps from 100+ page documents
            # as most recruitment summaries are in the first few pages.
            for i, page in enumerate(pdf.pages):
                if i >= 5:
                    break
                text = page.extract_text()
                if text:
                    extracted_text.append(text)
                    
        full_text = "\n".join(extracted_text)
        logger.info(f"Successfully extracted {len(full_text)} characters from PDF.")
        return full_text
    
    except Exception as e:
        logger.error(f"Failed to extract text from PDF at {pdf_url}: {e}")
        return None

if __name__ == "__main__":
    # Test with a sample small PDF if available, otherwise just defining the function.
    pass
