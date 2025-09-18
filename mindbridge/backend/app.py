from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow frontend to connect

# Load AI sentiment analysis model (pre-trained on emotions)
sentiment_analyzer = pipeline("sentiment-analysis")

# In-memory storage for demo (later you can connect SQLite/Postgres)
posts = []


@app.route("/")
def home():
    return jsonify({"message": "MindBridge Backend is running!"})


@app.route("/analyze", methods=["POST"])
def analyze_mood():
    """Analyze student's journal entry and return mood + suggestion"""
    data = request.get_json()
    text = data.get("text", "")

    if not text.strip():
        return jsonify({"error": "Text cannot be empty"}), 400

    # AI mood detection
    result = sentiment_analyzer(text)[0]
    mood = result["label"]
    score = result["score"]

    # Generate basic suggestions (can be improved later)
    suggestions = {
        "POSITIVE": "Keep up the good vibes! Stay consistent 💪",
        "NEGATIVE": "Looks like you’re stressed. Try a 2-min breathing exercise 🌿",
        "NEUTRAL": "Stay balanced. Maybe write down 3 things you’re grateful for ✨"
    }
    suggestion = suggestions.get(mood.upper(), "Take a short break and relax ☕")

    return jsonify({
        "mood": mood,
        "confidence": round(score, 2),
        "suggestion": suggestion
    })


@app.route("/posts", methods=["GET", "POST"])
def community_posts():
    """Anonymous peer support posts"""
    if request.method == "POST":
        data = request.get_json()
        post_text = data.get("text", "")

        if not post_text.strip():
            return jsonify({"error": "Post cannot be empty"}), 400

        post = {"id": len(posts) + 1, "text": post_text}
        posts.append(post)
        return jsonify({"message": "Post added successfully", "post": post})

    # GET request → return all posts
    return jsonify(posts)


if __name__ == "__main__":
    app.run(debug=True)
