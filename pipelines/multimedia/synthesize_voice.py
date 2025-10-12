import os
from gtts import gTTS
import sox

def create_audio_from_text(text_content, output_path):
    """
    Generates an MP3 from text and returns its duration.
    """
    # Clean up text for TTS
    tts_text = text_content.replace('---', ' ').replace('\n', ' ')
    
    # Generate speech
    tts = gTTS(text=tts_text, lang='en', slow=False)
    temp_audio_path = output_path + ".tmp.mp3"
    tts.save(temp_audio_path)
    
    # Normalize audio and save to final path
    transformer = sox.Transformer()
    transformer.norm()
    transformer.build_file(temp_audio_path, output_path)
    
    duration = sox.file_info.duration(output_path)
    os.remove(temp_audio_path)
    
    return duration
