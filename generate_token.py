import os
import google_auth_oauthlib.flow
import googleapiclient.discovery
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

# --- Configuration ---
CLIENT_SECRETS_FILE = "client_secret.json"
TOKEN_FILE = "youtube_token.json"
SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]
API_SERVICE_NAME = "youtube"
API_VERSION = "v3"

def get_credentials():
    """
    Authenticates the user and returns credentials.
    Handles the OAuth 2.0 flow, including token refresh.
    """
    creds = None
    # The file youtube_token.json stores the user's access and refresh tokens.
    if os.path.exists(TOKEN_FILE):
        print(f"Found existing token file: {TOKEN_FILE}")
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("Credentials expired. Refreshing...")
            creds.refresh(Request())
        else:
            if not os.path.exists(CLIENT_SECRETS_FILE):
                print(f"FATAL: Client secrets file not found at '{CLIENT_SECRETS_FILE}'")
                print("Please download it from the Google Cloud Console and place it here.")
                return None
            
            print("No valid credentials found. Starting OAuth flow...")
            flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
                CLIENT_SECRETS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        
        # Save the credentials for the next run
        with open(TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())
            print(f"Credentials saved to {TOKEN_FILE}")

    return creds

def main():
    """Main function to run the authentication process."""
    print("+--------------------------------------+")
    print("|   Jetstreamin YouTube Token Generator  |")
    print("+--------------------------------------+")
    
    credentials = get_credentials()

    if credentials:
        try:
            # You can optionally build a service object to test the credentials
            youtube = googleapiclient.discovery.build(
                API_SERVICE_NAME, API_VERSION, credentials=credentials)
            
            # Example: Get channel information to verify credentials work
            request = youtube.channels().list(
                part="snippet,contentDetails,statistics",
                mine=True
            )
            response = request.execute()
            
            print("\nSUCCESS! Authentication successful.")
            channel_name = response['items'][0]['snippet']['title']
            print(f"Authenticated as YouTube channel: {channel_name}")
            print(f"\nYour '{TOKEN_FILE}' is ready.")
            print("You can now copy the contents of this file into the GCP Secret Manager.")

        except Exception as e:
            print(f"\nAn error occurred during API verification: {e}")
            print("However, the token file may still have been created.")
            print(f"Please check for '{TOKEN_FILE}'.")
    else:
        print("\nCould not obtain credentials. Process halted.")

if __name__ == "__main__":
    main()
