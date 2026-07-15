from flask import Flask
from flask_cors import CORS  # ✅ import CORS
from job_api.jobs_controller import jobs_bp
from api.recommendation_controller import recommend_bp

def create_app():
    app = Flask(__name__)

    # ✅ Allow CORS for your React frontend
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"},
                         r"/jobs/*": {"origins": "http://localhost:3000"}})

    # Register blueprints
    app.register_blueprint(jobs_bp, url_prefix="/jobs")
    app.register_blueprint(recommend_bp, url_prefix="/api")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
