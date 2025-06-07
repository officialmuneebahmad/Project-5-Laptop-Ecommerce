// Configuration
const laptopsPerPage = 12;
let currentPage = 1;
let filteredLaptops = [];
let allProducts = [];

// DOM Elements
const productGrid = document.getElementById('productGrid');
const brandFilters = document.querySelectorAll('.brand-filter');
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');
const searchInput = document.getElementById('search');
const filterToggleBtn = document.getElementById('filterToggleBtn');
const filterSidebar = document.getElementById('filterSidebar');
const overlay = document.getElementById('overlay');

// Initialize
fetch('data/products.json')
  .then(res => res.json())
  .then(products => {
    allProducts = products;
    filteredLaptops = products; // Initialize filtered laptops with all products
    applyFilters(); // This will render first page with pagination
  });

// Render products with pagination
function renderProducts(products) {
  productGrid.innerHTML = ''; // Clear current
  
  if (products.length === 0) {
    productGrid.innerHTML = '<p class="col-span-full text-center text-gray-500">No products match the filters.</p>';
    document.querySelector('.pagination-container')?.remove(); // Remove pagination if no results
    return;
  }

  // Calculate pagination
  const start = (currentPage - 1) * laptopsPerPage;
  const end = start + laptopsPerPage;
  const paginatedItems = products.slice(start, end);

  // Render products
  paginatedItems.forEach(product => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow hover:shadow-xl p-4';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="rounded-md w-full h-48 object-cover hover:transform hover:brightness-75 transition-transform duration-300 hover:scale-105" />
      <h3 class="text-lg font-medium mt-2">${product.name}</h3>
      <p class="text-sm text-gray-600">${product.specs}</p>
      <p class="text-blue-600 font-semibold mt-1">PKR ${product.price.toLocaleString()}</p>
      <div class="mt-3 flex justify-between">
        <button onclick="viewProduct(${product.id})" class="bg-gray-200 text-sm px-4 py-2 rounded-xl hover:bg-gray-300">View Details</button>
        <button class="bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-blue-700">Call / Whatsapp</button>
      </div>
    `;
    productGrid.appendChild(card);
  });

  renderPagination(products.length);
}

// Render pagination controls
function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / laptopsPerPage);
  
  // Remove existing pagination if it exists
  document.querySelector('.pagination-container')?.remove();

  // Don't show pagination if only 1 page
  if (totalPages <= 1) return;

  const paginationContainer = document.createElement('div');
  paginationContainer.className = 'pagination-container col-span-full mt-8 flex justify-center space-x-2';
  
  paginationContainer.innerHTML = `
    <button onclick="changePage(-1)" ${currentPage === 1 ? 'disabled' : ''} 
      class="max-sm:px-2 max-sm:py-1 px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}">
      Previous
    </button>
    
    ${Array.from({length: totalPages}, (_, i) => i + 1).map(page => `
      <button onclick="goToPage(${page})" 
        class="max-sm:px-2 max-sm:py-1 px-4 py-2 rounded ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}">
        ${page}
      </button>
    `).join('')}
    
    <button onclick="changePage(1)" ${currentPage === totalPages ? 'disabled' : ''} 
      class="max-sm:px-2 max-sm:py-1 px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}">
      Next
    </button>
  `;

  // Insert pagination after product grid
  productGrid.insertAdjacentElement('afterend', paginationContainer);
}

// Pagination functions
function changePage(offset) {
  const newPage = currentPage + offset;
  const totalPages = Math.ceil(filteredLaptops.length / laptopsPerPage);
  
  if (newPage > 0 && newPage <= totalPages) {
    currentPage = newPage;
    renderProducts(filteredLaptops);
  }
}

function goToPage(page) {
  currentPage = page;
  renderProducts(filteredLaptops);
}

// Add to window for HTML access
window.changePage = changePage;
window.goToPage = goToPage;

// Filter functions
function applyFilters() {
  const selectedBrands = Array.from(brandFilters)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  const maxPrice = parseInt(priceRange.value);
  const searchTerm = searchInput.value.toLowerCase();

  filteredLaptops = allProducts.filter(product => {
    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const priceMatch = product.price <= maxPrice;
    const searchMatch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.specs.toLowerCase().includes(searchTerm);

    return brandMatch && priceMatch && searchMatch;
  });

  // Reset to first page when filters change
  currentPage = 1;
  renderProducts(filteredLaptops);
}

// Viewing products
function viewProduct(id) {
  localStorage.setItem('selectedProductId', id);
  window.location.href = 'product.html';
}

// Event listeners
brandFilters.forEach(cb => cb.addEventListener('change', applyFilters));
priceRange.addEventListener('input', () => {
  priceValue.textContent = priceRange.value;
  applyFilters();
});

searchInput.addEventListener('input', applyFilters);

// Mobile filter sidebar
function openSidebar() {
  filterSidebar.classList.remove('-translate-x-full');
  filterSidebar.classList.add('translate-x-0');
  overlay.classList.remove('hidden');
}

function closeSidebar() {
  filterSidebar.classList.remove('translate-x-0');
  filterSidebar.classList.add('-translate-x-full');
  overlay.classList.add('hidden');
}

filterToggleBtn.addEventListener('click', () => {
  if (filterSidebar.classList.contains('translate-x-0')) {
    closeSidebar();
  } else {
    openSidebar();
  }
});

overlay.addEventListener('click', closeSidebar);
