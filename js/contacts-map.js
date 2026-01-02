// ================================
// CONTACTS MAP MODULE
// Static Lviv city map with same styling as hero map
// ================================

(function () {
  const mapContainer = document.getElementById('contactsMap');
  if (!mapContainer) return;

  mapboxgl.accessToken = "pk.eyJ1IjoibXlraGFpbG9rb3NhY2giLCJhIjoiY21pcTB3NHN6MDh4MTNlczh2bm9pdG1jdyJ9.JR_xYNvPBF70Gg5JF9ASTw";

  const contactsMap = new mapboxgl.Map({
    container: "contactsMap",
    style: "mapbox://styles/mapbox/light-v11",
    center: [24.0297, 49.8397], // Lviv city center
    zoom: 11.5,
    pitch: 0,
    bearing: 0,
    interactive: false,
    attributionControl: false,
    dragPan: false,
    scrollZoom: false,
    boxZoom: false,
    dragRotate: false,
    keyboard: false,
    doubleClickZoom: false,
    touchZoomRotate: false
  });

  contactsMap.on('load', () => {
    // Show only place/city labels, hide other labels (roads, POIs, etc.)
    const layers = contactsMap.getStyle().layers;
    layers.forEach((layer) => {
      if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
        // Keep place labels (cities, towns, neighborhoods) visible
        if (layer.id.includes('place') || layer.id.includes('settlement')) {
          contactsMap.setLayoutProperty(layer.id, 'visibility', 'visible');
        } else {
          // Hide road names, POI labels, etc.
          contactsMap.setLayoutProperty(layer.id, 'visibility', 'none');
        }
      }
    });

    // Add a marker for the office location (optional - customize coordinates)
    const officeMarker = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [24.0297, 49.8397] },
          properties: { 
            name: "ProTec Development Office"
          }
        }
      ]
    };

    contactsMap.addSource('office', {
      type: 'geojson',
      data: officeMarker
    });

    contactsMap.addLayer({
      id: 'office-circle',
      type: 'circle',
      source: 'office',
      paint: {
        'circle-radius': 8,
        'circle-color': '#e32225',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': 1
      }
    });

    // Optional: Add a subtle pulsing animation
    let pulseRadius = 8;
    let growing = true;
    
    setInterval(() => {
      if (growing) {
        pulseRadius += 0.3;
        if (pulseRadius >= 12) growing = false;
      } else {
        pulseRadius -= 0.3;
        if (pulseRadius <= 8) growing = true;
      }
      
      if (contactsMap.getLayer('office-circle')) {
        contactsMap.setPaintProperty('office-circle', 'circle-radius', pulseRadius);
      }
    }, 50);
  });

  // Map is static - no zoom controls needed
})();
