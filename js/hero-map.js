// ================================
// HERO MAP MODULE
// Scroll-driven globe → Lviv region animation
// ================================

(function () {
  // Only run map on desktop (>768px)
  if (window.innerWidth <= 768) {
    return; // Exit early on mobile
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
        properties: { name: "Рясне", link: "riasne.html" },
        geometry: {
          type: "Point",
          coordinates: [23.95, 49.89] // Further north-east
        }
      },
      {
        type: "Feature",
        properties: { name: "Підрясне", link: "riasne.html" },
        geometry: {
          type: "Point",
          coordinates: [23.84, 49.84] // Further south-west
        }
      },
      {
        type: "Feature",
        properties: { name: "Зимна Вода", link: "zymna-voda.html" },
        geometry: {
          type: "Point",
          coordinates: [23.8756375, 49.79] // Further south
        }
      },
      {
        type: "Feature",
        properties: { name: "Дрогобич", link: "zymna-voda.html" },
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
        properties: { name: "Львів", size: "large" },
        geometry: {
          type: "Point",
          coordinates: [24.0316, 49.8419]
        }
      },
      {
        type: "Feature",
        properties: { name: "Рясне", size: "medium" },
        geometry: {
          type: "Point",
          coordinates: [23.9123375, 49.877912] // Moved slightly east and north
        }
      },
      {
        type: "Feature",
        properties: { name: "Підрясне", size: "medium" },
        geometry: {
          type: "Point",
          coordinates: [23.874802, 49.8538035] // Moved west and south
        }
      },
      {
        type: "Feature",
        properties: { name: "Зимна Вода", size: "medium" },
        geometry: {
          type: "Point",
          coordinates: [23.8756375, 49.816705] // Moved slightly south
        }
      },
      {
        type: "Feature",
        properties: { name: "Дрогобич", size: "medium" },
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

    // Add warehouses
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
        "circle-stroke-color": "#ffffff"
      }
    });

    // Click on warehouse to navigate to project page
    map.on("click", "warehouses-layer", (e) => {
      const feature = e.features[0];
      const link = feature.properties.link;
      if (link) {
        window.location.href = link;
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
      const name = feature.properties.name;
      
      // Determine label position based on warehouse name
      const isLeftSide = name === "Підрясне" || name === "Дрогобич";
      
      // Create label element
      const label = document.createElement('div');
      label.className = 'warehouse-label' + (isLeftSide ? ' warehouse-label-left' : ' warehouse-label-right');
      label.textContent = name;
      label.dataset.lng = coords[0];
      label.dataset.lat = coords[1];
      
      // Add click handler
      label.addEventListener('click', () => {
        if (feature.properties.link) {
          window.location.href = feature.properties.link;
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

    // Scroll-based animation with locking
    let progress = 0;
    const animationSpeed = 0.0008;
    const hero = document.getElementById("hero");
    let scrollLocked = true;
    let canScrollDown = false;
    let hasTransitionedStyle = false; // Track if we've switched to light style
    
    // Lock body scroll initially
    document.body.style.overflow = 'hidden';

    function updateCamera() {
      const t = clamp01(progress);
      
      // Switch to light style when transitioning to Lviv region (at 60% progress)
      if (t >= 0.6 && !hasTransitionedStyle) {
        map.setStyle("mapbox://styles/mapbox/light-v11");
        hasTransitionedStyle = true;
        
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
                "circle-stroke-color": "#FFFFFF"
              }
            });
          }
        });
        
      } else if (t < 0.6 && hasTransitionedStyle) {
        // Switch back to satellite when scrolling back up
        map.setStyle("mapbox://styles/mapbox/satellite-streets-v12");
        hasTransitionedStyle = false;
        
        // Remove fog when switching back to satellite
        map.once('styledata', () => {
          if (map.setFog) {
            map.setFog(null);
          }
          
          // Hide all built-in labels when returning to satellite style
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
        });
      }
      
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

      if (progress >= 0.98 && scrollLocked) {
        animationLocked = true;
        scrollLocked = false;
        
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
        
        // Unlock scroll after 1.5 second delay
        setTimeout(() => {
          canScrollDown = true;
          document.body.style.overflow = '';
        }, 1500);
      } else if (progress < 0.98 && animationLocked) {
        // Reset if scrolling back
        animationLocked = false;
        scrollLocked = true;
        canScrollDown = false;
        document.body.style.overflow = 'hidden';
        map.setMaxBounds(null);
        map.setMinZoom(0);
        map.setMaxZoom(22);
      }
    }

    // Handle wheel events
    window.addEventListener('wheel', (e) => {
      if (scrollLocked || !canScrollDown) {
        e.preventDefault();
        
        // Update progress based on scroll direction
        if (e.deltaY > 0) {
          // Scrolling down - zoom in
          progress += Math.abs(e.deltaY) * animationSpeed;
        } else {
          // Scrolling up - zoom out
          progress -= Math.abs(e.deltaY) * animationSpeed;
        }
        
        progress = Math.max(0, Math.min(1, progress));
        updateCamera();
      }
    }, { passive: false });

    // Handle touch events for mobile
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (scrollLocked || !canScrollDown) {
        e.preventDefault();
        const touchY = e.touches[0].clientY;
        const delta = touchStartY - touchY;
        
        if (delta > 0) {
          // Scrolling down
          progress += Math.abs(delta) * animationSpeed * 0.5;
        } else {
          // Scrolling up
          progress -= Math.abs(delta) * animationSpeed * 0.5;
        }
        
        progress = Math.max(0, Math.min(1, progress));
        touchStartY = touchY;
        updateCamera();
      }
    }, { passive: false });

    updateCamera();
  });
})();
