import os

CIVITAI_API_KEY = os.environ.get('CIVITAI_API_KEY')
MODELS_DIRECTORY = None # if not specify, create a new models folder at current path and save all the files there
IMAGES_DIRECTORY = None # if not specify, civitai manager will save images to model folder
ALBUM_DIRECTORY = None
BACKUP_MODELS_DIRECTORY = None