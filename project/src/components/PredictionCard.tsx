interface PredictionCardProps {
  prediction: number | null;
  loading: boolean;
  error: string | null;
  selectedLocation: { lat: number; lng: number; } | null;
}

const PredictionCard = ({ prediction, loading, error, selectedLocation }: PredictionCardProps) => {
  const formatConcentration = (value: number) => {
    // Convert the decimal format to µg/m³ and format with 1 decimal place
    const concentration = value * 1000000; // Convert to µg/m³
    return `${concentration.toFixed(1)} µg/m³`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        NO₂ Prediction Results
      </h2>
      
      {selectedLocation && (
        <div className="mb-4 text-sm text-gray-600">
          <p>Selected Location:</p>
          <p>Latitude: {selectedLocation.lat.toFixed(6)}</p>
          <p>Longitude: {selectedLocation.lng.toFixed(6)}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {prediction !== null && !loading && !error && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-green-700">
            Predicted NO₂ level: <span className="font-semibold">{formatConcentration(prediction)}</span>
          </p>
        </div>
      )}

      {!selectedLocation && !loading && !error && (
        <p className="text-gray-500 italic">
          Click on the map to get a prediction for that location
        </p>
      )}
    </div>
  );
};

export default PredictionCard;