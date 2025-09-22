from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from ..controllers.job_controller import process_html_file
from ..services.exporter import export_to_csv
from typing import List
import io

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