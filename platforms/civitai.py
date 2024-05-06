import json
import os

from tqdm import tqdm
from database.models import Model, Version
from platforms.platform import Platform
from app_context import db
import app_configs
import requests

class Civitai(Platform):
    def __init__(self, api_key):
        super().__init__(api_key=api_key)
        self.base_url = "https://civitai.com/api/v1"

    def fetch_model_info(self, params):
        if ("model_id" not in params):
            return None
        endpoint = self.base_url + "/models"
        request = endpoint + "/{}".format(params["model_id"]) 
        request_with_token = request  + "?token={}".format(self.api_key)

        response = requests.get(request_with_token)

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

            model = db.session.query(Model).filter_by(model_id = model_params["model_id"]).first()
            children = model_json["modelVersions"]
            for child in children:
                child_params = {
                    "name":child["name"],
                    "model_id": model.id, 
                    "version_id": str(child["id"]),
                    "type":model_json["type"],
                    "description": model_json["description"],
                    "positive_prompts": json.dumps({"prompts": child["trainedWords"] if "trainedWords" in child else []}),
                    "negative_prompts": json.dumps({"prompts": []}),
                    "custom_positive_prompts":"",
                    "custom_negative_prompts":"",
                    "blob": json.dumps(child)
                }
                version = Version(**child_params)
                existing_child = db.session.query(Version).filter_by(version_id = child_params["version_id"]).first()
                if existing_child:
                    version.id = existing_child.id

                db.session.merge(version)
                db.session.commit()

                version = db.session.query(Version).filter_by(version_id = child_params["version_id"]).first()
                json_blob = json.loads(version.blob)
                preview_images = json_blob["images"]
                urls = [image["url"] for image in preview_images]
                destination_filenames = [
                    url.split("/")[4] + "." + url.split(".")[-1] for url in urls
                ]

                destination_directory = os.path.join(
                    app_configs.IMAGES_DIRECTORY, str(version.id), "model_previews"
                )
                destination_paths = [
                    os.path.join(destination_directory, filename)
                    for filename in destination_filenames
                ]

                # Download preview images
                success = True
                print("Downloading images:")
                for url, destination_path in tqdm(zip(urls, destination_paths)):
                    success = success and self.download_file(
                        url, destination_path, force=False, progress_bar=False
                    )

                print("Done!")
            
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
        
        url = url + ("?" if "?" not in url else "&") + "token={}".format(self.api_key)

        headers = {}
        if os.path.isfile(destination_path):
            file_size = os.path.getsize(destination_path)
            headers['Range'] = f"bytes={file_size}-"

        response = requests.get(url, headers=headers, stream=True)

        if response.status_code == 200 or response.status_code == 206:
            total_size = int(response.headers.get('content-length', 0))
            progress_bar = tqdm(total=total_size, unit='B', unit_scale=True) if progress_bar else None
            with open(destination_path, "ab") as file:

                if progress_bar is None:
                    for chunk in response.iter_content(chunk_size=1024):
                        file.write(chunk)
                else:
                    for chunk in  response.iter_content(chunk_size=1024):
                        file.write(chunk)
                        progress_bar.update(len(chunk))
            return True
        else:
            return False