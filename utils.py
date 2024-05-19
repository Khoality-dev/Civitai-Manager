import base64
import hashlib
import re
import cv2
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

# chatgpt
# serialize image to base64
def serialize_image(image):
    if isinstance(image, str): 
        if not os.path.exists(image):
            raise FileNotFoundError(f"File '{image}' not found.")
        img = cv2.imread(image)
        if img is None:
            raise ValueError(f"Failed to read image from '{image}'.")
    elif isinstance(image, cv2.Mat):  # Check if input is a CV2 Mat
        img = image
    else:
        raise ValueError("Input must be either a CV2 Mat or a path string.")

    _, buffer = cv2.imencode('.jpeg', img)
    encoded_image = base64.b64encode(buffer).decode('utf-8')
    return encoded_image


def list_dir(path):
    result = []
    for root, dirs, files in os.walk(path, topdown=True):
        for file in files:
            result.append(os.path.join(root, file))
    return result

def generate_regex_pattern(input_string):
    chars = input_string.split()
    pattern = '.*'.join(chars)
    return pattern