import os
from google.cloud import secretmanager
import json
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# This scope allows for uploading and managing videos.
SCOPES = ["https://www.googleapis.com/auth/upload.youtube"]

def get_youtube_service():
    """Authenticates and returns a YouTube service object."""
    client = secretmanager.SecretManagerServiceClient()
    secret_name = "projects/gen-lang-client-0854112426/secrets/youtube-token-json/versions/latest"
    response = client.access_secret_version(request={"name": secret_name})
    creds_json = response.payload.data.decode("UTF-8")
    
    creds_info = json.loads(creds_json)
    creds = Credentials.from_authorized_user_info(creds_info, SCOPES)
    
    # Handle refresh logic if necessary
    # if creds and creds.expired and creds.refresh_token:
    #     creds.refresh(Request())

    return build('youtube', 'v3', credentials=creds)

def upload_video(file_path, title, description, tags):
    """Uploads a video to YouTube."""
    youtube = get_youtube_service()
    
    body = {
        'snippet': {
            'title': title,
            'description': description,
            'tags': tags,
            'categoryId': '28' # Science & Technology, adjust as needed
        },
        'status': {
            'privacyStatus': 'private' # 'public', 'private', or 'unlisted'
        }
    }
    
    media = MediaFileUpload(file_path, chunksize=-1, resumable=True)
    
    request = youtube.videos().insert(
        part=','.join(body.keys()),
        body=body,
        media_body=media
    )
    
    response = request.execute()
    print(f"Video uploaded successfully. Video ID: {response['id']}")
    return response['id']
