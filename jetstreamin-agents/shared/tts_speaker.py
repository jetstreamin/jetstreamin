import subprocess

class TTSSpeaker:
    def __init__(self, voices):
        self.voices = voices

    def speak(self, text):
        for v in self.voices:
            # generate wav via gTTS or espeak
            subprocess.run(['tts', '--text', text, '--voice', v, '--out_path', '/tmp/out.wav'])
            # play and mix
            subprocess.run(['sox', '/tmp/out.wav', '-p', 'gain', '-n'], check=True)
