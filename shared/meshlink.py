import socket
import hashlib

class MeshLink:
    def __init__(self, role, peer, port=5000):
        self.role = role
        self.peer = peer
        self.port = port
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    def register(self):
        # Broadcast presence
        msg = f"HELLO {self.role}".encode()
        self.sock.sendto(msg, ('<broadcast>', self.port))

    def send(self, text):
        # SHA3 sign
        sig = hashlib.sha3_512(text.encode()).hexdigest()
        payload = f"{self.role}|{text}|{sig}".encode()
        self.sock.sendto(payload, (self.peer + '.local', self.port))

    def receive(self):
        data, _ = self.sock.recvfrom(4096)
        role, text, sig = data.decode().split('|')
        return text
