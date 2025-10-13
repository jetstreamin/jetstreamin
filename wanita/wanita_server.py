# wanita_server.py
# This service will be responsible for the cinematic pipeline.
# It will take text from Cyphermorph and generate a video.

from flask import Flask, request, jsonify
import os
from google.cloud import texttospeech
import random
import ffmpeg

app = Flask(__name__)

@app.route('/api/generate_cinematic', methods=['POST'])
def generate_cinematic():
    # Placeholder for the cinematic generation logic
    data = request.get_json()
    sermon_text = data.get('sermon')

    if not sermon_text:
        return jsonify({"error": "Sermon text is required"}), 400

    # 1. Voice Synthesis (gTTS)
    try:
        client = texttospeech.TextToSpeechClient()

        synthesis_input = texttospeech.SynthesisInput(text=sermon_text)

        voice = texttospeech.VoiceSelectionParams(
            language_code="en-US", ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
        )

        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )

        response = client.synthesize_speech(
            input=synthesis_input, voice=voice, audio_config=audio_config
        )

        # For now, save it to a file to verify. This will be part of the in-memory pipeline later.
        output_audio_path = "output.mp3"
        with open(output_audio_path, "wb") as out:
            out.write(response.audio_content)
            print(f'Audio content written to file "{output_audio_path}"')

    except Exception as e:
        return jsonify({"error": f"Failed to synthesize audio: {str(e)}"}), 500


    # 2. Visual & Audio Synthesis
    try:
        video_dir = "media/videos"
        audio_dir = "media/audio"
        video_files = [f for f in os.listdir(video_dir) if os.path.isfile(os.path.join(video_dir, f))]
        audio_files = [f for f in os.listdir(audio_dir) if os.path.isfile(os.path.join(audio_dir, f))]

        if not video_files:
            return jsonify({"error": "No video files found in media/videos"}), 500
        
        if not audio_files:
            return jsonify({"error": "No audio files found in media/audio"}), 500

        random_video_path = os.path.join(video_dir, random.choice(video_files))
        random_audio_path = os.path.join(audio_dir, random.choice(audio_files))

    except Exception as e:
        return jsonify({"error": f"Failed to select media: {str(e)}"}), 500

    # 3. FFmpeg Pipeline
    try:
        output_video_path = "cinematic_output.mp4"

        input_video = ffmpeg.input(random_video_path)
        input_voiceover = ffmpeg.input(output_audio_path)
        input_background_audio = ffmpeg.input(random_audio_path)

        # Combine audio streams
        mixed_audio = ffmpeg.filter([input_voiceover, input_background_audio], 'amix', inputs=2, duration='first')

        # Combine video and mixed audio
        (
            ffmpeg
            .concat(input_video, mixed_audio, v=1, a=1)
            .output(output_video_path)
            .run(overwrite_output=True)
        )
    except Exception as e:
        return jsonify({"error": f"Failed to generate cinematic: {str(e)}"}), 500


    return jsonify({"status": "cinematic generated successfully", "output_path": output_video_path})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
