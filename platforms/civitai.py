import json
from database.models import Model
from platforms.platform import Platform
import requests


class Civitai(Platform):
    def __init__(self, api_key):
        super().__init__(api_key=api_key)
        self.base_url = "https://civitai.com/api/v1"

    def get_model_info(self, model_id):
        endpoint = self.base_url + "/models"
        request = endpoint + f"/{model_id}"

        response = requests.get(request)

        if response.status_code == 200:
            model_json = response.json()

            params = {
                "name":model_json["name"],
                "type":model_json["type"],
                "source_url":request,
                "platform":"Civitai",
                "checksum":"",
                "description": model_json["description"],
                "activation_words": model_json["trainedWords"] if "trainedWords" in model_json else "",
                "custom_activation_words":"",
                "blob": response.text
            }

            model = Model(**params)
            return model
        else:
            print('Error:', response.status_code)
            return None
