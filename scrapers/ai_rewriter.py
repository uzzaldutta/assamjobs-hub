import os
import json
from pydantic import BaseModel, Field
from typing import List, Optional
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("WARNING: GEMINI_API_KEY not found in environment. AI rewriting will run in simulation mode.")
else:
    genai.configure(api_key=api_key)

class JobData(BaseModel):
    title: str
    organization: str
    job_type: str
    category: str
    vacancies: str
    qualification: str
    district: str
    age_limit: str
    last_date: Optional[str]
    official_pdf_url: Optional[str]
    apply_url: Optional[str]
    unique_description: str = Field(..., description="A 100% uniquely written 2-paragraph summary of the job. Must not copy original text.")

def rewrite_and_extract_job(raw_text: str, source_url: str) -> dict:
    """
    Sends raw scraped text to Gemini to extract facts AND write a unique, copyright-free description.
    """
    if not api_key:
        # Fallback simulation if no API key is provided
        return {
            "title": "Simulated AI Title",
            "organization": "Simulated Org",
            "job_type": "GOVERNMENT",
            "category": "ASSAM_STATE",
            "vacancies": "100",
            "qualification": "Graduate",
            "district": "All Assam",
            "age_limit": "18-40",
            "last_date": "2026-12-31",
            "official_pdf_url": "",
            "apply_url": source_url,
            "unique_description": "This is a simulated AI-rewritten description. In production, Gemini will read the raw text and generate a completely original, copyright-free summary here."
        }

    prompt = f"""
    You are an expert job portal editor. Read the following job notification scraped from a website.
    Your task is twofold:
    1. Extract the hard facts (title, organization, vacancies, dates, etc.).
    2. Write a COMPLETELY NEW, ORIGINAL 2-paragraph description of the job. DO NOT copy-paste the original text. You must rewrite it entirely to avoid copyright issues.
    
    Source URL: {source_url}
    
    Raw Text:
    {raw_text[:8000]}  # Limit to avoid token overflow
    
    Respond strictly in JSON format matching this schema:
    {{
        "title": "string",
        "organization": "string",
        "job_type": "GOVERNMENT | PRIVATE | TENDER | EXAM_UPDATE",
        "category": "string",
        "vacancies": "string",
        "qualification": "string",
        "district": "string",
        "age_limit": "string",
        "application_fee": "string (Details about fee if any, else 'None')",
        "selection_process": "string (e.g., Written Test, Interview)",
        "last_date": "YYYY-MM-DD",
        "official_pdf_url": "url string (MUST be the actual official .pdf link. DO NOT link back to the job board itself. Leave blank if none)",
        "apply_url": "url string (MUST be the actual official application link e.g. .gov.in, .nic.in, or ibps.in. DO NOT link back to the job board itself. Leave blank if none)",
        "unique_description": "string (A highly detailed, full-fledged article in Markdown format. It MUST strictly follow this structure: 1. A comprehensive introduction paragraph. 2. A quick overview list with Post Name, Vacancies, Organization, Qualification, Salary, and Dates. 3. 'Recruitment Details' section. 4. 'Vacancy Details' section. 5. 'Eligibility Conditions' section (Age, Education, etc.). 6. 'Documents Required' section. 7. 'How to Apply' section with step-by-step instructions. 8. 'Important Dates' section. 9. 'Important Links' section (DO NOT include competitor links. IF the job requires an offline application, you MUST include a download link for the 'Assam Standard Form' pointing to 'https://assam.gov.in/sites/default/files/2022-06/standard_form.pdf'). 10. 'FAQs' section. CRITICAL RULE: DO NOT generate or include any sample Cover Letters. Cover letters are strictly prohibited in the output.)",
        "unique_description_assamese": "string (The exact same highly detailed Markdown structured article, translated beautifully into Assamese script.)"
    }}
    """
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(
            prompt,
            generation_config={'response_mime_type': 'application/json'}
        )
        data = json.loads(response.text)
        
        # Post-processing: STRICTLY remove any 3rd party links (like assamcareer, indeed)
        # to ensure we never link out to competitor boards.
        banned_domains = ["assamcareer.com", "jobassam.in", "assamjobseeker.com", "indgovtjobs.net", "indeed.com", "naukri.com"]
        
        for key in ["apply_url", "official_pdf_url"]:
            url = data.get(key, "")
            if any(domain in url.lower() for domain in banned_domains):
                data[key] = "" # Strip it if it points to a 3rd party
                
        # Hard enforce type for indeed/private job scrapers if it leaked
        if "indeed" in str(data.get("organization", "")).lower() or "jobassam" in str(data.get("organization", "")).lower():
            data["organization"] = "Private Company"

        return data
        
    except Exception as e:
        print(f"AI Rewriting failed: {e}")
        return None
        
    finally:
        # ALWAYS Sleep for 5 seconds to prevent hitting the Gemini Free Tier limit
        import time
        time.sleep(5)
