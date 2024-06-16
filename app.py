import os
import random
from flask import jsonify, request, send_file
from database.models import Model, Version
from app_context import app, db
from platforms.civitai import Civitai
from tqdm import tqdm
import app_configs
import json
import shutil
from sqlalchemy.sql import text
from utils import (
    calculate_sha256,
    generate_regex_pattern,
    list_dir,
    sanitize_filename,
    serialize_image,
)


@app.route("/model/preview-images")
def get_model_image():
    id = request.args.get("id")
    index = request.args.get("number")
    if id is None:
        return jsonify({"error": "Some erros occurred!"}), 500

    model_versions = db.session.query(Version).filter_by(model_id=id).all()

    # If there are no versions, return None
    if not model_versions:
        return jsonify({"error": "Some erros occurred!"}), 500

    model_version_id = model_versions[random.randint(0, len(model_versions) - 1)].id
    directory = f"images/{model_version_id}/model_previews"
    image_filenames = [
        filename
        for filename in os.listdir(directory)
        if filename.endswith(".jpg")
        or filename.endswith(".png")
        or filename.endswith(".jpeg")
    ]

    if index is not None and int(index) >= len(image_filenames):
        return jsonify({"error": "Some erros occurred!"}), 500

    image_filename = (
        random.choice(image_filenames)
        if index is None or int(index) == -1
        else image_filenames[int(index)]
    )
    return send_file(os.path.join(directory, image_filename))


@app.route("/model/version/preview-images")
def get_version_image():
    id = request.args.get("id")
    index = request.args.get("index")
    if id is None:
        return jsonify({"error": "Some erros occurred!"}), 500
    id = int(id)
    model_version = db.session.query(Version).filter_by(id=id).first()

    # If there are no versions, return None
    if not model_version:
        return jsonify({"error": "Some erros occurred!"}), 500

    model_version_id = model_version.id

    directory = f"images/{model_version_id}/model_previews"
    image_filenames = [
        filename
        for filename in os.listdir(directory)
        if filename.endswith(".jpg")
        or filename.endswith(".png")
        or filename.endswith(".jpeg")
    ]

    if index is not None and int(index) >= len(image_filenames):
        return jsonify({"error": "Index out of bound!"}), 500

    image_filename = (
        random.choice(image_filenames)
        if index is None or int(index) == -1
        else image_filenames[int(index)]
    )
    return send_file(os.path.join(directory, image_filename))


@app.route("/model/version/preview-images/size")
def get_version_image_size():
    id = request.args.get("id")
    if id is None:
        return jsonify({"error": "Some erros occurred!"}), 500
    id = int(id)
    model_version = db.session.query(Version).filter_by(id=id).first()

    # If there are no versions, return None
    if not model_version:
        return jsonify({"error": "Some erros occurred!"}), 500

    model_version_id = model_version.id

    directory = f"images/{model_version_id}/model_previews"
    image_filenames = [
        filename
        for filename in os.listdir(directory)
        if filename.endswith(".jpg")
        or filename.endswith(".png")
        or filename.endswith(".jpeg")
    ]

    return jsonify({"size": len(image_filenames)})


@app.route("/models")
def get_models():
    search = request.args.get("search")

    models = None
    if search is not None:
        statement = """
            SELECT *
            FROM models
            WHERE name ~* \'{}\';
        """.format(
            generate_regex_pattern(search)
        )
        query = text(statement)
        models = db.session.execute(query)
    else:
        models = db.session.query(Model)

    models = models.all()

    model_list = [
        {
            "id": model.id,
            "name": model.name,
            "type": model.type,
            "created_at": model.created_at,
            "updated_at": model.updated_at,
            "url": model.request_url,
        }
        for model in models
    ]

    return jsonify({"models": model_list})


@app.route("/model/versions")
def get_model_versions():
    id = request.args.get("id")
    if id is None:
        return jsonify({"error": "Some erros occurred!"}), 500

    versions = db.session.query(Version).filter_by(model_id=id).all()

    if len(versions) == 0:
        return jsonify({"error": "Some erros occurred!"}), 500

    versions = [
        {
            "id": version.id,
            "name": version.name,
            "positive_prompts": version.positive_prompts,
            "negative_prompts": version.negative_prompts,
            "created_at": version.created_at,
            "updated_at": version.updated_at,
        }
        for version in versions
    ]
    return jsonify({"versions": versions}), 200


@app.route("/fetch-all-models")
def fetch_all_models():

    models = db.session.query(Model).all()
    if models is None:
        return

    platform = Civitai(app_configs.CIVITAI_API_KEY)

    for model in models:
        result = platform.fetch_model_info({"model_id": model.blob["id"]})

    return jsonify({"message": "Success"}), 200


@app.route("/fetch-model")
def fetch_model():
    model_id = request.args.get("model_id")

    if model_id is not None and model_id != "undefined":
        platform = Civitai(app_configs.CIVITAI_API_KEY)

        model = platform.fetch_model_info({"model_id": model_id})
        if model is None:
            return jsonify({"error": "Some erros occurred!"}), 500
        else:
            return model, 200
    else:
        return jsonify({"error": "Missing model_id parameter!"}), 500


@app.route("/delete-model")
def delete_model():
    id = request.args.get("id")

    if id is not None:
        versions = db.session.query(Version).filter(Version.model_id == id).all()
        for version in versions:
            shutil.rmtree(
                os.path.join(app_configs.IMAGES_DIRECTORY, str(version.id)),
                ignore_errors=True,
            )
            shutil.rmtree(
                os.path.join(
                    app_configs.MODELS_DIRECTORY, sanitize_filename(version.model.name)
                ),
                ignore_errors=True,
            )
        db.session.query(Version).filter(Version.model_id == id).delete()
        db.session.query(Model).filter(Model.id == id).delete()
        db.session.commit()

    return jsonify({"message": "Success!"}), 200


@app.route("/file-browser")
def file_browser():
    path = request.args.get("path")

    path = os.path.normpath(path)

    if (
        path is None
        or not os.path.isdir(path)
        or not path.startswith(app_configs.ALBUM_DIRECTORY)
    ):
        return jsonify({"error": "Invalid path!"}), 500

    files = {}
    for file in os.listdir(path):
        current_path = os.path.join(app_configs.ALBUM_DIRECTORY, file)
        if os.path.isdir(current_path):
            files[file] = {}
        elif os.path.isfile(current_path):
            try:
                base64 = serialize_image(current_path)
                files[file] = {"base64": base64}
            except:
                print("Skipping {}...".format(current_path))

    return jsonify({"files": files}), 200


@app.route("/sync-model-version")
def sync_model_version():
    for file in tqdm(
        [
            *list_dir(os.path.join(app_configs.MODELS_DIRECTORY, "Lora")),
            *list_dir(os.path.join(app_configs.MODELS_DIRECTORY, "Stable-diffusion")),
        ]
    ):
        if (
            file.endswith(".png")
            or file.endswith(".jpg")
            or file.endswith(".json")
            or file.endswith(".info")
        ):
            continue

        checksum = calculate_sha256(file, progress_bar=False).upper()

        statement = 'SELECT * FROM versions WHERE blob -> \'files\' @> \'[{{"hashes": {{"SHA256": "{}"}}}}]\''.format(
            checksum
        )
        query = text(statement)
        version = db.session.execute(query).first()

        # model does not exist, fetch it
        if version is None:
            civitai = Civitai(app_configs.CIVITAI_API_KEY)

            ret = civitai.fetch_model_info_by_hash(checksum, progress_bar=False)
            if ret is None:
                print("Failed to retrieve model of {} from Civitai!".format(file))
            else:
                print("Fetched {}.".format(os.path.basename(file)))

    return jsonify({"message": "Success!"}), 200


@app.route("/download-model-version")
def download_model_version():
    model_version_id = request.args.get("model_version_id")

    version = db.session.query(Version).filter_by(id=model_version_id).first()
    json_blob = version.blob

    platform = Civitai(app_configs.CIVITAI_API_KEY)

    # Download model
    model_type = ""
    if str(version.type).lower() == "lora":
        model_type = "Lora"
    elif str(version.type).lower() == "checkpoint":
        model_type = "Stable-diffusion"
    else:
        model_type = "Others"

    model_name = sanitize_filename(version.model.name)

    destination_directory = os.path.join(
        app_configs.MODELS_DIRECTORY, model_type, model_name
    )

    file_blobs = json_blob["files"]
    destination_paths = []
    urls = []
    for file in file_blobs:
        filename = file["name"]
        file_path = os.path.join(destination_directory, filename)
        if not (os.path.isfile(file_path)):
            destination_paths.append(file_path)
            urls.append(file["downloadUrl"])
        else:

            # print("Calculating checksum {}...".format(filename))
            # calculated_checksum = calculate_sha256(file_path)
            # print("Done!")
            # if (
            #     calculated_checksum is not None
            #     and file["hashes"]["SHA256"].lower() != calculated_checksum.lower()
            # ):
            #     destination_paths.append(file_path)
            #     urls.append(file["downloadUrl"])

            print("Checking file size {}...".format(filename))
            calculated_file_size = os.path.getsize(file_path) / 1024.0
            if (calculated_file_size) != file["sizeKB"]:
                if calculated_file_size > file["sizeKB"]:
                    os.remove(file_path)
                destination_paths.append(file_path)
                urls.append(file["downloadUrl"])
            else:
                print("Skip {}...".format(filename))

    success = True
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

    if app_configs.ALBUM_DIRECTORY is None:
        app_configs.ALBUM_DIRECTORY = "album"

    os.makedirs(app_configs.ALBUM_DIRECTORY, exist_ok=True)

    if app_configs.BACKUP_MODELS_DIRECTORY is None:
        app_configs.BACKUP_MODELS_DIRECTORY = "album"

    os.makedirs(app_configs.BACKUP_MODELS_DIRECTORY, exist_ok=True)


if __name__ == "__main__":
    setup()
    app.run(ssl_context=("cert.pem", "key.pem"), debug=True)
