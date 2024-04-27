
from flask import jsonify, request
from database.model import Model
from app_context import app, db

@app.route('/models')
def get_models():
    models = Model.query.all()
    model_list = [{'id': model.id, 'name': model.name} for model in models]
    return jsonify({'models': model_list})

@app.route('/add_model', methods=['POST'])
def add_model():
    # Get data from the request
    data = request.json
    model_name = data.get('name')
    
    # Create a new model object
    new_model = Model(name=model_name)

    # Add the new model to the database
    db.session.add(new_model)
    db.session.commit()

    return jsonify({'message': 'User added successfully'}), 201

if __name__ == '__main__':
    app.run(debug=True)