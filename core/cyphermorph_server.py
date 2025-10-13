import os
import logging
from flask import Flask, render_template, jsonify
import google.generativeai as genai

# Initialize Flask App
app = Flask(__name__, template_folder='../templates')

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s [CYPHERMORPH] %(message)s')
logger = logging.getLogger('cyphermorph_server')

# The google-generativeai library automatically looks for the GOOGLE_API_KEY 
# environment variable. We are relying on this behavior.
if not os.environ.get("GOOGLE_API_KEY"):
    logger.warning("GOOGLE_API_KEY environment variable not set. The AI generation endpoint will fail.")
else:
    logger.info("GOOGLE_API_KEY is set. The google-generativeai library will use it automatically.")

@app.route('/healthz')
def healthz():
    """Health check endpoint for Kubernetes."""
    return "OK", 200

@app.route('/')
def index():
    """Renders the main sermon studio interface."""
    logger.info("Request for main studio page.")
    return render_template('index.html')

@app.route('/api/generate', methods=["GET"])
def generate_sermon():
    """Generates sermon content using Google's Generative AI."""
    if not os.environ.get("GOOGLE_API_KEY"):
        return jsonify({"title": "Configuration Error", "content": "AI API key is not configured on the server."}), 500

    try:
        # Correctly initialize the model
        model = genai.GenerativeModel('gemini-1.0-pro-latest')
        prompt = "Write a short, inspiring sermon about the intersection of technology and spirituality, in the style of a modern-day digital prophet."
        response = model.generate_content(prompt)
        
        sermon = {
            "title": "A Sermon on Digital Divinity",
            "content": response.text
        }
    except Exception as e:
        logger.error(f"Error generating sermon content: {e}")
        sermon = {
            "title": "Generation Error",
            "content": f"Could not generate sermon content at this time. Error: {e}"
        }
    return jsonify(sermon)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
