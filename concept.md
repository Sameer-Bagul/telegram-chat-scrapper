# 📌 Ultimate Project Plan: Telegram Job Post Extractor

## **1. High-Level Overview**

* **Frontend (UI)** → Vite + React (file upload, preview, download CSV).
* **Backend (API)** → Python (FastAPI or Flask) with MVC architecture:

  * **Model** → Data structures (Job Post schema).
  * **View** → API responses (JSON/CSV).
  * **Controller** → Orchestrates parsing, extraction, and cleaning.
* **Data Processing Layer** → Python libraries for parsing HTML, extracting structured job details.
* **Storage** → Optional (CSV only or extend to DB like PostgreSQL/SQLite).

---

## **2. Tech Stack**

### **Frontend**

* **Vite + React (TypeScript)**
* UI Components: TailwindCSS / Material UI
* Features:

  * Upload `.html` file
  * Display parsed job data preview
  * Download as `.csv`

### **Backend (Python)**

* **Framework**: FastAPI (best for APIs, async, clean structure)
* **Libraries**:

  * `beautifulsoup4 + lxml` → Parse Telegram HTML
  * `re` → Regex for emails, links, phone
  * `phonenumbers` → Validate phone numbers
  * `email-validator` → Validate emails
  * `pandas` → Data structuring
  * `dateutil` → Date parsing
  * *(Optional)* `spaCy` → Extract job titles, company, location

---

## **3. Backend Architecture (MVC)**

```
backend/
│── app/
│   ├── models/               # Data schemas
│   │   ├── job_post.py       # JobPost schema (Pydantic)
│   │
│   ├── views/                # API layer
│   │   ├── job_routes.py     # Endpoints (upload, download)
│   │
│   ├── controllers/          # Business logic
│   │   ├── job_controller.py # Parsing + extraction logic
│   │
│   ├── services/             # Utility modules
│   │   ├── parser.py         # HTML parser
│   │   ├── extractor.py      # Regex/NLP extractors
│   │   ├── cleaner.py        # Validation & formatting
│   │   ├── exporter.py       # CSV export
│   │
│   ├── main.py               # FastAPI entrypoint
│
│── requirements.txt
```

---

## **4. Frontend Architecture**

```
frontend/
│── src/
│   ├── components/
│   │   ├── FileUpload.tsx      # Upload button
│   │   ├── JobTable.tsx        # Preview table
│   │   ├── DownloadButton.tsx  # Download CSV
│   │
│   ├── pages/
│   │   ├── Home.tsx            # Main UI
│   │
│   ├── services/
│   │   ├── api.ts              # Axios API calls to backend
│   │
│   ├── App.tsx
│── vite.config.ts
```

---

## **5. Workflow**

### **Frontend Flow**

1. User opens the website (Vite app).
2. Uploads Telegram HTML export.
3. File is sent via **POST /upload** API to backend.
4. Backend parses, extracts, cleans data.
5. Frontend displays **preview table** of extracted jobs.
6. User clicks "Download CSV" → triggers **GET /download** API.

### **Backend Flow**

1. **Upload Handler** receives HTML file.
2. **Controller** calls parser + extractor.
3. **Extractor** finds emails, phone numbers, job titles, company, etc.
4. **Cleaner** validates & normalizes data.
5. **Model** (JobPost) structures it.
6. **Exporter** saves as CSV in memory.
7. **API Response** → JSON (for preview) + CSV (for download).

---

## **6. API Endpoints**

### **POST /upload**

* Input: HTML file (multipart form).
* Output: JSON array of job postings.

```json
[
  {
    "name": "John Doe",
    "email": "hr@example.com",
    "phone": "+1-202-555-0123",
    "job_title": "Software Engineer",
    "company": "TechCorp",
    "location": "New York",
    "date_of_posting": "2025-09-20",
    "job_description": "Looking for Python developers...",
    "link": "https://example.com/job123",
    "notes": ""
  }
]
```

### **GET /download**

* Returns: CSV file of the latest parsed job postings.

---

## **7. Project Roadmap**

### **Phase 1: Backend Core**

* Implement **HTML parsing + extraction**.
* Return **JSON response** for preview.
* Save **CSV locally**.

### **Phase 2: Frontend Integration**

* Build Vite frontend.
* File upload + API call.
* Display parsed results in table.

### **Phase 3: CSV Download**

* Add backend CSV download endpoint.
* Frontend "Download CSV" button.

### **Phase 4: Advanced Features**

* NLP-based job title, company, and location extraction.
* Duplicate removal.
* Store history in a database (optional).

---

## **8. Deployment**

* **Backend** → Dockerized FastAPI app (host on AWS/GCP/Heroku).
* **Frontend** → Build Vite app → Deploy on Vercel/Netlify.
* **CORS** → Enable communication between frontend & backend.

---

🔥 With this setup, you’ll have:

* A clean **MVC Python backend**.
* A modern **Vite + React frontend**.
* Upload → Preview → Download CSV workflow.
* Scalable foundation for NLP/DB in future.

---

👉 Do you want me to **first draft the backend MVC skeleton** (folders, FastAPI endpoints, basic parser), or the **frontend Vite structure with API hooks**?
