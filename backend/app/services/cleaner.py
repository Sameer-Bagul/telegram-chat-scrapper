from email_validator import validate_email, EmailNotValidError
import phonenumbers
from typing import Dict, Any

def clean_job_post(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate and clean job post data.
    """
    cleaned = data.copy()

    # Validate and normalize email
    if cleaned.get('email'):
        try:
            valid = validate_email(cleaned['email'])
            cleaned['email'] = valid.email
        except EmailNotValidError:
            cleaned['email'] = None

    # Validate phone
    if cleaned.get('phone'):
        try:
            parsed = phonenumbers.parse(cleaned['phone'], None)
            if not phonenumbers.is_valid_number(parsed):
                cleaned['phone'] = None
            else:
                cleaned['phone'] = phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.INTERNATIONAL)
        except:
            cleaned['phone'] = None

    # Strip whitespace from strings
    for key, value in cleaned.items():
        if isinstance(value, str):
            cleaned[key] = value.strip()

    return cleaned