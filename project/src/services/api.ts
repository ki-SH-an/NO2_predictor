interface PredictionResponse {
  NO2_prediction: number;
}


const API_URL = 'http://127.0.0.1:5000';

export const getPrediction = async (latitude: number, longitude: number): Promise<number> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ 
        latitude: parseFloat(latitude.toFixed(6)), 
        longitude: parseFloat(longitude.toFixed(6)) 
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || `Server error: ${response.status}`);
    }

    const data = await response.json() as PredictionResponse;
    
    if (typeof data.NO2_prediction !== 'number') {
      throw new Error('Invalid prediction data received');
    }

    return data.NO2_prediction;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please check if the server is running.');
      }
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to the prediction server. Please ensure it is running at http://127.0.0.1:5000');
      }
      throw new Error(`Prediction failed: ${error.message}`);
    }
    throw new Error('An unexpected error occurred');
  }
};