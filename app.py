from flask import jsonify, request
from database.models import Model
from app_context import app, db
from platforms.civitai import Civitai
import app_configs


@app.route("/models")
def get_models():
    models = Model.query.all()
    model_list = [{"id": model.id, "name": model.name} for model in models]
    return jsonify({"models": model_list})


@app.route("/add_model", methods=["POST"])
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


@app.route("/fetch_model")
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


if __name__ == "__main__":
    app.run(debug=True)
