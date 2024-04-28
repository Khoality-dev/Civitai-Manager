import hashlib

import requests
import os

from tqdm import tqdm


def calculate_sha256(file_path):
    sha256_hash = hashlib.sha256()

    with open(file_path, "rb") as file:
        chunk = file.read(4096)
        while len(chunk) > 0:
            sha256_hash.update(chunk)
            chunk = file.read(4096)

    sha256_digest = sha256_hash.hexdigest()
    return sha256_digest

