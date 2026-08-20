from pydantic import BaseModel, Field
from typing import List, Optional
import json
import re

class ImportantDates(BaseModel):
    start_date: Optional[str] = Field(None, description="Start date in YYYY-MM-DD format")
    last_date: Optional[str] = Field(None, description="Last date in YYYY-MM-DD format")

class JobSchema(BaseModel):
    title: str = Field(..., description="Job title or notification subject")
    organization: str = Field(..., description="Hiring organization")
    job_type: str = Field(..., description="Government | Private | Exam Update")
    category: str = Field(..., description="Assam State | Central Govt | Local Private")
    vacancies: str = Field(..., description="Number of vacancies, e.g., '10' or 'Not Specified'")
    qualification: List[str] = Field(default_factory=list, description="List of required qualifications")
    district: str = Field(..., description="District, e.g., 'Kamrup', 'All Assam'")
    age_limit: str = Field(..., description="Age limit text")
    important_dates: ImportantDates
    official_pdf_url: Optional[str] = Field(None, description="URL to the official PDF notification")
    apply_url: Optional[str] = Field(None, description="URL to the application portal")
    status: str = Field(default="draft", description="draft | published")
    source_name: str = Field(..., description="Name of the source website, e.g., 'APSC'")
    hash: Optional[str] = Field(None, description="SHA-256 hash of the URL or PDF")

def simulate_ai_structuring(raw_text: str, source_url: str, pdf_url: str, title: str) -> str:
    """
    Simulates an LLM structuring the raw text into the required JSON schema.
    In a real production environment, this text would be sent to OpenAI/Claude API
    with the JobSchema definition to enforce structured JSON output.
    
    Here we use a rule-based simulation for the MVP.
    """
    # Simple regex fallbacks for demonstration
    vacancies = "Not Specified"
    v_match = re.search(r'(\d+)\s+(?:posts|vacancies)', raw_text, re.IGNORECASE)
    if v_match:
        vacancies = v_match.group(1)
        
    dates = ImportantDates(start_date=None, last_date=None)
    # This is highly simplified
    
    job = JobSchema(
        title=title,
        organization="Assam Public Service Commission (APSC)", # Defaulting based on scraper target
        job_type="Government",
        category="Assam State",
        vacancies=vacancies,
        qualification=["Degree from a recognized University"], # Mock inference
        district="All Assam",
        age_limit="21 to 38 years", # Mock inference
        important_dates=dates,
        official_pdf_url=pdf_url,
        apply_url=source_url,
        status="draft",
        source_name="APSC"
    )
    
    return job.model_dump_json(indent=2)
