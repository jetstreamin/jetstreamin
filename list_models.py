import google.generativeai as genai
import os
import subprocess

try:
    api_key = subprocess.check_output(['gcloud', 'secrets', 'versions', 'access', 'latest', '--secret=google-ai-api-key', '--project=gen-lang-client-0854112426']).decode('utf-8').strip()
    os.environ['GOOGLE_API_KEY'] = api_key
except Exception as e:
    print(f"Could not get API key from gcloud: {e}")

if not os.environ.get('GOOGLE_API_KEY'):
    print("GOOGLE_API_KEY not set and could not be retrieved from gcloud.")
else:
    print("Available models:")
    for m in genai.list_models():
      if 'generateContent' in m.supported_generation_methods:
        print(m.name)
