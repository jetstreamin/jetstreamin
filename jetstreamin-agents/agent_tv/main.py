import time
from shared.meshlink import MeshLink
from shared.stt_listener import STTListener
from shared.tts_speaker import TTSSpeaker

if __name__ == '__main__':
    mesh = MeshLink(role='tv', peer='phone')
    stt = STTListener()
    tts = TTSSpeaker(voices=['deep_male'])

    mesh.register()
    while True:
        text = stt.listen()
        mesh.send(text)
        response = mesh.receive()
        tts.speak(response)
        time.sleep(0.1)
