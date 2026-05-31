// Discover Page Logic
document.addEventListener('DOMContentLoaded', function() {
    loadAllBooks();
    setupFilters();
});

function loadAllBooks() {
    const container = document.getElementById('discoverBooks');
    if (!container) return;

    const books = getSampleBooks();
    container.innerHTML = books.map(book => createBookCard(book)).join('');
    updateResultsCount(books.length);
}

function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const genreFilter = document.getElementById('genreFilter');
    const statusFilter = document.getElementById('statusFilter');
    const priceFilter = document.getElementById('priceFilter');
    const sortFilter = document.getElementById('sortFilter');

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
    if (genreFilter) {
        genreFilter.addEventListener('change', applyFilters);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
    if (priceFilter) {
        priceFilter.addEventListener('change', applyFilters);
    }
    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }
}

function applyFilters() {
    let books = getSampleBooks();
    
    // Search filter
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        books = books.filter(book => 
            book.title.toLowerCase().includes(searchTerm) || 
            book.author.toLowerCase().includes(searchTerm)
        );
    }

    // Price filter
    const priceFilter = document.getElementById('priceFilter').value;
    if (priceFilter === 'free') {
        books = books.filter(book => !book.isPremium);
    } else if (priceFilter === 'premium') {
        books = books.filter(book => book.isPremium);
    }

    // Sort
    const sortFilter = document.getElementById('sortFilter').value;
    if (sortFilter === 'rating') {
        books.sort((a, b) => b.rating - a.rating);
    } else if (sortFilter === 'newest') {
        books.reverse();
    }

    // Display filtered books
    const container = document.getElementById('discoverBooks');
    container.innerHTML = books.map(book => createBookCard(book)).join('');
    updateResultsCount(books.length);
}

function updateResultsCount(count) {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `Showing ${count} ${count === 1 ? 'story' : 'stories'}`;
    }
}
