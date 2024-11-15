import { useState, lazy, Suspense } from 'react';
import { MapPin } from 'lucide-react';
import { getPrediction } from './services/api';
import PredictionCard from './components/PredictionCard';
import HistoricalGraph from './components/HistoricalGraph';

const MapComponent = lazy(() => import('./components/Map'));

function App() {
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleLocationSelect = async (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setLoading(true);
    setError(null);

    try {
      const result = await getPrediction(lat, lng);
      setPrediction(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get prediction');
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <MapPin className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              NO₂ Prediction Map
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore NO₂ levels across different locations. Simply click on the map
            to get predictions based on geographical coordinates.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <Suspense fallback={
                <div className="w-full h-[600px] flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              }>
                <MapComponent onLocationSelect={handleLocationSelect} />
              </Suspense>
            </div>
          </div>
          <div className="space-y-6">
            <PredictionCard
              prediction={prediction}
              loading={loading}
              error={error}
              selectedLocation={selectedLocation}
            />
            <HistoricalGraph selectedLocation={selectedLocation} />
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                About This Tool
              </h3>
              <p className="text-gray-600">
                This tool uses machine learning to predict NO₂ levels based on
                geographical coordinates. The predictions are generated using a
                trained Random Forest model that analyzes various environmental
                factors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;