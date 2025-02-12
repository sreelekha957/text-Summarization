from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

try:
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    summarizer = None

def chunk_text(text, chunk_size=500):
    """Splits text into smaller chunks within model limits."""
    words = text.split()
    return [" ".join(words[i:i + chunk_size]) for i in range(0, len(words), chunk_size)]

@app.route("/summarize", methods=["POST"])
def summarize():
    if not summarizer:
        return jsonify({"error": "Model failed to load"}), 500
    
    data = request.json
    if not data or "text" not in data:
        return jsonify({"error": "Invalid JSON format"}), 400
    
    text = data["text"].strip()
    if not text:
        return jsonify({"error": "No text provided"}), 400


    input_length = len(text.split())
    if input_length < 10:
        return jsonify({"summary": text, "note": "Text was too short for summarization."})  # Return original text if too short

    print(f"Received text: {input_length} words", flush=True)

    try:
        if input_length > 1024:  # BART max input size
            chunks = chunk_text(text, chunk_size=500)  # Break into smaller parts
            summaries = [summarizer(chunk, max_length=100, min_length=30, do_sample=False)[0]["summary_text"] for chunk in chunks]
            summary_text = " ".join(summaries)  # Combine summaries
        else:
            summary_text = summarizer(text, max_length=100, min_length=30, do_sample=False)[0]["summary_text"]

        return jsonify({"summary": summary_text})
    
    except Exception as e:
        import traceback
        print(traceback.format_exc(), flush=True)
        return jsonify({"error": f"Summarization failed: {e}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)   