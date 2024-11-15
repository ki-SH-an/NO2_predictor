interface ConcentratedArea {
  name: string;
  latitude: number;
  longitude: number;
  concentration: number;
  region: 'North' | 'South' | 'East' | 'West' | 'Central';
}

export const concentratedAreas: ConcentratedArea[] = [
  // North India
  { name: "Delhi NCR", latitude: 28.6139, longitude: 77.2090, concentration: 162.4, region: 'North' },
  { name: "Faridabad", latitude: 28.4089, longitude: 77.3178, concentration: 157.8, region: 'North' },
  { name: "Ghaziabad", latitude: 28.6692, longitude: 77.4538, concentration: 155.3, region: 'North' },
  { name: "Noida", latitude: 28.5355, longitude: 77.3910, concentration: 153.7, region: 'North' },
  { name: "Gurugram", latitude: 28.4595, longitude: 77.0266, concentration: 151.2, region: 'North' },
  { name: "Meerut", latitude: 28.9845, longitude: 77.7064, concentration: 144.8, region: 'North' },
  { name: "Kanpur", latitude: 26.4499, longitude: 80.3319, concentration: 141.2, region: 'North' },
  { name: "Agra", latitude: 27.1767, longitude: 78.0081, concentration: 138.5, region: 'North' },
  { name: "Lucknow", latitude: 26.8467, longitude: 80.9462, concentration: 135.9, region: 'North' },
  { name: "Amritsar", latitude: 31.6340, longitude: 74.8723, concentration: 119.7, region: 'North' },
  
  // South India
  { name: "Bengaluru", latitude: 12.9716, longitude: 77.5946, concentration: 128.5, region: 'South' },
  { name: "Chennai", latitude: 13.0827, longitude: 80.2707, concentration: 135.2, region: 'South' },
  { name: "Hyderabad", latitude: 17.3850, longitude: 78.4867, concentration: 131.8, region: 'South' },
  { name: "Kochi", latitude: 9.9312, longitude: 76.2673, concentration: 115.6, region: 'South' },
  { name: "Coimbatore", latitude: 11.0168, longitude: 76.9558, concentration: 118.9, region: 'South' },
  { name: "Visakhapatnam", latitude: 17.6868, longitude: 83.2185, concentration: 122.4, region: 'South' },
  { name: "Mysuru", latitude: 12.2958, longitude: 76.6394, concentration: 110.5, region: 'South' },
  
  // East India
  { name: "Patna", latitude: 25.5941, longitude: 85.1376, concentration: 133.2, region: 'East' },
  { name: "Muzaffarpur", latitude: 26.1197, longitude: 85.3910, concentration: 129.8, region: 'East' },
  { name: "Kolkata", latitude: 22.5726, longitude: 88.3639, concentration: 127.9, region: 'East' },
  
  // West India
  { name: "Mumbai", latitude: 19.0760, longitude: 72.8777, concentration: 126.8, region: 'West' },
  { name: "Pune", latitude: 18.5204, longitude: 73.8567, concentration: 121.5, region: 'West' },
  { name: "Ahmedabad", latitude: 23.0225, longitude: 72.5714, concentration: 129.7, region: 'West' },
  { name: "Jodhpur", latitude: 26.2389, longitude: 73.0243, concentration: 122.3, region: 'West' }
];

interface ConcentratedAreasListProps {
  onAreaClick: (lat: number, lng: number) => void;
  selectedRegion: string | null;
  onRegionChange: (region: string | null) => void;
}

const ConcentratedAreasList = ({ onAreaClick, selectedRegion, onRegionChange }: ConcentratedAreasListProps) => {
  const formatConcentration = (value: number) => {
    return `${value.toFixed(1)} µg/m³`;
  };

  const regions = ['All', 'North', 'South', 'East', 'West'];

  const filteredAreas = selectedRegion && selectedRegion !== 'All'
    ? concentratedAreas.filter(area => area.region === selectedRegion)
    : concentratedAreas;

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg overflow-y-auto max-h-[600px]">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        High NO₂ Concentration Areas
      </h2>
      
      <div className="flex gap-2 mb-4 flex-wrap">
        {regions.map(region => (
          <button
            key={region}
            onClick={() => onRegionChange(region === 'All' ? null : region)}
            className={`px-3 py-1 rounded-full text-sm ${
              (region === 'All' && !selectedRegion) || region === selectedRegion
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredAreas
          .sort((a, b) => b.concentration - a.concentration)
          .map((area) => (
          <div
            key={area.name}
            className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onAreaClick(area.latitude, area.longitude)}
          >
            <h3 className="font-medium text-gray-900">{area.name}</h3>
            <p className="text-sm text-gray-600">
              NO₂ Level: {formatConcentration(area.concentration)}
            </p>
            <p className="text-xs text-gray-500">
              {area.latitude.toFixed(4)}, {area.longitude.toFixed(4)}
            </p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              area.region === 'North' ? 'bg-red-100 text-red-800' :
              area.region === 'South' ? 'bg-green-100 text-green-800' :
              area.region === 'East' ? 'bg-yellow-100 text-yellow-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              {area.region}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConcentratedAreasList; 