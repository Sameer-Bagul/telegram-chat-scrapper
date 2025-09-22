from pydantic import BaseModel
from typing import Optional

class JobPost(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    job_title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    date_of_posting: Optional[str] = None
    job_description: Optional[str] = None
    link: Optional[str] = None
    notes: Optional[str] = None