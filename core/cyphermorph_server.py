import os
import logging
from flask import Flask, render_template, jsonify
import google.generativeai as genai

# Initialize Flask App
app = Flask(__name__, template_folder='../templates')

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s [CYPHERMORPH] %(message)s')

# Create a specific logger for the application
logger = logging.getLogger('cyphermorph_server')

# Configure Generative AI
# The API key is expected to be set as an environment variable in the deployment
try:
    api_key = os.environ.get("GOOGLE_AI_API_KEY")
    if api_key:
        genai.configure(api_key=api_key)
        logging.info("Google Generative AI configured successfully.")
    else:
        logging.warning("GOOGLE_AI_API_KEY environment variable not set. The AI generation endpoint will fail.")
except Exception as e:
    logging.error(f"Error configuring Google Generative AI: {e}")

@app.route('/healthz')
def healthz():
    """Health check endpoint for Kubernetes."""
    return "OK", 200

@app.route('/')
def index():
    """Renders the main sermon studio interface."""
    logging.info("Request for main studio page.")
    return render_template('index.html')

@app.route('/api/generate', methods=["GET"])
def generate_sermon():
    """Generates sermon content using Google's Generative AI."""
    if "GOOGLE_AI_API_KEY" not in os.environ:
        return jsonify({"title": "Configuration Error", "content": "AI API key is not configured on the server."}), 500

    try:
        model = genai.GenerativeModel('gemini-pro')
        prompt = "Write a short, inspiring sermon about the intersection of technology and spirituality, in the style of a modern-day digital prophet."
        response = model.generate_content(prompt)
        
        sermon = {
            "title": "A Sermon on Digital Divinity",
            "content": response.text
        }
    except Exception as e:
        logging.error(f"Error generating sermon content: {e}")
        sermon = {
            "title": "Generation Error",
            "content": f"Could not generate sermon content at this time. Error: {e}"
        }
    return jsonify(sermon)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
