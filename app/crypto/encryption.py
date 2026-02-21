import os
import json
import hashlib
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from app.config import DATA_ENCRYPTION_KEY

# Derive a stable 32-byte AES key from the secret (SHA-256)
KEY = hashlib.sha256(DATA_ENCRYPTION_KEY.encode()).digest()
aesgcm = AESGCM(KEY)


def encrypt_record(data: dict) -> bytes:
    """Encrypts a dictionary using AES-GCM. Returns nonce + ciphertext."""
    nonce = os.urandom(12)
    plaintext = json.dumps(data).encode()
    ciphertext = aesgcm.encrypt(nonce, plaintext, None)
    return nonce + ciphertext


def decrypt_record(encrypted_blob: bytes) -> dict:
    """Decrypts data encrypted by encrypt_record."""
    nonce = encrypted_blob[:12]
    ciphertext = encrypted_blob[12:]
    plaintext = aesgcm.decrypt(nonce, ciphertext, None)
    return json.loads(plaintext.decode())