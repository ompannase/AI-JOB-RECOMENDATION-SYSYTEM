# backend/api/recommendation_controller.py
from flask import Blueprint, request, jsonify
from services.embedding_service import search_jobs

recommend_bp = Blueprint("recommend", __name__)

@recommend_bp.route("/recommend", methods=["POST"])
def recommend():
    payload = request.get_json(silent=True)
    if not payload:
        return jsonify({"error": "JSON body required"}), 400

    top_k = int(payload.get("top_k", 10))
    # Accept either a string "profile" or structured profile fields
    if "profile" in payload and isinstance(payload["profile"], str) and len(payload) == 1:
        # simple text query
        profile = payload["profile"]
    else:
        # structured profile expected
        profile = {
            "title": payload.get("title"),
            "skills": payload.get("skills", []),
            "experience_years": payload.get("experience_years"),
            "preferred_stack": payload.get("preferred_stack", []),
            "interests": payload.get("interests", []),
            "location": payload.get("location"),
            "preferences": payload.get("preferences", {})
        }

    results = search_jobs(profile, top_k=top_k)
    return jsonify({"recommendations": results}), 200
