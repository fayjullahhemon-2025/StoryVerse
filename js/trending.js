// Trending Page Logic

document.addEventListener('DOMContentLoaded', function() {
    loadTop3Books();
    loadAllTrendingBooks();
    setupFilterTabs();
});

function loadTop3Books() {
    const container = document.getElementById('top3Grid');
    const books = getSampleBooks();
    books.sort((a, b) => b.rating - a.rating);
    const top3 = books.slice(0, 3);
    
    container.innerHTML = top3.map((book, index) => {
        const rank = index + 1;
        const badgeClass = rank === 1 ? 'gold' : rank === 2 ? 'silver' : 'bronze';
        return `
            <div class="top-book rank-${rank}" onclick="window.location.href='book.html?id=${book.id}'">
                <div class="rank-badge ${badgeClass}">${rank}</div>
                <div class="top-book-cover">
                    <img src="${book.coverImage}" alt="${book.title}">
                </div>
                <div class="top-book-info">
                    <div class="top-book-title">${book.title}</div>
                    <div class="top-book-author">by ${book.author}</div>
                    <div class="top-book-stats">
                        <span><i class="fas fa-star"></i> ${book.rating}</span>
                        <span><i class="fas fa-eye"></i> ${(Math.random() * 100 + 50).toFixed(0)}K</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function loadAllTrendingBooks() {
    const container = document.getElementById('trendingBooksGrid');
    const books = getSampleBooks();
    books.sort((a, b) => b.rating - a.rating);
    
    container.innerHTML = books.map((book, index) => {
        const views = (Math.random() * 100 + 20).toFixed(1);
        const isHot = index < 5;
        return `
            <div class="trending-book-card" onclick="window.location.href='book.html?id=${book.id}'">
                <div class="trending-rank">#${index + 1}</div>
                ${isHot ? '<div class="hot-badge">🔥 HOT</div>' : ''}
                <div class="trending-book-cover">
                    <img src="${book.coverImage}" alt="${book.title}">
                </div>
                <div class="trending-book-info">
                    <div class="trending-book-title">${book.title}</div>
                    <div class="trending-book-author">by ${book.author}</div>
                    <div class="trending-book-meta">
                        <div class="trending-views">
                            <i class="fas fa-eye"></i> ${views}K
                        </div>
                        <div class="trending-rating">
                            <i class="fas fa-star"></i> ${book.rating}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function setupFilterTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Reload books without animation
            loadAllTrendingBooks();
        });
    });
}
