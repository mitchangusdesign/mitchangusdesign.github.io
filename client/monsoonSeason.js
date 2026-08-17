
/**
 * Cache manager for Google Sheets data
 */
class SheetCacheManager {
  constructor(cacheKey = 'sheet_data', cacheDuration = 5 * 60 * 1000) {
    this.cacheKey = cacheKey;
    this.cacheDuration = cacheDuration; // 5 minutes default
  }

  /**
   * Gets cached data if still valid
   * @returns {Array|null} Cached data or null
   */
  get() {
    const cached = localStorage.getItem(this.cacheKey);
    if (!cached) return null;

    try {
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();

      if (now - timestamp < this.cacheDuration) {
        return data;
      }

      // Cache expired
      this.clear();
      return null;
    } catch (error) {
      console.error('Error reading cache:', error);
      this.clear();
      return null;
    }
  }

  /**
   * Saves data to cache
   * @param {Array} data - Data to cache
   */
  set(data) {
    const cacheObject = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(this.cacheKey, JSON.stringify(cacheObject));
  }

  /**
   * Clears the cache
   */
  clear() {
    localStorage.removeItem(this.cacheKey);
  }
}

/**
 * Gallery Manager - Handles image gallery and lightbox functionality
 */
class GalleryManager {
  constructor() {
    this.images = [];
    this.currentIndex = 0;
    this.lightbox = document.getElementById('gallery-lightbox');
    this.lightboxImage = document.getElementById('lightbox-image');
    this.lightboxTitle = document.getElementById('lightbox-title');
    this.lightboxCounter = document.getElementById('lightbox-counter');
    this.lightboxCaption = document.getElementById('lightbox-caption');
    this.galleryContainer = document.getElementById('gallery-container');
    
    // Touch/swipe tracking
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.swipeThreshold = 50;
    
    this.setupEventListeners();
  }

  /**
   * Discover and initialize gallery images from Google Sheet
   * @param {Array} galleryData - Array of gallery items from the sheet
   */
  async init(galleryData) {
    if (!galleryData || galleryData.length === 0) {
      console.warn('No gallery data provided');
      return;
    }

    // Map the gallery sheet data to image objects
    // Sheet columns: id, title, caption, img_url
    this.images = galleryData.map((item, index) => ({
      src: item.img_url,
      name: item.title || `Image ${index + 1}`,
      alt: item.caption || item.title || `Gallery image ${index + 1}`,
      title: item.title || '',
      description: item.caption || ''
    }));

    this.renderThumbnails();
  }

  /**
   * Render gallery thumbnails
   */
  renderThumbnails() {
    if (!this.galleryContainer || this.images.length === 0) return;

    this.galleryContainer.innerHTML = '';

    this.images.forEach((image, index) => {
      const button = document.createElement('button');
      button.className = 'gallery-item';
      button.setAttribute('data-index', index);
      button.setAttribute('aria-label', `View image ${index + 1} of ${this.images.length}: ${image.name}`);
      
      const img = document.createElement('img');
      img.src = image.src;
      img.alt = image.alt;
      img.loading = 'lazy';

      const overlay = document.createElement('div');
      overlay.className = 'gallery-item-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      // overlay.textContent = 'View';

      button.appendChild(img);
      button.appendChild(overlay);

      button.addEventListener('click', () => this.openLightbox(index));
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openLightbox(index);
        }
      });

      this.galleryContainer.appendChild(button);
    });
  }

  /**
   * Open lightbox at specified index
   * @param {number} index - Image index to display
   */
  openLightbox(index) {
    this.currentIndex = index;
    this.updateLightboxImage();
    this.lightbox.showModal?.() || this.lightbox.setAttribute('open', '');
    this.lightboxImage.focus?.();
    document.body.style.overflow = 'hidden';
    document.querySelector('.lightbox-container').style.display = 'flex';
  }

  /**
   * Close lightbox
   */
  closeLightbox() {
    this.lightbox.close?.() || this.lightbox.removeAttribute('open');
    document.body.style.overflow = '';
    document.querySelector('.lightbox-container').style.display = 'none';

    // Restore focus to the thumbnail that was clicked
    const thumbnail = this.galleryContainer.querySelector(`[data-index="${this.currentIndex}"]`);
    thumbnail?.focus();
  }

  /**
   * Update lightbox image and counter
   */
  updateLightboxImage() {
    const image = this.images[this.currentIndex];
    if (!image) return;

    this.lightboxImage.src = image.src;
    this.lightboxImage.alt = image.alt;
    this.lightboxTitle.textContent = image.title || '';
    this.lightboxCounter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
    this.lightboxCaption.textContent = image.description || '';
  }

  /**
   * Navigate to next image
   */
  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateLightboxImage();
  }

  /**
   * Navigate to previous image
   */
  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateLightboxImage();
  }

  /**
   * Handle touch start for swipe detection
   */
  handleTouchStart(e) {
    this.touchStartX = e.changedTouches[0].screenX;
  }

  /**
   * Handle touch end for swipe detection
   */
  handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].screenX;
    this.handleSwipe();
  }

  /**
   * Process swipe gesture
   */
  handleSwipe() {
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > this.swipeThreshold) {
      if (diff > 0) {
        this.nextImage();
      } else {
        this.prevImage();
      }
    }
  }

  /**
   * Setup event listeners for lightbox controls
   */
  setupEventListeners() {
    // Close button
    const closeBtn = document.getElementById('lightbox-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeLightbox());
    }

    // Close lightbox on Escape key
    const parentDialog = document.querySelector('#gallery-lightbox');

    parentDialog.addEventListener('cancel', (event) => this.closeLightbox());

    // Next/Prev buttons
    const nextBtn = document.getElementById('lightbox-next');
    const prevBtn = document.getElementById('lightbox-prev');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextImage());
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prevImage());
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.lightbox || (!this.lightbox.open && !this.lightbox.hasAttribute('open'))) return;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          this.nextImage();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          this.prevImage();
          break;
        case 'Escape':
          e.preventDefault();
          this.closeLightbox();
          break;
      }
    });

    // Touch swipe support
    if (this.lightbox) {
      this.lightbox.addEventListener('touchstart', (e) => this.handleTouchStart(e));
      this.lightbox.addEventListener('touchend', (e) => this.handleTouchEnd(e));
    }

    // Click outside to close (on the dialog backdrop)
    this.lightbox?.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.closeLightbox();
      }
    });
  }
}

// Initialize gallery manager globally
const galleryManager = new GalleryManager();

/**
 * Configuration for multiple sheets
 */
const SHEETS_CONFIG = {
  hours: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTJZUvgRybPLiD98BBn7rBYo2hx0TbAhaVWRm8m0pjBp4YB26L5bJQZ-pUHCJ9sTwXBxNHe6aJiaktU/pub?gid=0&single=true&output=csv',
  menu: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSxs4pLhJuuKlpD0vzjG9X2hQ2FPI7HuAOXv0Ml4A5fcqdvz4Tp8m7BPRueWv2kkGKWxMk8ln0d4QNv/pub?gid=0&single=true&output=csv',
  gallery: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSXFvAt_CSOBPGCiu2U_N7MeXnJ_k99esxRgc5ffpgUVF0uYWldxaUpUiQmrhSyAAa6hZWJO2FsaU97/pub?gid=0&single=true&output=csv'
};

/**
 * Fetches data from multiple sheets
 * @param {Object} config - Configuration object with sheet URLs
 * @returns {Promise<Object>} Object with data from all sheets
 */
async function fetchAllSheets(config) {
  const cache = new SheetCacheManager('sheet_data', 5 * 60 * 1000); // 5 minute cache
  const results = {};

  // Check if we have cached data
  const cachedData = cache.get();
  if (cachedData && cachedData.hours && cachedData.hours.length > 0 && cachedData.menu && cachedData.menu.length > 0) {
    return cachedData;
  }

  const promises = Object.entries(config).map(async ([key, url]) => {
    try {
      const data = await fetchGoogleSheetData(url);
      results[key] = data;
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      results[key] = [];
    }
  });

  await Promise.all(promises);
  
  // Only cache if we have valid data
  if (results.hours && results.hours.length > 0 && results.menu && results.menu.length > 0) {
    console.log('Caching new data');
    cache.set(results);
  } else {
    console.warn('Data fetch incomplete, not caching empty results');
  }
  
  return results;
}

/**
 * Fetches and parses CSV data from Google Sheets
 * @param {string} csvUrl - The published CSV URL from Google Sheets
 * @returns {Promise<Array>} Array of objects representing rows
 */
async function fetchGoogleSheetData(csvUrl) {
  try {
    const response = await fetch(csvUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error fetching Google Sheet data:', error);
    return [];
  }
}

/**
 * Parses CSV text into an array of objects
 * @param {string} csvText - Raw CSV text
 * @returns {Array} Array of objects
 */
function parseCSV(csvText) {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue; // Skip empty lines

    const values = parseCSVLine(lines[i]);
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ? values[index].trim() : '';
    });

    data.push(row);
  }

  return data;
}

/**
 * Parses a single CSV line, handling quoted values
 * @param {string} line - Single CSV line
 * @returns {Array} Array of values
 */
function parseCSVLine(line) {
  const values = [];
  let currentValue = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      values.push(currentValue);
      currentValue = '';
    } else {
      currentValue += char;
    }
  }

  values.push(currentValue); // Push the last value
  return values;
}

/**
 * Renders hours data as a table
 * @param {Array} data - Array of hours data objects
 * @param {string} containerId - ID of the container element
 */
function renderHours(data, containerId) {
  const container = document.getElementById(containerId);

  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return;
  }

  container.innerHTML = ''; // Clear existing content

  if (data.length === 0) {
    showEmptyState(containerId);
    return;
  }
  const sectionTitle = document.createElement('h2');
    sectionTitle.className = 'menu-section-title';
    sectionTitle.textContent = 'Hours';
    container.appendChild(sectionTitle);
  // Create table
  const table = document.createElement('table');
  table.className = 'hours-table';

  // Create header row
  // if (data.length > 0) {
  //   const headerRow = document.createElement('tr');
  //   const keys = Object.keys(data[0]);
  //   // Skip the first column (id)
  //   keys.slice(1).forEach(key => {
  //     const th = document.createElement('th');
  //     th.textContent = key;
  //     headerRow.appendChild(th);
  //   });
  //   table.appendChild(headerRow);
  // }

  // Create data rows
  data.forEach(item => {
    const row = document.createElement('tr');
    const values = Object.values(item);
    // Skip the first column (id)
    values.slice(1).forEach(value => {
      const td = document.createElement('td');
      td.textContent = value;
      row.appendChild(td);
    });
    table.appendChild(row);
  });

  container.appendChild(table);
}

/**
 * Renders menu data with tabs for each category
 * @param {Array} data - Array of menu data objects
 * @param {string} containerId - ID of the container element
 */
function renderMenu(data, containerId) {
  const container = document.getElementById(containerId);

  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return;
  }

  container.innerHTML = ''; // Clear existing content

  if (data.length === 0) {
    showEmptyState(containerId);
    return;
  }

  // Group data by category
  const categories = {};
  data.forEach(item => {
    const category = item.category || 'Uncategorized';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(item);
  });

  // Create tab container
  const tabContainer = document.createElement('div');
  tabContainer.className = 'tab-container';

  // Create tab buttons
  const tabButtons = document.createElement('div');
  tabButtons.className = 'tab-buttons';

  // Create tab content
  const tabContent = document.createElement('div');
  tabContent.className = 'tab-content';

  let firstTab = true;
  Object.keys(categories).forEach(category => {
    // Tab button
    const button = document.createElement('button');
    button.className = 'tab-button';
    button.textContent = category;
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      tabButtons.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      button.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
      });
      // Add active class to clicked button
      button.classList.add('active');
      // Hide all tab panes
      tabContent.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
      // Show corresponding tab pane
      const pane = tabContent.querySelector(`[data-category="${category}"]`);
      if (pane) pane.classList.add('active');
      pane.scrollIntoView({
        block: 'start'
      });
    });
    tabButtons.appendChild(button);

    // Tab pane
    const pane = document.createElement('div');
    pane.className = 'tab-pane';
    pane.setAttribute('data-category', category);
    const menuSectionTitle = document.createElement('h2');
    menuSectionTitle.className = 'menu-section-title';
    menuSectionTitle.textContent = category;
    pane.appendChild(menuSectionTitle);

    categories[category].forEach(item => {
      const card = createMenuCard(item);
      pane.appendChild(card);
    });

    tabContent.appendChild(pane);

    // Pane Nav buttons
    const ltNavBtn = document.createElement('button');
    ltNavBtn.className = 'nav-btn';
    ltNavBtn.id = 'nav-l';
    ltNavBtn.innerHTML = `<?xml version="1.0" encoding="UTF-8"?>
      <svg xmlns="http://w3.org" viewBox="0 0 10.21 35.36">
        <defs>
          <style>
            .cls-2 { isolation: isolate; }
            .cls-3 { fill: #f2f2f2; }
            .cls-4 { fill: #ccc; }
            .cls-5 { fill: #b3b3b3; }
            .shader-style { mix-blend-mode: multiply; opacity: 0.5; }
          </style>
        </defs>
        <g class="cls-2">
          <g id="Layer_2">
            <g id="LeftChevron">
              <!-- The color layer stays fully opaque as the base -->
              <polygon id="colorLayer" class="cls-1" points="10.21 0 0 17.68 10.21 35.36 9.67 17.68 10.21 0"/>
              
              <!-- Individual shaders now have blending/opacity applied directly -->
              <g id="shader">
                <polygon id="bottomLeft" class="cls-4 shader-style" points="7.21 17.68 10.21 35.36 0 17.68 7.21 17.68"/>
                <polygon id="topLeft" class="cls-3 shader-style" points="0 17.68 10.21 0 7.21 17.68 0 17.68"/>
                <polygon id="bottomRight" class="cls-5 shader-style" points="7.21 17.68 10.21 35.36 9.67 17.68 7.21 17.68"/>
                <polygon id="topRight" class="cls-4 shader-style" points="7.21 17.68 10.21 0 9.67 17.68 7.21 17.68"/>
              </g>
            </g>
          </g>
        </g>
      </svg>
      `;
    ltNavBtn.addEventListener('click', () => {
      prev();
    });
    const rtNavBtn = document.createElement('button');
    rtNavBtn.className = 'nav-btn';
    rtNavBtn.id = 'nav-r';
    rtNavBtn.innerHTML = `<?xml version="1.0" encoding="UTF-8"?>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.21 35.36">
      <defs>
        <style>
          .cls-2 { isolation: isolate; }
          .cls-3 { fill: #f2f2f2; }
          .cls-4 { fill: #ccc; }
          .cls-5 { fill: #b3b3b3; }
          .shader-style { mix-blend-mode: multiply; opacity: 0.5; }
        </style>
      </defs>
      <g class="cls-2">
        <g id="Layer_2">
          <g id="RightChevron">
            <polygon id="colorLayer" class="cls-1" points="0 0 10.21 17.68 0 35.36 .54 17.68 0 0"/>
            <g id="shader">
              <polygon id="bottomRight" class="cls-4 shader-style" points="3 17.68 0 35.36 10.21 17.68 3 17.68"/>
              <polygon id="topRight" class="cls-3 shader-style" points="10.21 17.68 0 0 3 17.68 10.21 17.68"/>
              <polygon id="bottomLeft" class="cls-5 shader-style" points="3 17.68 0 35.36 .54 17.68 3 17.68"/>
              <polygon id="topLeft" class="cls-4 shader-style" points="3 17.68 0 0 .54 17.68 3 17.68"/>
            </g>
          </g>
        </g>
      </g>
    </svg>`;
    rtNavBtn.addEventListener('click', () => {
      next();
    });
    pane.appendChild(ltNavBtn);
    pane.appendChild(rtNavBtn);
    if (firstTab) {
      button.classList.add('active');
      pane.classList.add('active');
      firstTab = false;
    }
  });

  tabContainer.appendChild(tabButtons);
  tabContainer.appendChild(tabContent);
  container.appendChild(tabContainer);

  // Swipe Navigation
    const tabsWrapper = document.querySelector('.tab-content');
    // const tabButtons = document.querySelectorAll('.no-buttons-made'); //keeping in case I add buttons later
    let startX = 0;
    let dist = 0;
    const threshold = 100; // Minimum distance for a swipe to be registered

    function next() {
        let mtablinks = document.querySelector(".tab-button.active");
        let mtabcontents = document.querySelector(".tab-pane.active");
        // Get the next element sibling
        const nextSiblingTitle = mtablinks.nextElementSibling;
        const nextSiblingElement = mtabcontents.nextElementSibling;
        console.log("nextSiblingTitle:", nextSiblingTitle);
        // Check if a next sibling element exists and then get its ID
        if (nextSiblingElement && nextSiblingTitle) {

                mtablinks.classList.remove("active");
                mtabcontents.classList.remove("active");
                nextSiblingTitle.classList.add("active");
                nextSiblingTitle.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                  });
                nextSiblingElement.classList.add("active");
                nextSiblingElement.scrollIntoView({
                    block: 'start'
                  });

            // console.log("ID of the next title sibling:", nextSiblingTitleId);
            } else {
            console.log("No next element sibling found.");
        };
    };
    function prev() {
        let mtablinks = document.querySelector(".tab-button.active");
        let mtabcontents = document.querySelector(".tab-pane.active");
        // Get the previous element sibling
        const previousSiblingTitle = mtablinks.previousElementSibling;
        const previousSiblingElement = mtabcontents.previousElementSibling;

        // Check if a previous sibling element exists and then get its ID
        if (previousSiblingElement && previousSiblingTitle) {

                mtablinks.classList.remove("active");
                mtabcontents.classList.remove("active");
                previousSiblingTitle.classList.add("active");
                previousSiblingTitle.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                  });
                previousSiblingElement.classList.add("active");
                previousSiblingElement.scrollIntoView({
                    block: 'start'
                  });

            // console.log("ID of the previous title sibling:", previousSiblingTitleId);
            } else {
            console.log("No previous element sibling found.");
        };
    };

    // Touch event handlers for swiping
    tabsWrapper.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    tabsWrapper.addEventListener('touchmove', (e) => {
        dist = e.touches[0].clientX - startX;
    });

    tabsWrapper.addEventListener('touchend', () => {
        if (dist > threshold) {
            // Swiped right
        //   console.log("swiped right");
            prev();
        } else if (dist < -threshold) {
            // Swiped left
        //   console.log("swiped left");
            next();
        }

        // Reset values
        dist = 0;
        startX = 0;
    });
};

/**
 * Creates a card element for a menu item
 * @param {Object} item - Menu item object
 * @returns {HTMLElement} Card element
 */
function createMenuCard(item) {
  const card = document.createElement('div');
  card.className = 'item-wrapper';

  card.innerHTML = `
    <div class="menu-card-content">
      <p class="item-number">${item.id}</p>
      <h3 class="name">${item.name || item.title}</h3>
      <p class="description">${item.description}</p>
      <p class="price">${item.price || ''}</p>
    </div>
  `;

  return card;
}

/**
 * Formats date string
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
}

/**
 * Main initialization function
 */
// async function initializeApp() {
//   try {
//     const allData = await fetchAllSheets(SHEETS_CONFIG);
    
//     if (allData.hours && allData.hours.length > 0) {
//       renderHours(allData.hours, 'hours');
//       checkOpenStatus(allData.hours);
//     } else {
//       console.warn('No hours data available');
//     }

//     if (allData.menu && allData.menu.length > 0) {
//       renderMenu(allData.menu, 'menuList');
//     } else {
//       console.warn('No menu data available');
//     }

//     if (allData.gallery && allData.gallery.length > 0) {
//       renderGallery(allData.gallery, 'gallery');
//     } else {
//       console.warn('No menu data available');
//     }

//     // Initialize gallery - auto-discovers images from ./img/gallery folder
//     await galleryManager.init();
//   } catch (error) {
//     console.error('Error initializing app:', error);
//     showErrorState(error.message, 'hours');
//   } finally {
//     hideLoader();
//   }
// }

function showLoader(containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '<div class="loader">Loading content...</div>';
}

function hideLoader() {
  const loader = document.querySelector('.loader');
  if (loader) loader.remove();
}

function showEmptyState(containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '<div class="empty-state">No content available</div>';
}

function showErrorState(message, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = `<div class="error-state">Error loading content: ${message}</div>`;
}

function checkOpenStatus(data) {
    const now = new Date();
    const day = now.getDay(); 
    let status = document.getElementById("open-close");

    // Validate that status element exists and data is available
    if (!status || !data || data.length === 0) {
        console.warn('Status element or data not available');
        return;
    }

    // Get the row for the current day (data array should be ordered by day)
    if (data[day]) {
        const values = Object.values(data[day]);
        // Get the 3rd column (index 2) which contains the status
        const dayStatus = values[2];

        // Check if the status is "Closed"
        if (dayStatus === "Closed") {
            status.innerHTML = `<a onclick="opentab('hours','hours-link'); return false;"><p>We are closed today!</p><button style="padding:.5rem 1rem; margin-top:1rem; color:var(--tabText); background-color: var(--tabBg)">See Our Hours</button></a>`;
        } else {
            status.innerHTML = `<a onclick="opentab('menu','menu-link'); return false;"><p>We are open today from 11am to 8pm!</p><button style="padding:.5rem 1rem; margin-top:1rem; color:var(--tabText); background-color: var(--tabBg)">See Our Menu</button></a>`;
        }
    }
}



/**
 * Accessibility: Manage navigation menu aria-expanded state
 */
function setupNavigationAccessibility() {
  const navOpenButton = document.getElementById('nav-open-container');
  const navPanel = document.getElementById('nav-panel');
  
  if (!navOpenButton || !navPanel) return;

  // Update aria-expanded when popover opens/closes
  navOpenButton.addEventListener('click', () => {
    setTimeout(() => {
      const isOpen = navPanel.hasAttribute('open');
      navOpenButton.setAttribute('aria-expanded', isOpen);
    }, 0);
  });

  // Handle Escape key to close menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navPanel.hasAttribute('open')) {
      navPanel.hidePopover?.();
      navOpenButton.setAttribute('aria-expanded', 'false');
      navOpenButton.focus();
    }
  });
}

/**
 * Accessibility: Keyboard support for interactive elements
 */
function setupKeyboardNavigation() {
  // Make map button keyboard accessible (already semantic button element)
  const mapButton = document.querySelector('.map-button');
  if (mapButton) {
    mapButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        mapButton.click();
      }
    });
  }

  // Add Enter key support for copyEmail button
  const copyEmailBtn = document.getElementById('copyEmail');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        copyEmailBtn.click();
      }
    });
  }
}

/**
 * Accessibility: Announce tab changes to screen readers
 */
function announceTabChange(tabName) {
  const announcer = document.getElementById('sr-announcer');
  if (announcer) {
    announcer.textContent = `${tabName} tab opened`;
  }
}

/**
 * Enhanced initialization with accessibility setup
 */
async function initializeApp() {
  try {
    console.log('Initializing app...');
    const allData = await fetchAllSheets(SHEETS_CONFIG);

    if (allData.hours && allData.hours.length > 0) {
      renderHours(allData.hours, 'hours');
      checkOpenStatus(allData.hours);
    } else {
      console.warn('No hours data available');
    }

    if (allData.menu && allData.menu.length > 0) {
      renderMenu(allData.menu, 'menuList');
    } else {
      console.warn('No menu data available');
    }

    // Initialize gallery with data from sheet
    if (allData.gallery && allData.gallery.length > 0) {
      await galleryManager.init(allData.gallery);
    } else {
      console.warn('No gallery data available');
    }

    // Setup accessibility features
    setupNavigationAccessibility();
    setupKeyboardNavigation();
  } catch (error) {
    console.error('Error initializing app:', error);
    showErrorState(error.message, 'hours');
  } finally {
    hideLoader();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
