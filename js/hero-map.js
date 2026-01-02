// ================================
// HERO MAP MODULE
// Scroll-driven globe → Lviv region animation
// ================================

(function () {
  const isMobile = window.innerWidth <= 968;
  
  // Helper function to get page in correct language
  function getPageInCurrentLanguage(basePage) {
    const path = window.location.pathname;
    const fileName = path.substring(path.lastIndexOf('/') + 1);
    const isEnglish = fileName.endsWith('-en.html');
    
    // Remove any existing -en suffix first to get the base page
    const cleanBasePage = basePage.replace('-en.html', '.html');
    
    if (isEnglish) {
      return cleanBasePage.replace('.html', '-en.html');
    }
    return cleanBasePage;
  }
  
  // Helper function to get warehouse name in current language
  function getWarehouseName(nameUa, nameEn) {
    const path = window.location.pathname;
    const fileName = path.substring(path.lastIndexOf('/') + 1);
    const isEnglish = fileName.endsWith('-en.html');
    return isEnglish ? nameEn : nameUa;
  }
  
  // Mobile: Show static Lviv region map (same as desktop end state)
  if (isMobile) {
    mapboxgl.accessToken = "pk.eyJ1IjoibXlraGFpbG9rb3NhY2giLCJhIjoiY21pcTB3NHN6MDh4MTNlczh2bm9pdG1jdyJ9.JR_xYNvPBF70Gg5JF9ASTw";
    
    const mobileMap = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/light-v11", // Same as desktop Lviv view
      center: [24.25, 49.75], // Same as desktop end state
      zoom: 6.8, // Same as desktop end state
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
    
    // Warehouse features (same as desktop)
    const warehouses = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [23.95, 49.89] },
          properties: { 
            nameUa: "Рясне",
            nameEn: "Riasne",
            position: "right",
            link: "riasne.html"
          }
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [23.84, 49.84] },
          properties: { 
            nameUa: "Підрясне",
            nameEn: "Pidryasne",
            position: "left",
            link: "pidryasne.html"
          }
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [23.8756375, 49.79] },
          properties: { 
            nameUa: "Зимна Вода",
            nameEn: "Zymna Voda",
            position: "right",
            link: "zymna-voda.html"
          }
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [23.51006, 49.35316] },
          properties: { 
            nameUa: "Дрогобич",
            nameEn: "Drohobych",
            position: "left",
            link: "drohobych.html"
          }
        }
      ]
    };
    
    mobileMap.on('load', () => {
      // Fit bounds to show all warehouses with padding
      const lvivBounds = [
        [22.95, 49.0],  // Southwest coordinates
        [25.0, 50.2]    // Northeast coordinates
      ];
      
      mobileMap.fitBounds(lvivBounds, {
        padding: { top: 80, bottom: 220, left: 40, right: 40 },
        animate: false
      });
      
      // Hide all text labels (same as desktop)
      const layers = mobileMap.getStyle().layers;
      layers.forEach((layer) => {
        if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
          mobileMap.setLayoutProperty(layer.id, 'visibility', 'none');
        }
      });
      
      // Add warehouse circles layer (same as desktop)
      mobileMap.addSource('warehouses', {
        type: 'geojson',
        data: warehouses
      });
      
      mobileMap.addLayer({
        id: 'warehouse-circles',
        type: 'circle',
        source: 'warehouses',
        paint: {
          'circle-radius': 4,
          'circle-color': '#e32225',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });
      
      // Add custom HTML labels (same as desktop)
      const container = document.querySelector('.hero-map-wrapper');
      warehouses.features.forEach((feature) => {
        const label = document.createElement('div');
        label.className = `warehouse-label warehouse-label-${feature.properties.position}`;
        label.textContent = getWarehouseName(feature.properties.nameUa, feature.properties.nameEn);
        label.style.display = 'none';
        
        // Add click handler for navigation
        label.addEventListener('click', () => {
          const link = feature.properties.link;
          if (link) {
            window.location.href = getPageInCurrentLanguage(link);
          }
        });
        
        container.appendChild(label);
        
        const updateLabelPosition = () => {
          const point = mobileMap.project(feature.geometry.coordinates);
          label.style.left = point.x + 'px';
          label.style.top = point.y + 'px';
          label.style.display = 'block';
        };
        
        updateLabelPosition();
        mobileMap.on('move', updateLabelPosition);
        mobileMap.on('zoom', updateLabelPosition);
      });
    });
    
    return; // Exit after setting up mobile map
  }

  // Initialize cloud transition overlay
  // const cloudOverlay = window.CloudTransition ? 
  //   window.CloudTransition.initCloudOverlay('hero') : 
  //   null;
  
  // // Debug: Log overlay status
  // if (cloudOverlay) {
  //   console.log('Cloud overlay initialized:', cloudOverlay);
  //   // Temporary test: Show clouds for 3 seconds on load
  //   setTimeout(() => {
  //     cloudOverlay.classList.add('active');
  //     console.log('Cloud test: showing clouds');
  //     setTimeout(() => {
  //       cloudOverlay.classList.remove('active');
  //       console.log('Cloud test: hiding clouds');
  //     }, 3000);
  //   }, 1000);
  // } else {
  //   console.warn('Cloud overlay not initialized - CloudTransition not available');
  // }

  // TODO: Replace with your properly configured Mapbox token
  // Token must have your GitHub Pages URL in its allowlist
  mapboxgl.accessToken = "pk.eyJ1IjoibXlraGFpbG9rb3NhY2giLCJhIjoiY21pcTB3NHN6MDh4MTNlczh2bm9pdG1jdyJ9.JR_xYNvPBF70Gg5JF9ASTw";

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/satellite-streets-v12", // Satellite view for natural look
    projection: "globe",
    center: [0, 20],
    zoom: 1.2,
    pitch: 0,
    bearing: 0,
    antialias: true
  });

  // Camera states
  const cameraStart = {
    center: [0, 20],
    zoom: 1.2,
    pitch: 0,
    bearing: 0
  };

  const cameraEnd = {
    center: [24.25, 49.75],
    zoom: 6.8,
    pitch: 0,
    bearing: 0,
  };

  // Bounds covering Lviv oblast
  const lvivBounds = [
    [22.9, 48.9], // SW
    [25.6, 50.6]  // NE
  ];

  // Warehouse locations
  const warehouses = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { 
          nameUa: "Рясне",
          nameEn: "Riasne",
          link: "riasne.html" 
        },
        geometry: {
          type: "Point",
          coordinates: [23.95, 49.89] // Further north-east
        }
      },
      {
        type: "Feature",
        properties: { 
          nameUa: "Підрясне",
          nameEn: "Pidryasne",
          link: "pidryasne.html" 
        },
        geometry: {
          type: "Point",
          coordinates: [23.84, 49.84] // Further south-west
        }
      },
      {
        type: "Feature",
        properties: { 
          nameUa: "Зимна Вода",
          nameEn: "Zymna Voda",
          link: "zymna-voda.html" 
        },
        geometry: {
          type: "Point",
          coordinates: [23.8756375, 49.79] // Further south
        }
      },
      {
        type: "Feature",
        properties: { 
          nameUa: "Дрогобич",
          nameEn: "Drohobych",
          link: "drohobych.html" 
        },
        geometry: {
          type: "Point",
          coordinates: [23.51006, 49.35316]
        }
      }
    ]
  };

  // Custom city labels
  const lvivCities = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { 
          nameUa: "Львів",
          nameEn: "Lviv",
          size: "large" 
        },
        geometry: {
          type: "Point",
          coordinates: [24.0316, 49.8419]
        }
      },
      {
        type: "Feature",
        properties: { 
          nameUa: "Рясне",
          nameEn: "Riasne",
          size: "medium" 
        },
        geometry: {
          type: "Point",
          coordinates: [23.9123375, 49.877912] // Moved slightly east and north
        }
      },
      {
        type: "Feature",
        properties: { 
          nameUa: "Підрясне",
          nameEn: "Pidryasne",
          size: "medium" 
        },
        geometry: {
          type: "Point",
          coordinates: [23.874802, 49.8538035] // Moved west and south
        }
      },
      {
        type: "Feature",
        properties: { 
          nameUa: "Зимна Вода",
          nameEn: "Zymna Voda",
          size: "medium" 
        },
        geometry: {
          type: "Point",
          coordinates: [23.8756375, 49.816705] // Moved slightly south
        }
      },
      {
        type: "Feature",
        properties: { 
          nameUa: "Дрогобич",
          nameEn: "Drohobych",
          size: "medium" 
        },
        geometry: {
          type: "Point",
          coordinates: [23.51006, 49.35316]
        }
      }
    ]
  };

  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp01 = (v) => Math.max(0, Math.min(1, v));

  let animationLocked = false;

  map.on("load", () => {
    // Remove fog/atmosphere effects
    if (map.setFog) {
      map.setFog(null);
    }

    // Hide all built-in labels from the map
    const style = map.getStyle();
    if (style && style.layers) {
      style.layers.forEach(layer => {
        if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
          map.setLayoutProperty(layer.id, 'visibility', 'none');
        }
        // Hide atmosphere/sky layers
        if (layer.type === 'sky' || layer.id === 'sky') {
          map.setLayoutProperty(layer.id, 'visibility', 'none');
        }
      });
    }

    // Don't filter layers for satellite view - we want to see the Earth imagery
    // Layer filtering will happen when we switch to light style for Lviv

    // Add warehouses (initially hidden during globe view)
    map.addSource("warehouses", {
      type: "geojson",
      data: warehouses
    });

    map.addLayer({
      id: "warehouses-layer",
      type: "circle",
      source: "warehouses",
      paint: {
        "circle-radius": 4,
        "circle-color": "#ff6b6b",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
        "circle-opacity": 0, // Hidden during globe view
        "circle-stroke-opacity": 0 // Hidden during globe view
      }
    });

    // Click on warehouse to navigate to project page
    map.on("click", "warehouses-layer", (e) => {
      const feature = e.features[0];
      const link = feature.properties.link;
      if (link) {
        window.location.href = getPageInCurrentLanguage(link);
      }
    });

    map.on("mouseenter", "warehouses-layer", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "warehouses-layer", () => {
      map.getCanvas().style.cursor = "";
    });

    // Add custom HTML labels for warehouses
    const warehouseLabels = [];
    const mapContainer = document.querySelector('.hero-map-wrapper') || document.getElementById('hero');
    
    warehouses.features.forEach((feature) => {
      const coords = feature.geometry.coordinates;
      const name = getWarehouseName(feature.properties.nameUa, feature.properties.nameEn);
      
      // Determine label position based on warehouse name (use Ukrainian for consistency)
      const isLeftSide = feature.properties.nameUa === "Підрясне" || feature.properties.nameUa === "Дрогобич";
      
      // Create label element
      const label = document.createElement('div');
      label.className = 'warehouse-label' + (isLeftSide ? ' warehouse-label-left' : ' warehouse-label-right');
      label.textContent = name;
      label.dataset.lng = coords[0];
      label.dataset.lat = coords[1];
      label.style.opacity = '0'; // Hidden during globe view
      label.style.pointerEvents = 'none'; // Disable clicks during globe view
      
      // Add click handler
      label.addEventListener('click', () => {
        if (feature.properties.link) {
          window.location.href = getPageInCurrentLanguage(feature.properties.link);
        }
      });
      
      mapContainer.appendChild(label);
      warehouseLabels.push(label);
    });
    
    // Function to update label positions
    function updateLabelPositions() {
      warehouseLabels.forEach((label) => {
        const lng = parseFloat(label.dataset.lng);
        const lat = parseFloat(label.dataset.lat);
        const point = map.project([lng, lat]);
        
        label.style.left = point.x + 'px';
        label.style.top = point.y + 'px';
      });
    }
    
    // Update positions on map move
    map.on('move', updateLabelPositions);
    map.on('zoom', updateLabelPositions);
    
    // Initial position update
    updateLabelPositions();

    // Disable all navigation
    map.scrollZoom.disable();
    map.boxZoom.disable();
    map.dragPan.disable();
    map.dragRotate.disable();
    map.keyboard.disable();
    map.doubleClickZoom.disable();
    map.touchZoomRotate.disable();

    // Automatic animation on page load
    const animationDuration = 4000; // 4 seconds
    const startTime = Date.now();
    let animationComplete = false;
    let hasTransitionedStyle = false;

    function animateCamera() {
      if (animationComplete) return;
      
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // Ease-in-out cubic function for smooth animation
      const t = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      // Switch to light style at 60% progress
      if (progress >= 0.6 && !hasTransitionedStyle) {
        hasTransitionedStyle = true;
        map.setStyle("mapbox://styles/mapbox/light-v11");
        
        // Re-add warehouse markers after style change
        map.once('styledata', () => {
          // Remove fog for cleaner Lviv view
          if (map.setFog) {
            map.setFog(null);
          }
          
          // Hide all built-in labels from the light style
          const style = map.getStyle();
          if (style && style.layers) {
            style.layers.forEach(layer => {
              if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
                map.setLayoutProperty(layer.id, 'visibility', 'none');
              }
            });
          }
          
          if (!map.getSource('warehouses')) {
            map.addSource("warehouses", {
              type: "geojson",
              data: warehouses
            });
          }
          
          if (!map.getLayer('warehouse-circles')) {
            map.addLayer({
              id: "warehouse-circles",
              type: "circle",
              source: "warehouses",
              paint: {
                "circle-radius": 4,
                "circle-color": "#FF0000",
                "circle-stroke-width": 2,
                "circle-stroke-color": "#FFFFFF",
                "circle-opacity": 1, // Show immediately when style loads
                "circle-stroke-opacity": 1 // Show immediately when style loads
              }
            });
            
            // Click on warehouse to navigate to project page
            map.on("click", "warehouse-circles", (e) => {
              const feature = e.features[0];
              const link = feature.properties.link;
              if (link) {
                window.location.href = getPageInCurrentLanguage(link);
              }
            });

            map.on("mouseenter", "warehouse-circles", () => {
              map.getCanvas().style.cursor = "pointer";
            });
            map.on("mouseleave", "warehouse-circles", () => {
              map.getCanvas().style.cursor = "";
            });
          }
          
          // Show labels immediately when style loads
          warehouseLabels.forEach(label => {
            label.style.opacity = '1';
            label.style.pointerEvents = 'auto';
          });
        });
      }
      
      // Interpolate camera position
      const centerLng = lerp(cameraStart.center[0], cameraEnd.center[0], t);
      const centerLat = lerp(cameraStart.center[1], cameraEnd.center[1], t);
      const zoom = lerp(cameraStart.zoom, cameraEnd.zoom, t);
      const pitch = lerp(cameraStart.pitch, cameraEnd.pitch, t);
      const bearing = lerp(cameraStart.bearing, cameraEnd.bearing, t);

      map.jumpTo({
        center: [centerLng, centerLat],
        zoom,
        pitch,
        bearing,
        animate: false
      });

      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      } else {
        // Animation complete - lock to Lviv bounds
        animationComplete = true;
        map.setMaxBounds(lvivBounds);
        map.setMinZoom(cameraEnd.zoom);
        map.setMaxZoom(cameraEnd.zoom);
        map.jumpTo({
          center: cameraEnd.center,
          zoom: cameraEnd.zoom,
          pitch: cameraEnd.pitch,
          bearing: cameraEnd.bearing,
          animate: false
        });
      }
    }

    // Start animation
    animateCamera();
  });
})();
