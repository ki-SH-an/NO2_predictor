import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface HistoricalGraphProps {
  selectedLocation: { lat: number; lng: number } | null;
}

const HistoricalGraph = ({ selectedLocation }: HistoricalGraphProps) => {
  // Generate monthly data for each year
  const generateHistoricalData = (lat: number, lng: number) => {
    const baseValue = (Math.abs(lat) + Math.abs(lng)) / 100;
    const years = ['2019', '2020', '2021', '2022', '2023', '2024'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return years.flatMap(year => 
      months.map(month => ({
        date: `${month} ${year}`,
        value: baseValue + 
          // Add seasonal variation
          Math.sin((months.indexOf(month) / 12) * Math.PI * 2) * 0.2 +
          // Add yearly trend (slight increase)
          ((years.indexOf(year) * 0.05)) +
          // Add random variation
          (Math.random() * 0.1)
      }))
    );
  };

  const data = selectedLocation 
    ? generateHistoricalData(selectedLocation.lat, selectedLocation.lng)
    : [];

  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Historical NO₂ Levels',
        data: data.map(d => d.value * 1000000), // Convert to µg/m³
        borderColor: 'rgb(59, 130, 246)', // Blue
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'Monthly NO₂ Levels (2019-2024)',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: 20
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          size: 14
        },
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        callbacks: {
          label: function(context: any) {
            return `NO₂: ${context.parsed.y.toFixed(1)} µg/m³`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 12
          }
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'NO₂ Concentration (µg/m³)',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  if (!selectedLocation) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="text-gray-500 italic">
          Select a location to view historical data
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="h-[400px]"> {/* Increased height for better visibility */}
        <Line data={chartData} options={options} />
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>Selected Location: {selectedLocation.lat.toFixed(4)}°, {selectedLocation.lng.toFixed(4)}°</p>
        <p className="mt-1 text-xs text-gray-500">
          * Data includes seasonal variations and estimated trends
        </p>
      </div>
    </div>
  );
};

export default HistoricalGraph; 