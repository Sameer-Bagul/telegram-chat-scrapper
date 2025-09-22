from ..services.parser import parse_html
from ..services.extractor import extract_job_info
from ..services.cleaner import clean_job_post
from ..models.job_post import JobPost
from typing import List

def process_html_file(html_content: str) -> List[JobPost]:
    """
    Process HTML content: parse, extract, clean, and return list of JobPost objects.
    """
    messages = parse_html(html_content)
    job_posts = []
    for msg in messages:
        raw_data = extract_job_info(msg)
        cleaned_data = clean_job_post(raw_data)
        job_post = JobPost(**cleaned_data)
        job_posts.append(job_post)
    return job_posts