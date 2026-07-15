# backend/services/embedding_service.py
import os
import faiss
import numpy as np
import math
import re
from sentence_transformers import SentenceTransformer
from database.db import SessionLocal
from database.models import Job
from datetime import datetime

# ----- config -------
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # backend/
INDEX_FILE = os.path.join(BASE_DIR, "database", "job_index.faiss")

# Load model once
model = SentenceTransformer("all-MiniLM-L6-v2")

# Expanded skill lookup with synonyms and variations
# Expanded skill lookup covering diverse professions
COMMON_SKILLS = {
    # IT/Tech Skills (existing)
    "python", "java", "javascript", "node", "nodejs", "react", "vue", "angular", 
    "django", "flask", "fastapi", "spring", "springboot", "spring boot",
    "sql", "postgres", "postgresql", "mysql", "mongodb", "redis", "oracle",
    "docker", "kubernetes", "k8s", "aws", "gcp", "azure", "cloud",
    "html", "css", "php", "c++", "c#", "go", "golang", "rust", "ruby", "laravel", "express",
    "rest", "restful", "graphql", "api", "microservices", "linux", "nginx", "jenkins", 
    "git", "ci/cd", "cicd", "devops",
    "machine learning", "ml", "ai", "tensorflow", "pytorch", "data science", "big data",
    "backend", "fullstack", "full stack", "server", "api development",
    
    # Medical/Healthcare
    "medicine", "medical", "healthcare", "patient care", "clinical", "nursing", 
    "doctor", "physician", "surgeon", "dentist", "pharmacy", "pharmacist",
    "registered nurse", "rn", "bsc nursing", "mbbs", "md", "ms", "dm", "mch",
    "anesthesia", "cardiology", "neurology", "orthopedics", "pediatrics", "gynecology",
    "radiology", "pathology", "dermatology", "psychiatry", "ophthalmology",
    "hospital", "healthcare", "medical officer", "resident", "intern",
    "surgery", "operation theatre", "ot", "icu", "emergency", "casualty",
    "medical coding", "medical billing", "health insurance", "usg", "ct scan", "mri",
    
    # Sales & Marketing
    "sales", "marketing", "business development", "bd", "account management",
    "client acquisition", "lead generation", "cold calling", "field sales",
    "inside sales", "territory sales", "channel sales", "partner management",
    "digital marketing", "social media", "seo", "sem", "ppc", "google ads",
    "facebook ads", "content marketing", "email marketing", "affiliate marketing",
    "brand management", "product marketing", "market research", "competitor analysis",
    "customer relationship", "crm", "salesforce", "hubspot", "zoho",
    "revenue generation", "target achievement", "key account", "enterprise sales",
    
    # HR & Recruitment
    "human resources", "hr", "recruitment", "talent acquisition", "hiring",
    "interviewing", "onboarding", "employee engagement", "performance management",
    "compensation", "benefits", "payroll", "hr policies", "labor laws",
    "training", "development", "learning", "succession planning", "hr analytics",
    "employee relations", "grievance handling", "attrition", "retention",
    "job posting", "sourcing", "screening", "background verification",
    "hrms", "workday", "successfactors", "people management",
    
    # Finance & Accounting
    "accounting", "finance", "chartered accountant", "ca", "cma", "cfa",
    "accounts payable", "accounts receivable", "general ledger", "reconciliation",
    "financial reporting", "audit", "taxation", "gst", "income tax", "tds",
    "financial analysis", "fp&a", "budgeting", "forecasting", "cost accounting",
    "investment banking", "equity research", "wealth management", "portfolio management",
    "risk management", "internal audit", "statutory audit", "company secretary",
    "tally", "sap fico", "quickbooks", "xero",
    
    # Operations & Supply Chain
    "operations", "supply chain", "logistics", "inventory", "warehouse",
    "procurement", "purchase", "vendor management", "sourcing",
    "supply chain management", "scm", "demand planning", "inventory control",
    "logistics management", "transportation", "shipping", "freight", "customs",
    "warehouse management", "wms", "order fulfillment", "last mile delivery",
    "six sigma", "lean", "process improvement", "quality control", "qc",
    "production", "manufacturing", "plant management", "maintenance",
    
    # Education & Teaching
    "teaching", "education", "faculty", "professor", "lecturer", "instructor",
    "teacher", "tutor", "trainer", "coach", "mentor", "counselor",
    "curriculum", "lesson planning", "classroom management", "student assessment",
    "academic", "research", "phd", "m.phil", "net", "set",
    "school", "college", "university", "institute", "coaching center",
    "subject matter expert", "sme", "instructional design", "e-learning",
    
    # Creative & Design
    "design", "graphic design", "ui", "ux", "user experience", "user interface",
    "photoshop", "illustrator", "figma", "sketch", "adobe creative suite",
    "web design", "mobile design", "logo design", "brand identity",
    "animation", "motion graphics", "video editing", "premiere pro", "after effects",
    "content writing", "copywriting", "technical writing", "proofreading",
    "social media management", "content creation", "blogging", "seo writing",
    
    # Management & Consulting
    "management", "consulting", "strategy", "business strategy", "management consulting",
    "project management", "program management", "delivery management",
    "product management", "product owner", "scrum master", "agile", "waterfall",
    "stakeholder management", "client management", "practice management",
    "business analysis", "requirement gathering", "process mapping",
    
    # Customer Service
    "customer service", "customer support", "technical support", "helpdesk",
    "call center", "bpo", "voice process", "non-voice", "chat support",
    "customer satisfaction", "ticket management", "issue resolution",
    "service desk", "itil", "incident management", "problem management",
    
    # Legal
    "law", "legal", "advocate", "lawyer", "attorney", "corporate law",
    "litigation", "court", "legal research", "contract drafting",
    "intellectual property", "ip", "trademark", "copyright", "patent",
    "compliance", "regulatory", "corporate governance",
    
    # Real Estate
    "real estate", "property", "realty", "broker", "agent", "realtor",
    "property management", "facility management", "commercial real estate",
    "residential", "plot", "land", "valuation", "appraisal",
    
    # Hospitality
    "hotel", "hospitality", "restaurant", "chef", "cook", "kitchen",
    "front office", "housekeeping", "food beverage", "f&b", "catering",
    "travel", "tourism", "tour guide", "travel agency",
    
    # Sports & Fitness
    "sports", "fitness", "coach", "trainer", "gym", "yoga", "pilates",
    "physical education", "pe", "athlete", "sports management",
    "nutrition", "dietitian", "weight management", "personal training",
    
    # Media & Entertainment
    "journalism", "reporter", "editor", "news", "media", "entertainment",
    "pr", "public relations", "corporate communication", "event management",
    "radio", "television", "film", "cinema", "production",
    
    # Other Professional Skills
    "analysis", "analytics", "research", "development", "management",
    "administration", "coordination", "planning", "strategy", "leadership",
    "team management", "project delivery", "client servicing", "problem solving"
}
# normalize skill tokens
COMMON_SKILLS = set([s.lower() for s in COMMON_SKILLS])

# Skill synonyms mapping
SKILL_SYNONYMS = {
    "nodejs": "node",
    "postgresql": "postgres", 
    "golang": "go",
    "springboot": "spring",
    "spring boot": "spring",
    "cicd": "ci/cd",
    "restful": "rest"
}

# ---------- helper functions ----------
def normalize_text(s):
    return (s or "").lower()

def extract_skills_from_text(text):
    """
    Aggressive skill extraction from any text field.
    """
    if not text:
        return []
    text_l = normalize_text(text)
    found = set()
    
    # First, try direct word boundary matches
    for skill in COMMON_SKILLS:
        if re.search(r'\b' + re.escape(skill) + r'\b', text_l):
            # Normalize the skill (use base form)
            normalized_skill = SKILL_SYNONYMS.get(skill, skill)
            found.add(normalized_skill)
    
    # Also check for skills without word boundaries (for cases like "Python/Django")
    for skill in COMMON_SKILLS:
        if skill in text_l and len(skill) > 2:  # Avoid matching single letters
            normalized_skill = SKILL_SYNONYMS.get(skill, skill)
            found.add(normalized_skill)
    
    return list(found)

# -------- BUILD JOB INDEX --------
def build_job_index():
    """
    Fetch all jobs from DB, create embeddings, and store FAISS index.
    """
    session = SessionLocal()
    jobs = session.query(Job).all()
    session.close()

    if not jobs:
        print("⚠️ No jobs found in DB to index.")
        return

    print(f"🔄 Building embeddings for {len(jobs)} jobs...")

    # Combine title, company, location, and category
    texts = [f"{job.title} {job.company or ''} {job.location or ''} {job.category or ''}" for job in jobs]
    embeddings = model.encode(texts, convert_to_numpy=True)

    d = embeddings.shape[1]  # embedding dimension
    index = faiss.IndexFlatL2(d)
    index.add(embeddings)

    faiss.write_index(index, INDEX_FILE)
    print(f"✅ FAISS index built & saved at {INDEX_FILE}")


def build_index(profile: dict):
    """
    Build an emphasized text for embedding the user profile.
    Skills are heavily emphasized for better matching.
    """
    parts = []
    
    # Skills: repeat each skill multiple times to heavily emphasize
    skills = profile.get("skills", [])
    if skills:
        # Repeat each skill individually for maximum emphasis
        for skill in skills:
            parts.extend([skill.lower()] * 8)  # Each skill repeated 8 times
    
    # title - also important but less than skills
    if profile.get("title"):
        parts.append(profile["title"])
        # Repeat title 2 times for moderate emphasis
        parts.extend([profile["title"]] * 2)
    
    # preferred stack
    pref = profile.get("preferred_stack", [])
    if pref:
        parts.extend(pref)
        parts.extend(pref * 2)  # Repeat preferred stack
    
    # interests
    if profile.get("interests"):
        parts.extend(profile["interests"])
    
    # experience
    if profile.get("experience_years") is not None:
        parts.append(f"{profile['experience_years']} years experience")
    
    # location (minimal emphasis in embedding)
    if profile.get("location"):
        parts.append(profile["location"])
    
    return " ".join(parts).strip()

def l2_to_sim(l2_dist):
    return 1.0 / (1.0 + float(l2_dist))

def calculate_skill_match(user_skills, job_skills):
    """
    Calculate skill match score with bonuses for exact matches.
    """
    if not user_skills or not job_skills:
        return 0.0
    
    user_skills_set = set(user_skills)
    job_skills_set = set(job_skills)
    
    # Exact matches
    exact_matches = len(user_skills_set.intersection(job_skills_set))
    
    # Also check for partial matches (skills contained within other skills)
    partial_matches = 0
    for user_skill in user_skills_set:
        for job_skill in job_skills_set:
            if user_skill in job_skill or job_skill in user_skill:
                partial_matches += 0.3  # Partial match bonus
    
    total_matches = exact_matches + partial_matches
    base_score = total_matches / max(len(user_skills_set), 1)
    
    # MAJOR Bonus for high match ratio
    if base_score > 0.7:
        base_score = min(1.0, base_score * 1.5)  # 50% boost for excellent matches
    elif base_score > 0.4:
        base_score = min(1.0, base_score * 1.3)  # 30% boost for good matches
    elif base_score > 0.2:
        base_score = min(1.0, base_score * 1.2)  # 20% boost for some matches
    
    return base_score

# ---------- main search with reranking ----------
def search_jobs(profile: dict, top_k: int = 10, fetch_candidates: int = 100):
    """
    Skill-first search with minimal emphasis on salary and recency.
    """
    # 1) prepare query text and embedding
    if isinstance(profile, str):
        query_text = profile
    else:
        query_text = build_index(profile)

    if not os.path.exists(INDEX_FILE):
        return {"error": "Index not built. POST /jobs/rebuild-index first."}

    # encode
    q_vec = model.encode([query_text], convert_to_numpy=True)

    # load index and get candidates
    index = faiss.read_index(INDEX_FILE)

    # ensure fetch_candidates <= index.ntotal
    K = min(fetch_candidates, max(1, index.ntotal))
    D, I = index.search(q_vec, K)

    # fetch jobs from DB in the same order used to build the index
    session = SessionLocal()
    jobs = session.query(Job).all()
    session.close()

    # Keep mapping for indices: index position -> job
    candidates = []
    for pos, dist in zip(I[0], D[0]):
        if pos < 0 or pos >= len(jobs):
            continue
        job = jobs[pos]
        emb_sim = l2_to_sim(dist)
        candidates.append((job, emb_sim))

    # 2) compute reranking signals - SKILLS FIRST approach
    user_skills = [s.lower() for s in (profile.get("skills") or [])]
    user_location = normalize_text(profile.get("location") or "")
    user_min_salary = profile.get("preferences", {}).get("min_salary")
    user_title = normalize_text(profile.get("title") or "")

    scored = []

    for job, emb_sim in candidates:
        job_title = normalize_text(job.title or "")
        
        # AGGRESSIVE SKILL EXTRACTION FROM MULTIPLE FIELDS
        job_skills = []
        
        # Extract from title (most important for skill matching)
        title_skills = extract_skills_from_text(job.title or "")
        job_skills.extend(title_skills)
        
        # Extract from company name (sometimes indicates tech stack)
        company_skills = extract_skills_from_text(job.company or "")
        job_skills.extend(company_skills)
        
        # Extract from category
        category_skills = extract_skills_from_text(job.category or "")
        job_skills.extend(category_skills)
        
        # Extract from description if available
        if hasattr(job, 'description') and job.description:
            desc_skills = extract_skills_from_text(job.description)
            job_skills.extend(desc_skills)
        
        # Remove duplicates
        job_skills = list(set(job_skills))
        
        # Calculate skill match with enhanced scoring
        skill_score = calculate_skill_match(user_skills, job_skills)

        # TITLE MATCH - Check if job title matches user's desired role
        title_score = 0.0
        if user_title and job_title:
            user_title_words = set(user_title.split())
            job_title_words = set(job_title.split())
            title_overlap = len(user_title_words.intersection(job_title_words))
            title_score = title_overlap / max(len(user_title_words), 1)
            
            # Major boost for developer roles matching user title
            developer_keywords = ['developer', 'engineer', 'programmer', 'software']
            if any(role in job_title for role in developer_keywords):
                if any(role in user_title for role in developer_keywords):
                    title_score = max(title_score, 0.9)
            
            # Exact or partial title match
            if user_title in job_title or job_title in user_title:
                title_score = 1.0

        # LOCATION SCORE - Moderate importance
        loc_score = 0.0
        job_loc = normalize_text(job.location or "")
        if user_location:
            if user_location in job_loc or job_loc in user_location:
                loc_score = 1.0
            else:
                user_loc_words = set(user_location.split())
                job_loc_words = set(job_loc.split())
                if user_loc_words.intersection(job_loc_words):
                    loc_score = 0.7  # Higher partial match score

        # SALARY SCORE - Minimal importance
        salary_score = 0.0
        if user_min_salary:
            job_sal = job.salary_max or job.salary_min or 0
            if job_sal >= user_min_salary:
                salary_score = 0.3  # Small bonus for meeting salary requirement
            else:
                salary_score = 0.0
        else:
            salary_score = 0.1  # Tiny baseline if no salary preference

        # RECENCY SCORE - Minimal importance (since all jobs are active)
        recency_score = 0.1  # Small constant value since recency doesn't matter much

        # FINAL WEIGHTED SCORE - SKILLS ARE KING
        final_score = (
            0.20 * emb_sim +      # Reduced emphasis on pure embedding
            0.55 * skill_score +   # HIGHEST priority - skills (increased from 0.45)
            0.15 * title_score +   # Title relevance
            0.08 * loc_score +     # Location
            0.01 * salary_score +  # Minimal salary importance (reduced from 0.04)
            0.01 * recency_score   # Minimal recency importance (reduced from 0.03)
        )

        # MAJOR BOOSTS for skill matches - SKILLS DOMINATE
        if skill_score > 0.8:  # Excellent skill match (80%+ skills matched)
            final_score *= 1.6  # 60% boost
        elif skill_score > 0.6:  # Very good skill match
            final_score *= 1.4  # 40% boost  
        elif skill_score > 0.4:  # Good skill match
            final_score *= 1.3  # 30% boost
        elif skill_score > 0.2:  # Some skill match
            final_score *= 1.2  # 20% boost

        # Additional boost for perfect title match with good skills
        if title_score > 0.8 and skill_score > 0.3:
            final_score *= 1.2  # 20% boost

        # Ensure score doesn't exceed 1.0
        final_score = min(1.0, final_score)

        scored.append((job, final_score, {
            "emb_sim": emb_sim,
            "skill_score": skill_score,
            "job_skills_found": job_skills,  # Debug: see what skills were detected
            "title_score": title_score,
            "loc_score": loc_score,
            "salary_score": salary_score,
            "recency_score": recency_score
        }))

    # 3) Sort and take top_k
    scored.sort(key=lambda x: x[1], reverse=True)
    top = scored[:top_k]

    # 4) Return formatted results
    results = []
    for job, score, signals in top:
        results.append({
            "id": job.id,
            "title": job.title,
            "company": job.company,
            "location": job.location,
            "category": job.category,
            "salary_min": job.salary_min,
            "salary_max": job.salary_max,
            "url": job.url,
            "score": float(score),
            "signals": signals
        })
    return results