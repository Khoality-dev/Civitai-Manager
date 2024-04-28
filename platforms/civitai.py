import json
import os

from tqdm import tqdm
from database.models import Model, Version
from platforms.platform import Platform
from app_context import db
import requests

class Civitai(Platform):
    def __init__(self, api_key):
        super().__init__(api_key=api_key)
        self.base_url = "https://civitai.com/api/"

    def fetch_model_info(self, params):
        if ("model_id" not in params):
            return None
        endpoint = self.base_url + "/models"
        request = endpoint + "/{}".format(params["model_id"]) + "?token={}".format(self.api_key)

        response = requests.get(request)

        if response.status_code == 200:
            model_json = response.json()

            model_params = {
                "model_id":str(model_json["id"]),
                "name":model_json["name"],
                "type":model_json["type"],
                "request_url":request,
                "platform":"Civitai",
                "blob": response.text
            }
            model = Model(**model_params)
            existing_model = db.session.query(Model).filter_by(model_id = model_params["model_id"]).first()
            if existing_model:
                model.id = existing_model.id
            db.session.merge(model)
            db.session.commit()

            children = model_json["modelVersions"]
            for child in children:
                child_params = {
                    "name":child["name"],
                    "model_id": model.id, 
                    "version_id": str(child["id"]),
                    "type":model_json["type"],
                    "description": model_json["description"],
                    "activation_words": json.dumps({"prompts": child["trainedWords"] if "trainedWords" in child else []}),
                    "custom_activation_words":"",
                    "blob": json.dumps(child)
                }
                version = Version(**child_params)
                existing_child = db.session.query(Version).filter_by(model_id = child_params["model_id"],version_id = child_params["version_id"]).first()
                if existing_child:
                    version.id = existing_child.id

                db.session.merge(version)
                db.session.commit()
            
            return model_json
        else:
            print('Error:', response.status_code)
            return None
        
    def download_file(self, url, destination_path, force=False, progress_bar=True):
        if os.path.isfile(destination_path) and not force:
            return True

        parent_dir = os.path.dirname(destination_path)
        if not os.path.exists(parent_dir):
            os.makedirs(parent_dir)
        
        url = url + "?token={}".format(self.api_key)

        response = requests.get(url, stream=True)

        if response.status_code == 200:
            total_size = int(response.headers.get('content-length', 0))
            progress_bar = tqdm(total=total_size, unit='B', unit_scale=True) if progress_bar else None
            with open(destination_path, "wb") as file:

                if progress_bar is None:
                    for chunk in  response.iter_content(chunk_size=1024):
                        file.write(chunk)
                else:
                    for chunk in  response.iter_content(chunk_size=1024):
                        file.write(chunk)
                        progress_bar.update(len(chunk))
            return True
        else:
            return False