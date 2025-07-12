import time
from shared.meshlink import MeshLink
from shared.stt_listener import STTListener
from shared.tts_speaker import TTSSpeaker

if __name__ == '__main__':
    mesh = MeshLink(role='phone', peer='tv')
    stt = STTListener()
    tts = TTSSpeaker(voices=['female1','female2','female3'])

    mesh.register()
    while True:
        text = stt.listen()
        mesh.send(text)
        response = mesh.receive()
        tts.speak(response)
        time.sleep(0.1)
