from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse, FileResponse
from ..controllers.job_controller import process_html_file
from ..services.exporter import export_to_csv
from ..services.excel_exporter import ExcelExporter
from typing import List
import io
import os
import tempfile
from datetime import datetime

router = APIRouter()

# In-memory storage for latest job posts (for simplicity)
latest_job_posts = []

@router.post("/upload", response_model=List[dict])
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith('.html'):
        raise HTTPException(status_code=400, detail="File must be an HTML file")
    
    content = await file.read()
    html_content = content.decode('utf-8')
    
    global latest_job_posts
    latest_job_posts = process_html_file(html_content)
    
    return [job.dict() for job in latest_job_posts]

@router.get("/download")
async def download_csv():
    global latest_job_posts
    if not latest_job_posts:
        raise HTTPException(status_code=404, detail="No data available for download")
    
    csv_content = export_to_csv([job.dict() for job in latest_job_posts])
    
    return StreamingResponse(
        io.StringIO(csv_content),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=job_posts.csv"}
    )

@router.get("/download/excel")
async def download_excel():
    """Download job data as Excel file with multiple sheets"""
    global latest_job_posts
    if not latest_job_posts:
        raise HTTPException(status_code=404, detail="No data available for download")
    
    exporter = ExcelExporter()
    
    # Create temporary file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    temp_dir = tempfile.gettempdir()
    filename = f"telegram_jobs_{timestamp}.xlsx"
    filepath = os.path.join(temp_dir, filename)
    
    try:
        # Create Excel file
        exporter.create_excel_file([job.dict() for job in latest_job_posts], filepath)
        
        # Return file
        return FileResponse(
            filepath,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
            filename=filename
        )
    except Exception as e:
        # Clean up temp file if it exists
        if os.path.exists(filepath):
            os.remove(filepath)
        raise HTTPException(status_code=500, detail=f"Failed to create Excel file: {str(e)}")

@router.get("/download/contacts")
async def download_contacts():
    """Download only contact information (emails and names) as Excel file"""
    global latest_job_posts
    if not latest_job_posts:
        raise HTTPException(status_code=404, detail="No data available for download")
    
    exporter = ExcelExporter()
    
    # Create temporary file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    temp_dir = tempfile.gettempdir()
    filename = f"telegram_contacts_{timestamp}.xlsx"
    filepath = os.path.join(temp_dir, filename)
    
    try:
        # Create contacts-only Excel file
        exporter.create_contacts_only_excel([job.dict() for job in latest_job_posts], filepath)
        
        # Return file
        return FileResponse(
            filepath,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
            filename=filename
        )
    except Exception as e:
        # Clean up temp file if it exists
        if os.path.exists(filepath):
            os.remove(filepath)
        raise HTTPException(status_code=500, detail=f"Failed to create contacts file: {str(e)}")

@router.get("/analyze/contacts")
async def analyze_contacts():
    """Analyze contact information in current job data"""
    global latest_job_posts
    if not latest_job_posts:
        raise HTTPException(status_code=404, detail="No data available for analysis")
    
    exporter = ExcelExporter()
    contact_info = exporter.extract_contact_info([job.dict() for job in latest_job_posts])
    
    # Create analysis summary
    total_jobs = len(latest_job_posts)
    jobs_with_contacts = len(set([c['Job_Index'] for c in contact_info]))
    total_emails = len([c for c in contact_info if c['Email']])
    total_names = len([c for c in contact_info if c['Name']])
    unique_emails = len(set([c['Email'] for c in contact_info if c['Email']]))
    unique_names = len(set([c['Name'] for c in contact_info if c['Name']]))
    
    return {
        "total_jobs": total_jobs,
        "jobs_with_contacts": jobs_with_contacts,
        "total_contacts_found": len(contact_info),
        "total_emails": total_emails,
        "total_names": total_names,
        "unique_emails": unique_emails,
        "unique_names": unique_names,
        "contact_extraction_rate": f"{(jobs_with_contacts/total_jobs)*100:.1f}%" if total_jobs > 0 else "0%",
        "sample_contacts": contact_info[:5]  # First 5 contacts as sample
    }