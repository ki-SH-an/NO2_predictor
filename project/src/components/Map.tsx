import { useEffect, useRef, useCallback, memo, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import ConcentratedAreasList from './ConcentratedAreasList';
import { concentratedAreas } from './ConcentratedAreasList';

interface MapProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

const Map = memo(({ onLocationSelect }: MapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const heatLayerRef = useRef<L.HeatLayer | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const clickHandlerRef = useRef((lat: number, lng: number) => {
    onLocationSelect(lat, lng);
  });

  const updateMarkerPosition = useCallback((latlng: L.LatLng | [number, number]) => {
    if (!mapRef.current) return;

    if (markerRef.current) {
      markerRef.current.setLatLng(latlng);
    } else {
      const redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      const marker = L.marker(latlng, { icon: redIcon });
      marker.addTo(mapRef.current);
      markerRef.current = marker;
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map', {
        zoomControl: true,
        scrollWheelZoom: true,
        dragging: true,
        fadeAnimation: true,
        markerZoomAnimation: true,
        zoomAnimation: true,
        zoom: 5,
        center: [20.5937, 78.9629],
        preferCanvas: true,
        minZoom: 2,
        maxZoom: 18,
        zoomSnap: 0.1,
        zoomDelta: 0.5,
        wheelDebounceTime: 40
      });
      
      // Add base layers
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 2,
        attribution: '© OpenStreetMap contributors'
      });

      const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        minZoom: 2,
        attribution: '© Esri'
      });

      const baseMaps = {
        "Street": osmLayer,
        "Satellite": satelliteLayer
      };

      osmLayer.addTo(map);
      L.control.layers(baseMaps).addTo(map);

      // Create a layer group for markers
      layerGroupRef.current = L.layerGroup().addTo(map);

      // Add heat map layer
      const updateLayers = () => {
        const filteredAreas = selectedRegion
          ? concentratedAreas.filter(area => area.region === selectedRegion)
          : concentratedAreas;

        const heatData = filteredAreas.map(area => [
          area.latitude,
          area.longitude,
          (area.concentration / 200) * 2
        ]);

        if (heatLayerRef.current) {
          heatLayerRef.current.remove();
        }

        heatLayerRef.current = L.heatLayer(heatData.map(data => [data[0], data[1], data[2]]), {
          radius: 25,
          blur: 15,
          maxZoom: 10,
          max: 1.0,
          gradient: {
            0.0: 'blue',
            0.3: 'lime',
            0.5: 'yellow',
            0.7: 'orange',
            1.0: 'red'
          }
        }).addTo(map);

        // Update markers
        if (layerGroupRef.current) {
          layerGroupRef.current.clearLayers();
          
          filteredAreas.forEach(area => {
            const color = area.region === 'North' ? '#ef4444' :
                         area.region === 'South' ? '#22c55e' :
                         area.region === 'East' ? '#eab308' :
                         '#a855f7';

            L.circleMarker([area.latitude, area.longitude], {
              radius: 8,
              fillColor: color,
              color: '#000',
              weight: 1,
              opacity: 1,
              fillOpacity: 0.5
            })
            .bindPopup(`
              <b>${area.name}</b><br>
              NO₂: ${area.concentration.toFixed(1)} µg/m³<br>
              Region: ${area.region}
            `)
            .addTo(layerGroupRef.current!);
          });
        }
      };

      updateLayers();

      const handleMapClick = (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        updateMarkerPosition(e.latlng);
        clickHandlerRef.current(lat, lng);
      };

      map.on('click', handleMapClick);
      mapRef.current = map;

      return () => {
        map.off('click', handleMapClick);
        if (heatLayerRef.current) {
          heatLayerRef.current.remove();
        }
        map.remove();
        mapRef.current = null;
      };
    }
  }, [selectedRegion]);

  const handleAreaClick = useCallback((lat: number, lng: number) => {
    if (!mapRef.current) return;

    const currentZoom = mapRef.current.getZoom();
    
    mapRef.current.setView([lat, lng], currentZoom, {
      animate: true,
      duration: 0.5,
      easeLinearity: 0.25
    });
    
    updateMarkerPosition([lat, lng]);
    clickHandlerRef.current(lat, lng);
  }, [updateMarkerPosition]);

  return (
    <div className="flex gap-4">
      <div 
        id="map" 
        className="w-3/4 h-[600px] rounded-lg"
      />
      <div className="w-1/4">
        <ConcentratedAreasList 
          onAreaClick={handleAreaClick}
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
        />
      </div>
    </div>
  );
});

Map.displayName = 'Map';

export default Map;