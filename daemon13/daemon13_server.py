# daemon13_server.py
# This service is the central execution core, orchestrating the other services.

from flask import Flask, request, jsonify
import os
import requests

app = Flask(__name__)

CYPHERMORPH_URL = "http://cyphermorph-service/api/generate"
WANITA_URL = "http://wanita-service/api/generate_cinematic"

@app.route('/api/execute_pipeline', methods=['POST'])
def execute_pipeline():
    try:
        # 1. Call Cyphermorph to generate a sermon
        cyphermorph_response = requests.get(CYPHERMORPH_URL)
        cyphermorph_response.raise_for_status()
        sermon_data = cyphermorph_response.json()
        sermon_text = sermon_data.get('sermon')

        if not sermon_text:
            return jsonify({"error": "Failed to get sermon from Cyphermorph"}), 500

        # 2. Call Wanita to generate the cinematic
        wanita_response = requests.post(WANITA_URL, json={"sermon": sermon_text})
        wanita_response.raise_for_status()
        cinematic_data = wanita_response.json()

        return jsonify({
            "status": "pipeline executed successfully",
            "sermon_generation": sermon_data,
            "cinematic_generation": cinematic_data
        })

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Pipeline failed: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
