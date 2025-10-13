import os
import sys
import unittest
import random
from unittest.mock import patch, Mock
import requests  # Importing requests module to resolve "not defined" error

# Add the parent directory to the path so we can import the app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from core.cyphermorph_server import app

class TestCyphermorphServer(unittest.TestCase):

    def setUp(self):
        app.testing = True
        self.app = app.test_client()

    def test_healthz(self):
        response = self.app.get('/healthz')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, b'OK')

    def test_index(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)

    @patch('core.cyphermorph_server.requests.get')
    def test_api_generate_random_demonstration(self, mock_get):
        """
        This test randomly demonstrates either a successful API call
        or a failed one to ensure both paths are working.
        """
        if random.choice([True, False]):
            # --- Simulate SUCCESS ---
            print("\nDEMO: Simulating a SUCCESSFUL API call...")
            mock_response = Mock()
            mock_response.raise_for_status = Mock()
            mock_response.json.return_value = {
                "content": "The only true wisdom is in knowing you know nothing.",
                "tags": ["Wisdom"]
            }
            mock_get.return_value = mock_response

            response = self.app.get('/api/generate')
            self.assertEqual(response.status_code, 200)
            data = response.get_json()
            self.assertEqual(data['title'], "Sermon on 'Wisdom'")
            self.assertEqual(data['content'], "The only true wisdom is in knowing you know nothing.")
            print("DEMO: Verified successful response.")

        else:
            # --- Simulate FAILURE ---
            print("\nDEMO: Simulating a FAILED API call (e.g., SSL Error)...")
            mock_get.side_effect = requests.exceptions.RequestException("Simulated network error")

            response = self.app.get('/api/generate')
            self.assertEqual(response.status_code, 200)
            data = response.get_json()
            self.assertEqual(data['title'], "Error")
            self.assertEqual(data['content'], "Could not retrieve sermon content at this time.")
            print("DEMO: Verified error handling response.")

if __name__ == '__main__':
    unittest.main()
