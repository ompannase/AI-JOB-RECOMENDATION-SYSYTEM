# backend/api/adzuna_client.py
import os
import requests
import json
import time
from utils.config import ADZUNA_APP_ID, ADZUNA_APP_KEY, ADZUNA_BASE_URL

class AdzunaClient:
    def __init__(self, country="in"):
        self.country = country

    def fetch_all_jobs(self, max_pages=20, results_per_page=50, what=None, where=None, remote=None, delay=1):
        """
        Fetch ALL jobs from Adzuna (with pagination).
        - max_pages: safety limit to avoid infinite loop (default=20)
        - results_per_page: max 50 per request
        - what, where, remote: filters
        - delay: seconds to wait between requests (avoid rate limits)
        """
        all_jobs = []
        for page in range(1, max_pages + 1):
            url = f"{ADZUNA_BASE_URL}/{self.country}/search/{page}"
            params = {
                "app_id": ADZUNA_APP_ID,
                "app_key": ADZUNA_APP_KEY,
                "results_per_page": results_per_page,
                "content-type": "application/json",
            }

            if what:
                params["what"] = what
            if where:
                params["where"] = where
            if remote:
                params["remote"] = remote

            try:
                response = requests.get(url, params=params)
                response.raise_for_status()
                data = response.json()
                results = data.get("results", [])

                if not results:
                    print(f"No more results found at page {page}. Stopping.")
                    break

                all_jobs.extend(results)
                print(f"✅ Page {page} fetched, total jobs: {len(all_jobs)}")

                time.sleep(delay)  # Avoid rate limiting

            except requests.exceptions.RequestException as e:
                print(f"Error fetching page {page}: {e}")
                break

        # Save all jobs into jobs.json
        DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
        os.makedirs(DATA_DIR, exist_ok=True)  # auto-create folder
        with open(os.path.join(DATA_DIR, "jobs.json"), "w", encoding="utf-8") as f:
            json.dump(all_jobs, f, indent=4, ensure_ascii=False)

        return all_jobs
