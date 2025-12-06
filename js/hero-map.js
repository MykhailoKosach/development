// ================================
// HERO MAP MODULE
// Scroll-driven globe → Lviv region animation
// ================================

(function () {
  // Only run map on desktop (>768px)
  if (window.innerWidth <= 768) {
    return; // Exit early on mobile
  }

  mapboxgl.accessToken = "pk.eyJ1IjoibXlraGFpbG9rb3NhY2giLCJhIjoiY21pdWQ0NXhhMGh5MjNlcjR1dHAxdW9sbCJ9.6bpb1fGFi-m5SR7oDuMFtQ";

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/light-v11",
    projection: "globe",
    center: [0, 20],
    zoom: 1.4,
    pitch: 0,
    bearing: 0,
    antialias: true
  });

  // Camera states
  const cameraStart = {
    center: [0, 20],
    zoom: 1.4,
    pitch: 0,
    bearing: 0
  };

  const cameraEnd = {
    center: [24.25, 49.75],
    zoom: 7.2,
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
          coordinates: [23.9123375, 49.877912] // Moved slightly east and north
        }
      },
      {
        type: "Feature",
        properties: { name: "Підрясне", link: "riasne.html" },
        geometry: {
          type: "Point",
          coordinates: [23.874802, 49.8538035] // Moved west and south
        }
      },
      {
        type: "Feature",
        properties: { name: "Зимна Вода", link: "zymna-voda.html" },
        geometry: {
          type: "Point",
          coordinates: [23.8756375, 49.816705] // Moved slightly south
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
    // Minimal style: white background, only borders
    if (map.setFog) {
      map.setFog(null);
    }

    const style = map.getStyle();
    const layers = style.layers || [];

    const backgroundLayer = layers.find(l => l.type === "background");
    if (backgroundLayer) {
      map.setPaintProperty(backgroundLayer.id, "background-color", "#ffffff");
    }

    // Keep only border layers
    const keepLayers = [
      "admin-0-boundary",
      "admin-0-boundary-disputed",
      "admin-1-boundary"
    ];

    layers.forEach(layer => {
      if (layer.type === "background") return;
      if (!keepLayers.includes(layer.id)) {
        try {
          map.setLayoutProperty(layer.id, "visibility", "none");
        } catch (e) {}
      }
    });

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
        "circle-radius": 6,
        "circle-color": "#ff6b6b",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff"
      }
    });

    // Add warehouse labels directly next to markers
    map.addLayer({
      id: "warehouses-labels",
      type: "symbol",
      source: "warehouses",
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
        "text-size": 14,
        "text-offset": [0, -1.5],
        "text-anchor": "bottom"
      },
      paint: {
        "text-color": "#111111",
        "text-halo-color": "#ffffff",
        "text-halo-width": 2
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

    // Add city labels
    map.addSource("lviv-cities", {
      type: "geojson",
      data: lvivCities
    });

    map.addLayer({
      id: "lviv-cities-layer",
      type: "symbol",
      source: "lviv-cities",
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-size": [
          "match",
          ["get", "size"],
          "large",
          18,
          "medium",
          13,
          12
        ],
        "text-offset": [0, 0.8],
        "text-anchor": "top"
      },
      paint: {
        "text-color": "#111111"
      }
    });

    // Disable all navigation
    map.scrollZoom.disable();
    map.boxZoom.disable();
    map.dragPan.disable();
    map.dragRotate.disable();
    map.keyboard.disable();
    map.doubleClickZoom.disable();
    map.touchZoomRotate.disable();

    // Wheel-driven animation on hero section only
    let progress = 0;
    const animationSpeed = 0.0008; // Slower animation
    const hero = document.getElementById("hero");
    let canScroll = false;

    function updateCamera() {
      if (!animationLocked && progress < 1) {
        const t = clamp01(progress);
        
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

        if (progress >= 0.98) {
          animationLocked = true;
          
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
          
          // Enable scrolling after 1.5 second delay
          setTimeout(() => {
            canScroll = true;
          }, 1500);
        }
      }
    }

    // Handle wheel events only when hero is in view
    window.addEventListener('wheel', (e) => {
      const heroRect = hero.getBoundingClientRect();
      const isHeroVisible = heroRect.top <= 0 && heroRect.bottom > 0;
      
      if (isHeroVisible && !animationLocked && window.scrollY === 0) {
        e.preventDefault();
        progress += Math.abs(e.deltaY) * animationSpeed;
        progress = Math.min(progress, 1);
        updateCamera();
      } else if (isHeroVisible && animationLocked && !canScroll) {
        // Prevent scroll until delay passes
        e.preventDefault();
      }
    }, { passive: false });

    // Handle touch events for mobile
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
      const heroRect = hero.getBoundingClientRect();
      const isHeroVisible = heroRect.top <= 0 && heroRect.bottom > 0;
      if (isHeroVisible && window.scrollY === 0) {
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      const heroRect = hero.getBoundingClientRect();
      const isHeroVisible = heroRect.top <= 0 && heroRect.bottom > 0;
      
      if (isHeroVisible && !animationLocked && window.scrollY === 0) {
        e.preventDefault();
        const touchY = e.touches[0].clientY;
        const delta = touchStartY - touchY;
        progress += Math.abs(delta) * animationSpeed * 0.5;
        progress = Math.min(progress, 1);
        touchStartY = touchY;
        updateCamera();
      } else if (isHeroVisible && animationLocked && !canScroll) {
        e.preventDefault();
      }
    }, { passive: false });

    requestAnimationFrame(updateCamera);
  });
})();
