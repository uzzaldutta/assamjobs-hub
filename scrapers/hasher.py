import hashlib
import requests
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def generate_string_hash(input_string: str) -> str:
    """Generates a SHA-256 hash for a given string (e.g., URL or Job Title)."""
    if not input_string:
        return ""
    hash_obj = hashlib.sha256(input_string.encode('utf-8'))
    return hash_obj.hexdigest()

def generate_pdf_hash_from_url(pdf_url: str) -> str:
    """Downloads a PDF into memory and computes its SHA-256 hash to detect changes."""
    try:
        response = requests.get(pdf_url, stream=True, timeout=10)
        response.raise_for_status()
        
        hash_obj = hashlib.sha256()
        for chunk in response.iter_content(chunk_size=8192):
            if chunk:
                hash_obj.update(chunk)
                
        return hash_obj.hexdigest()
    except Exception as e:
        logger.error(f"Failed to generate hash for PDF {pdf_url}: {e}")
        # Fallback to just hashing the URL if PDF download fails
        return generate_string_hash(pdf_url)

if __name__ == "__main__":
    # Test
    url = "https://apsc.nic.in"
    print(f"Hash of {url}: {generate_string_hash(url)}")
