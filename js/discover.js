// Discover Page Logic
document.addEventListener('DOMContentLoaded', function() {
    loadAllBooks();
    setupFilters();
    setupMobileDrawer();
    setupResetFilters();
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

// Map dynamic genre and status to sample books based on their ID to make the filters functional
function enrichBookData(books) {
    return books.map(book => {
        // Enriched genre mapping
        if ([1, 10].includes(book.id)) book.genre = 'fantasy';
        else if ([2, 12].includes(book.id)) book.genre = 'romance';
        else if ([3, 9].includes(book.id)) book.genre = 'scifi';
        else if ([5, 8].includes(book.id)) book.genre = 'mystery';
        else if ([11, 7].includes(book.id)) book.genre = 'thriller';
        else book.genre = 'horror'; // Fallback / balance

        // Enriched status mapping (e.g. alternating status)
        book.status = (book.id % 2 === 0) ? 'completed' : 'ongoing';
        return book;
    });
}

function applyFilters() {
    let books = enrichBookData(getSampleBooks());
    
    // Search filter
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        books = books.filter(book => 
            book.title.toLowerCase().includes(searchTerm) || 
            book.author.toLowerCase().includes(searchTerm)
        );
    }

    // Genre filter
    const genreFilter = document.getElementById('genreFilter').value;
    if (genreFilter) {
        books = books.filter(book => book.genre === genreFilter);
    }

    // Status filter
    const statusFilter = document.getElementById('statusFilter').value;
    if (statusFilter) {
        books = books.filter(book => book.status === statusFilter);
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

// Setup Slide-out Mobile Filters Drawer and Backdrop
function setupMobileDrawer() {
    const mobileToggle = document.getElementById('mobileFilterToggle');
    const closeFilters = document.getElementById('closeFilters');
    const backdrop = document.getElementById('filterBackdrop');
    const sidebar = document.getElementById('discoverSidebar');

    if (mobileToggle && sidebar && backdrop) {
        mobileToggle.addEventListener('click', function() {
            sidebar.classList.add('active');
            backdrop.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock scrolling
        });
    }

    function closeMobileSidebar() {
        if (sidebar) sidebar.classList.remove('active');
        if (backdrop) backdrop.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    if (closeFilters) {
        closeFilters.addEventListener('click', closeMobileSidebar);
    }
    if (backdrop) {
        backdrop.addEventListener('click', closeMobileSidebar);
    }
}

// Setup Clear All Reset button
function setupResetFilters() {
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            const searchInput = document.getElementById('searchInput');
            const genreFilter = document.getElementById('genreFilter');
            const statusFilter = document.getElementById('statusFilter');
            const priceFilter = document.getElementById('priceFilter');
            const sortFilter = document.getElementById('sortFilter');

            if (searchInput) searchInput.value = '';
            if (genreFilter) genreFilter.value = '';
            if (statusFilter) statusFilter.value = '';
            if (priceFilter) priceFilter.value = '';
            if (sortFilter) sortFilter.value = 'popular';

            // Re-apply filters with empty settings
            applyFilters();

            // Auto-close sidebar on mobile after clearing
            const sidebar = document.getElementById('discoverSidebar');
            const backdrop = document.getElementById('filterBackdrop');
            if (sidebar && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                if (backdrop) backdrop.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}
