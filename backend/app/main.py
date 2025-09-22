from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .views.job_routes import router as job_router

app = FastAPI(title="Telegram Job Post Extractor")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(job_router, prefix="/api", tags=["jobs"])

@app.get("/")
async def root():
    return {"message": "Telegram Job Post Extractor API"}