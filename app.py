from flask import Flask, jsonify, request
from flask_cors import CORS  # Enable CORS
import joblib
import numpy as np

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Load the trained model
model = joblib.load("random_forest_no2_model.pkl")

@app.route('/')
def home():
    # Updated message with loading dots effect, grey background, and white text
    return """
    <style>
        body {
            background-color: black; /* Set background color to grey */
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh; /* Full height of the viewport */
            margin: 0; /* Remove default margin */
        }
        .loading {
            font-size: 2em; /* Increase font size */
            color: white; /* Set text color to white */
            font-weight: bold;
        }
        .dot {
            display: inline-block;
            width: 0.15em;
            height: 0.2em;
            margin: 0 0.1em;
            border-radius: 50%;
            background-color: white; /* Dot color */
            animation: loading 1s infinite; /* Apply loading animation */
        }
        @keyframes loading {
            0%, 20% {
                opacity: 0.1;
            }
            50% {
                opacity: 1;
            }
            100% {
                opacity: 0.1;
            }
        }
        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        .dot:nth-child(4) { animation-delay: 0.6s; }
        .dot:nth-child(5) { animation-delay: 0.8s; }
    </style>
    <div class="loading">
        NO₂ prediction API is active
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
    </div>
    """

# Prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    
    if latitude is None or longitude is None:
        return jsonify({"error": "Missing latitude or longitude"}), 400

    # Debugging: Print the received latitude and longitude
    print(f"Received latitude: {latitude}, longitude: {longitude}")
    
    # Preprocess the input coordinates and make predictions
    features = np.array([[latitude, longitude]])
    
    # Debugging: Print the features being sent to the model
    print(f"Model input features: {features}")

    prediction = model.predict(features)
    
    # Debugging: Print the model's prediction
    print(f"Prediction result: {prediction[0]}")
    
    return jsonify({'NO2_prediction': prediction[0]})

if __name__ == '__main__':
    app.run(debug=True)
