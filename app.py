import os
from flask import jsonify, request
from database.models import Model, Version
from app_context import app, db
from platforms.civitai import Civitai
from tqdm import tqdm
import app_configs
import json

from utils import calculate_sha256


@app.route("/models")
def get_models():
    models = Model.query.all()
    model_list = [{"id": model.id, "name": model.name} for model in models]
    return jsonify({"models": model_list})


@app.route("/add-model", methods=["POST"])
def add_model():
    # Get data from the request
    data = request.json
    model_name = data.get("name")

    # Create a new model object
    new_model = Model(name=model_name)

    # Add the new model to the database
    db.session.add(new_model)
    db.session.commit()

    return jsonify({"message": "User added successfully"}), 201


@app.route("/fetch-model")
def fetch_model():
    model_id = request.args.get("model_id")

    if model_id:
        platform = Civitai(app_configs.CIVITAI_API_KEY)

        model = platform.fetch_model_info({"model_id": model_id})
        if model is None:
            return jsonify({"error": "Some erros occurred!"}), 500
        else:
            return model, 200
    else:
        return "Error: Missing model_id parameter"


@app.route("/sync-model-version")
def sync_model():
    model_version_id = request.args.get("model_version_id")
    
    model = db.session.query(Version).filter_by(id=model_version_id).first()
    json_blob = json.loads(model.blob)
    preview_images = json_blob["images"]
    urls = [image["url"] for image in preview_images]
    destination_filenames = [
        url.split("/")[4] + "." + url.split(".")[-1] for url in urls
    ]

    destination_directory = os.path.join(
        app_configs.IMAGES_DIRECTORY, str(model_version_id), "model_previews"
    )
    destination_paths = [
        os.path.join(destination_directory, filename)
        for filename in destination_filenames
    ]

    platform = Civitai(app_configs.CIVITAI_API_KEY)

    # Download preview images
    success = True
    print("Downloading images:")
    for url, destination_path in tqdm(zip(urls, destination_paths)):
        success = success and platform.download_file(
            url, destination_path, force=False, progress_bar=False
        )

    print("Done!")

    # Download model
    model_type = ""
    if str(model.type).lower() == "lora":
        model_type = "Lora"
    elif str(model.type).lower() == "checkpoint":
        model_type = "Stable-diffusion"

    destination_directory = os.path.join(app_configs.MODELS_DIRECTORY, model_type)

    file_blobs = json_blob["files"]
    destination_paths = []
    urls = []
    for file in file_blobs:
        filename = file["name"]
        file_path = os.path.join(destination_directory, filename)
        if (
            not (os.path.isfile(file_path))
            or file["hashes"]["SHA256"].lower() != calculate_sha256(file_path).lower()
        ):
            destination_paths.append(file_path)
            urls.append(file["downloadUrl"])

    for url, destination_path in zip(urls, destination_paths):
        filename = os.path.basename(destination_path)
        print("Downloading {}...".format(filename), sep="")
        success = success and platform.download_file(
            url, destination_path, force=True, progress_bar=True
        )

    if success:
        return jsonify({"message": "Success!"}), 200
    else:
        return jsonify({"error": "Failed to download some files!"}), 500


def setup():
    if app_configs.MODELS_DIRECTORY is None:
        app_configs.MODELS_DIRECTORY = "models"
        os.makedirs(app_configs.MODELS_DIRECTORY, exist_ok=True)

    if app_configs.IMAGES_DIRECTORY is None:
        app_configs.IMAGES_DIRECTORY = "images"
        os.makedirs(app_configs.IMAGES_DIRECTORY, exist_ok=True)


if __name__ == "__main__":
    setup()
    app.run(debug=True)
