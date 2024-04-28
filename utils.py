import hashlib
import re

import requests
import os

from tqdm import tqdm


def calculate_sha256(file_path):
    if not(os.path.exists(file_path)):
        return None
    
    sha256_hash = hashlib.sha256()
    total_size = os.path.getsize(file_path)
    progress_bar = tqdm(total=total_size, unit='B', unit_scale=True)
    chuck_size = 8192
    with open(file_path, "rb") as file:
        chunk = file.read(chuck_size)
        while len(chunk) > 0:
            sha256_hash.update(chunk)
            chunk = file.read(chuck_size)
            progress_bar.update(len(chunk))

    sha256_digest = sha256_hash.hexdigest()
    return sha256_digest

def sanitize_filename(filename):
    invalid_chars_pattern = r'[<>:"/\\|?*]'
    sanitized_filename = re.sub(invalid_chars_pattern, '_', filename)
    sanitized_filename = sanitized_filename.strip()
    return sanitized_filename