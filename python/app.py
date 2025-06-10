# postman_generator/app.py

from flask import Flask, request, render_template
import json
from assertion_generator import generate_postman_assertions_named_match_counter
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generateFromReact', methods=['POST'])
def generateFromReact():
    if request.is_json:
        data = request.json
        apiInput = data.get("jsonInput")
        apiMeta = data.get("jsonMetaInput")
        input_json = json.loads(apiInput)
        metadata_json = json.loads(apiMeta)
        print(input_json)
        print(metadata_json)
        output = generate_postman_assertions_named_match_counter(input_json, metadata_json)
        return output
    else:
        return jsonify({"error": "Request must be JSON"}), 400
        
@app.route('/generate', methods=['POST'])
def generate():
    input_file = request.files['input']
    metadata_file = request.files['metadata']

    input_json = json.load(input_file)
    metadata_json = json.load(metadata_file)
    print(input_json)
    print(metadata_json)
    output = generate_postman_assertions_named_match_counter(input_json, metadata_json)
    return output

if __name__ == '__main__':
    app.run(debug=True)
