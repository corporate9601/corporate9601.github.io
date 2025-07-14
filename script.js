// Gallery elements
const gallery = document.getElementById('gallery-container');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const imageCounter = document.getElementById('image-counter');
const closeBtn = document.querySelector('.close-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const imageTitle = document.getElementById('image-title');
const imageDescription = document.getElementById('image-description');
const statusText = document.getElementById('status');
const loader = document.getElementById('loader');
const refreshBtn = document.getElementById('refresh-btn');
const filterButtons = document.querySelectorAll('[data-filter]');

// Artwork data from the JSON script tag
const artworkData = JSON.parse(document.getElementById('artwork-data').textContent);

let images = [];
let currentImageIndex = 0;
let currentFilter = "all";

// Initialize the gallery
function initGallery() {
    showLoader();
    showStatus("Loading artworks...");
    
    try {
        // Use the embedded artwork data
        images = artworkData;
        
        if (images.length === 0) {
            showStatus("No artwork found. Please add images to the gallery.");
            return;
        }
        
        renderGallery();
        hideLoader();
        showStatus(`${images.length} artworks loaded successfully`);
    } catch (error) {
        console.error('Error loading gallery:', error);
        showStatus("Error loading artworks. Please check the artwork data.");
        hideLoader();
        
        // Display error details in gallery area
        gallery.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    <h4>Error Loading Gallery</h4>
                    <p>${error.message}</p>
                    <button class="btn btn-primary" id="retry-btn">Try Again</button>
                </div>
            </div>
        `;
        
        document.getElementById('retry-btn')?.addEventListener('click', initGallery);
    }
}

// Render gallery items
function renderGallery(filter = "all") {
    currentFilter = filter;
    gallery.innerHTML = '';
    
    const filteredImages = filter === "all" ? 
        images : 
        images.filter(img => img.category === filter);
    
    if (filteredImages.length === 0) {
        gallery.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-image fa-3x mb-3 text-muted"></i>
                <h3>No artworks found</h3>
                <p class="text-muted">Try selecting a different category</p>
            </div>
        `;
        return;
    }
    
    filteredImages.forEach((image, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-4 col-sm-6 mb-4 gallery-item';
        
        // Create image element
        const img = document.createElement('img');
        img.src = `gallery-images/${image.filename}`;
        img.alt = image.title;
        img.dataset.index = index;
        img.loading = "lazy";
        img.className = "img-fluid";
        
        // Create overlay element
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.innerHTML = `
            <h5 class="mb-0">${image.title}</h5>
            <small>${image.category.charAt(0).toUpperCase() + image.category.slice(1)} • ${image.year}</small>
        `;
        
        // Create container
        const container = document.createElement('div');
        container.className = 'position-relative h-100';
        container.appendChild(img);
        container.appendChild(overlay);
        
        col.appendChild(container);
        gallery.appendChild(col);
        
        // Add click event to images
        img.addEventListener('click', () => openLightbox(index, filter));
    });
}

// Lightbox functions
function openLightbox(index, filter) {
    // Get all images for the current filter
    const filteredImages = filter === "all" ? 
        images : 
        images.filter(img => img.category === filter);
    
    // Find the actual index in the main images array
    const actualIndex = images.findIndex(img => img.filename === filteredImages[index].filename);
    
    if (actualIndex === -1) return;
    
    currentImageIndex = actualIndex;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateLightbox() {
    const image = images[currentImageIndex];
    lightboxImg.src = `gallery-images/${image.filename}`;
    lightboxImg.alt = image.title;
    imageTitle.textContent = image.title;
    imageDescription.innerHTML = `
        ${image.description}<br><br>
        <strong>Medium:</strong> ${image.medium}<br>
        <strong>Dimensions:</strong> ${image.dimensions}<br>
        <strong>Year:</strong> ${image.year}
    `;
    imageCounter.textContent = `${currentImageIndex + 1} of ${images.length}`;
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateLightbox();
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateLightbox();
}

// UI helper functions
function showLoader() {
    loader.style.display = 'inline-block';
    statusText.textContent = "Loading artworks...";
}

function hideLoader() {
    loader.style.display = 'none';
}

function showStatus(message) {
    statusText.textContent = message;
}

// Event listeners
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === closeBtn) {
        closeLightbox();
    }
});

prevBtn.addEventListener('click', showPrevImage);
nextBtn.addEventListener('click', showNextImage);

document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    }
});

refreshBtn.addEventListener('click', () => {
    initGallery();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        // Filter gallery
        renderGallery(button.dataset.filter);
    });
});

// Initialize the gallery when page loads
document.addEventListener('DOMContentLoaded', initGallery);