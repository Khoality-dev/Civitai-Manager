import json
from database.models import Model, Version
from platforms.platform import Platform
from app_context import db
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
                    "file_checksum":"",
                    "description": model_json["description"],
                    "activation_words": child["trainedWords"] if "trainedWords" in child else [],
                    "custom_activation_words":"",
                    "blob": str(child)
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
