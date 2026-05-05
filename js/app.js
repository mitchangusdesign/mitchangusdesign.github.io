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
 * Renders data to the DOM
 * @param {Array} data - Array of data objects
 * @param {string} containerId - ID of the container element
 */
function renderData(data, containerId) {
  const container = document.getElementById(containerId);

  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return;
  }

  container.innerHTML = ''; // Clear existing content

  data.forEach(item => {
    const card = createCard(item);
    container.appendChild(card);
  });
}

/**
 * Creates a card element for a single data item
 * @param {Object} item - Data object
 * @returns {HTMLElement} Card element
 */
function createCard(item) {
  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <div class="card-image">
      <img src="${item.image_url || 'placeholder.png'}" alt="${item.title}">
    </div>
    <div class="card-content">
      <h3>${item.title}</h3>
      <p class="card-meta">
        <span class="category">${item.category}</span>
        <span class="date">${formatDate(item.date)}</span>
      </p>
      <p class="card-description">${item.description}</p>
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
async function initializeApp() {
  // Replace this with your actual published CSV URL
  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTdAMo8tQkE8--tNrSycYuVEAyaizndtmaEYhiTxdoPJM_LUphtl9pyyYbz1a5tr2TTQ4KI4UyjqmQG/pub?gid=0&single=true&output=csv';

  // Show loading state
  showLoader();

  try {
    const data = await fetchGoogleSheetData(SHEET_URL);

    if (data.length === 0) {
      showEmptyState();
      return;
    }

    renderData(data, 'content-container');
  } catch (error) {
    showErrorState(error.message);
  } finally {
    hideLoader();
  }
}

function showLoader() {
  const container = document.getElementById('content-container');
  container.innerHTML = '<div class="loader">Loading content...</div>';
}

function hideLoader() {
  const loader = document.querySelector('.loader');
  if (loader) loader.remove();
}

function showEmptyState() {
  const container = document.getElementById('content-container');
  container.innerHTML = '<div class="empty-state">No content available</div>';
}

function showErrorState(message) {
  const container = document.getElementById('content-container');
  container.innerHTML = `<div class="error-state">Error loading content: ${message}</div>`;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);