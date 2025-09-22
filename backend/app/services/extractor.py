import re
import phonenumbers
from typing import Dict, Optional

def extract_job_info(text: str) -> Dict[str, Optional[str]]:
    """
    Extract job-related information from message text using regex and heuristics.
    """
    # Email extraction
    email_match = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
    email = email_match.group(0) if email_match else None

    # Phone extraction
    phone_match = re.search(r'\+?\d[\d\s\-\(\)]{8,}\d', text)
    phone = phone_match.group(0) if phone_match else None
    if phone:
        try:
            parsed = phonenumbers.parse(phone, None)
            phone = phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.INTERNATIONAL)
        except:
            pass

    # Link extraction
    link_match = re.search(r'https?://[^\s]+', text)
    link = link_match.group(0) if link_match else None

    # Job title (basic heuristic)
    title_match = re.search(r'(?i)job\s*title\s*[:\-]?\s*([^\n\r]+)', text)
    job_title = title_match.group(1).strip() if title_match else None

    # Company
    company_match = re.search(r'(?i)company\s*[:\-]?\s*([^\n\r]+)', text)
    company = company_match.group(1).strip() if company_match else None

    # Location
    location_match = re.search(r'(?i)location\s*[:\-]?\s*([^\n\r]+)', text)
    location = location_match.group(1).strip() if location_match else None

    # Date of posting
    date_match = re.search(r'\b\d{4}-\d{2}-\d{2}\b', text)
    date_of_posting = date_match.group(0) if date_match else None

    # Job description (full text)
    job_description = text

    return {
        'name': None,
        'email': email,
        'phone': phone,
        'job_title': job_title,
        'company': company,
        'location': location,
        'date_of_posting': date_of_posting,
        'job_description': job_description,
        'link': link,
        'notes': ''
    }