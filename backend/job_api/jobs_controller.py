from flask import Blueprint, request, jsonify
from job_api.adzuna_client import AdzunaClient
from database.db import SessionLocal
from database.models import Job
from sqlalchemy.exc import IntegrityError
from services.embedding_service import build_job_index, search_jobs   # <-- adjust import if needed

# ✅ Define Blueprint
jobs_bp = Blueprint("jobs", __name__)

# ----------------- Data Ingestion -----------------
def save_jobs_to_db(jobs):
    session = SessionLocal()
    inserted = 0

    for job in jobs:
        db_job = Job(
            adzuna_id=job.get("id"),
            title=job.get("title"),
            company=job.get("company", {}).get("display_name"),
            location=job.get("location", {}).get("display_name"),
            category=job.get("category", {}).get("label"),
            salary_min=job.get("salary_min"),
            salary_max=job.get("salary_max"),
            contract_type=job.get("contract_type"),
            url=job.get("redirect_url"),
        )
        try:
            session.add(db_job)
            session.commit()
            inserted += 1
        except IntegrityError:
            session.rollback()
    session.close()
    print(f"✅ {inserted} new jobs inserted into DB.")

def update_job_dataset():
    client_in = AdzunaClient(country="in")   # India
    client_us = AdzunaClient(country="us")   # Remote jobs

    india_jobs = client_in.fetch_all_jobs(max_pages=30)
    us_jobs = client_us.fetch_all_jobs(max_pages=0, remote="true")

    combined = india_jobs + us_jobs
    print(f"🎯 Total jobs fetched: {len(combined)}")

    # ✅ Clear old jobs first
    session = SessionLocal()
    deleted_count = session.query(Job).delete()
    session.commit()
    session.close()
    print(f"🗑️ Cleared {deleted_count} old jobs from DB.")

    # ✅ Insert new jobs
    save_jobs_to_db(combined)

    # 🔥 Auto-build index after inserting jobs
    build_job_index()

    return combined

# ----------------- API Routes -----------------
@jobs_bp.route("/rebuild-index", methods=["POST"])
def rebuild_job_index():
    build_job_index()
    return jsonify({"message": "Index rebuilt successfully"}), 200

@jobs_bp.route("/search", methods=["GET"])
def search():
    query = request.args.get("q")
    top_k = int(request.args.get("k", 10))
    if not query:
        return jsonify({"error": "Missing query param 'q'"}), 400

    results = search_jobs(query, top_k)
    return jsonify(results), 200

@jobs_bp.route("/refresh", methods=["POST"])
def refresh_jobs():
    """
    Admin endpoint: fetch fresh jobs from Adzuna,
    clear old jobs, insert new ones, rebuild FAISS index.
    """
    combined = update_job_dataset()
    return jsonify({
        "message": "Jobs refreshed and index rebuilt.",
        "total_jobs_fetched": len(combined)
    }), 200