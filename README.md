# 🤖 CareerSync AI – Job Recommendation Engine

An AI-powered system designed to provide personalized job recommendations by leveraging vector embeddings and a multi-factor scoring algorithm.



## 🌟 Features

* **Real-time Data Fetching:** Fetches current job postings via the **Adzuna API**.
* **Vector Embeddings:** Transforms job descriptions into numerical vectors using **SentenceTransformers** (`all-MiniLM-L6-v2`).
* **Fast Indexing & Search:** Uses **FAISS** (`faiss-cpu`) to create an efficient, searchable index for lightning-fast nearest-neighbor lookups.
* **RESTful API:** Exposes endpoints for data management and AI-powered recommendations.
* **Interactive Frontend:** A modern **React** application for users to input preferences and view tailored results.

---

## 1. ⚙️ Tech Stack

| Component | Technology | Details |
| :--- | :--- | :--- |
| **Backend** | Python, Flask | REST API server. |
| **Database** | SQLAlchemy, SQLite | Local persistent storage for job data (`jobs.db`). |
| **Embedding** | SentenceTransformers | **`all-MiniLM-L6-v2`** model for text embedding. |
| **Search Index** | FAISS | Efficient vector similarity search. |
| **Frontend** | React (Vite/CRA) | User interface running on `http://localhost:3000`. |

---

## 2. 📋 Prerequisites

* **Python** 3.9+
* **Node.js** 16+
* Git

---

## 3. ⬇️ Installation and Setup

### 3.1. Clone the Repository

```bash
git clone [https://github.com/Ruhan-Verse/job-recommendation-kgamify.git](https://github.com/Ruhan-Verse/job-recommendation-kgamify.git)
cd job-recommendation-kgamify
````

### 3.2. Backend Setup

From the repo root:

1.  **Create and Activate Virtual Environment:**

    ```bash
    cd backend
    python -m venv myenv
    # For Linux/macOS
    source myenv/bin/activate
    # For Windows PowerShell
    myenv\Scripts\Activate.ps1
    ```

2.  **Install Dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

### 3.3. Environment Variables

Create a file named **`.env`** in the **repo root** (`job-recommendation-kgamify/.env`) and add your Adzuna credentials:

```env
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
ADZUNA_BASE_URL=[https://api.adzuna.com/v1/api/jobs](https://api.adzuna.com/v1/api/jobs)
```

### 3.4. Initialize the Database

This creates the `jobs.db` file and the necessary tables.

From inside `backend/database/` with your virtual environment active:

```bash
cd backend/database
python init_db.py
```

You should see: `✅ Database initialized: jobs table created.`

### 3.5. Fetch Jobs & Build FAISS Index

This step populates the database and builds the vector index used for searching.

From the `backend/` folder with your virtual environment active:

```bash
cd .. # Back to backend/
python run_updater.py
```

This script will:

1.  Fetch job data from Adzuna (uses the `ADZUNA` keys from `.env`).
2.  Clear old jobs and insert new jobs into `jobs.db`.
3.  Build the FAISS index and save it as `backend/database/job_index.faiss`.

> ⚠️ **Note on Adzuna Credits:** The script is configured to fetch a controlled number of pages (approx. 1500 jobs by default). Check `jobs_controller.py` to adjust the `max_pages` limit if needed.

-----

## 4\. 🚀 Running the Application

### 4.1. Run the Backend API Server

From the `backend/` folder with your virtual environment active:

```bash
python app.py
```

The API server will run on: `http://localhost:5000`

### 4.2. Run the Frontend

In a **new terminal window** (from the repo root):

```bash
cd frontend
npm install
npm start
```

The React development server will open at: `http://localhost:3000`

Open this URL in your browser to start using the recommendation engine\!

-----

## 5\. 🌐 Backend Core Endpoints

The following endpoints are currently available on the running server (`http://localhost:5000`):

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/jobs/refresh` | Fetches new jobs, clears DB, inserts new data, and **rebuilds the FAISS index**. |
| `POST` | `/jobs/rebuild-index` | Rebuilds `job_index.faiss` only, using existing data in `jobs.db` (no re-fetch). |
| `GET` | `/jobs/search?q=query&k=10` | Simple **plain text** search against job titles/descriptions (debug). |
| `POST` | `/api/recommend` | **The main recommendation API.** Accepts structured user preferences. |

### Recommendation Endpoint Example

**`POST /api/recommend`**

**Request Body (`application/json`):**

```json
{
  "title": "Backend Developer",
  "skills": ["Python", "Django", "Postgres", "Redis"],
  "experience_years": 2,
  "preferred_stack": ["Docker"],
  "location": "Bangalore",
  "preferences": {
    "remote_only": false,
    "min_salary": 500000
  },
  "top_k": 5
}
```

-----

## 6\. 🚶 Typical Setup Flow (TL;DR)

1.  **Clone Repo:** `git clone https://github.com/Ruhan-Verse/job-recommendation-kgamify.git`
2.  **Backend Setup:** `cd backend`, create/activate `myenv`, `pip install ...`
3.  **Env File:** Create `.env` in repo root with Adzuna keys.
4.  **Init DB:** `cd backend/database`, `python init_db.py`
5.  **Fetch Data:** `cd backend`, `python run_updater.py`
6.  **Run Backend:** `python app.py`
7.  **Run Frontend:** `cd ../frontend`, `npm install`, `npm start`
8.  Open **`http://localhost:3000`** and search\!

<!-- end list -->

```
