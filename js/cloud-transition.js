/**
 * Cloud Transition Overlay Utility
 * 
 * Provides a smooth cloud animation overlay during Mapbox style/projection transitions.
 * Works with both globe and Mercator projections.
 */

(function() {
  'use strict';

/**
 * @typedef {Object} CloudTransitionOptions
 * @property {number} [fadeInMs=1200] - Duration of fade-in animation
 * @property {number} [holdMs=400] - Duration to hold at full opacity
 * @property {number} [fadeOutMs=1200] - Duration of fade-out animation
 * @property {number} [swapDelayPct=0.5] - When to trigger swap (0-1, as percentage of fadeIn)
 */

/**
 * Execute a map style/projection swap with cloud transition overlay
 * 
 * @param {HTMLElement} cloudsEl - The cloud overlay element
 * @param {Function} swap - Async function that performs the map swap
 * @param {Object} [map] - Optional Mapbox map instance for 'idle' event listening
 * @param {CloudTransitionOptions} [opts] - Transition timing options
 * @returns {Promise<void>}
 * 
 * @example
 * const overlay = document.getElementById('cloud-transition');
 * await withCloudTransition(
 *   overlay,
 *   () => map.setStyle('mapbox://styles/mapbox/light-v11'),
 *   map,
 *   { fadeInMs: 1000, holdMs: 300 }
 * );
 */
async function withCloudTransition(
  cloudsEl,
  swap,
  map = null,
  opts = {}
) {
  // Default options
  const options = {
    fadeInMs: 1200,
    holdMs: 400,
    fadeOutMs: 1200,
    swapDelayPct: 0.5,
    ...opts
  };

  // Guard against concurrent transitions
  if (cloudsEl.dataset.transitioning === 'true') {
    console.warn('Cloud transition already in progress, skipping...');
    return;
  }

  cloudsEl.dataset.transitioning = 'true';

  try {
    // Phase 1: Fade in clouds
    cloudsEl.classList.add('active');
    
    // Wait for partial fade-in before swapping
    const swapDelay = options.fadeInMs * options.swapDelayPct;
    await sleep(swapDelay);

    // Phase 2: Execute the swap while covered by clouds
    await Promise.resolve(swap());

    // Phase 3: Wait for map to settle
    if (map && map.once) {
      // Prefer waiting for map idle event
      await Promise.race([
        new Promise(resolve => map.once('idle', resolve)),
        sleep(2000) // Fallback timeout
      ]);
    } else {
      // Conservative wait if no map instance
      await sleep(options.holdMs);
    }

    // Phase 4: Fade out clouds
    cloudsEl.classList.remove('active');
    await sleep(options.fadeOutMs);

  } finally {
    cloudsEl.dataset.transitioning = 'false';
  }
}

/**
 * Helper function for promise-based delays
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Initialize cloud transition overlay in the DOM
 * Call this once when your app loads
 * 
 * @param {string} [containerId='hero'] - ID of the map container element
 * @returns {HTMLElement} The created overlay element
 * 
 * @example
 * const overlay = initCloudOverlay('hero');
 */
function initCloudOverlay(containerId = 'hero') {
  const container = document.getElementById(containerId);
  
  if (!container) {
    console.error(`Container #${containerId} not found`);
    return null;
  }

  // Ensure container is relatively positioned
  const computedStyle = window.getComputedStyle(container);
  if (computedStyle.position === 'static') {
    container.style.position = 'relative';
  }

  // Check if overlay already exists
  let overlay = document.getElementById('cloud-transition');
  
  if (!overlay) {
    // Create overlay structure
    overlay = document.createElement('div');
    overlay.id = 'cloud-transition';
    overlay.dataset.transitioning = 'false';

    const inner = document.createElement('div');
    inner.className = 'cloud-inner';

    const vignette = document.createElement('div');
    vignette.className = 'cloud-vignette';

    inner.appendChild(vignette);
    overlay.appendChild(inner);

    // Insert before map element but inside container
    const mapEl = container.querySelector('#map, .mapboxgl-map');
    if (mapEl) {
      container.insertBefore(overlay, mapEl);
    } else {
      container.appendChild(overlay);
    }
  }

  return overlay;
}

/**
 * Expose to window for vanilla JS usage
 */
window.CloudTransition = {
  withCloudTransition,
  initCloudOverlay
};

})(); // End IIFE
