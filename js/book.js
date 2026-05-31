// Book Page Logic
document.addEventListener('DOMContentLoaded', function() {
    loadChapters();
});

function loadChapters() {
    const container = document.getElementById('chaptersList');
    if (!container) return;

    const chapters = [
        { number: 1, title: 'The Awakening', date: 'May 1, 2026', isFree: true },
        { number: 2, title: 'The Sword of Destiny', date: 'May 3, 2026', isFree: true },
        { number: 3, title: 'Betrayal in the Night', date: 'May 5, 2026', isFree: true },
        { number: 4, title: 'The Mage\'s Secret', date: 'May 7, 2026', isFree: false, price: 5 },
        { number: 5, title: 'Journey to the North', date: 'May 9, 2026', isFree: false, price: 5 },
        { number: 6, title: 'The Dragon\'s Lair', date: 'May 11, 2026', isFree: false, price: 5 },
        { number: 7, title: 'Allies and Enemies', date: 'May 13, 2026', isFree: false, price: 5 },
        { number: 8, title: 'The Dark Lord Rises', date: 'May 15, 2026', isFree: false, price: 5 }
    ];

    container.innerHTML = chapters.map(chapter => `
        <div class="chapter-item" onclick="readChapter(${chapter.number}, ${chapter.isFree})">
            <div class="chapter-info">
                <div class="chapter-number">Chapter ${chapter.number}</div>
                <div class="chapter-title">${chapter.title}</div>
                <div class="chapter-meta">Published ${chapter.date}</div>
            </div>
            <div class="chapter-status">
                ${chapter.isFree ? 
                    '<span style="color: var(--success-color); font-weight: 600;">FREE</span>' : 
                    `<i class="fas fa-lock chapter-lock"></i>
                     <span class="chapter-price">${chapter.price} coins</span>`
                }
            </div>
        </div>
    `).join('');
}

function startReading() {
    readChapter(1, true);
}

function readChapter(chapterNum, isFree) {
    if (!isFree) {
        if (!auth.currentUser) {
            alert('Please login to unlock premium chapters');
            showLoginForm();
            return;
        }
        
        const userCoins = parseInt(localStorage.getItem('userCoins') || '0');
        if (userCoins < 5) {
            if (confirm('You don\'t have enough coins. Would you like to buy more?')) {
                window.location.href = 'wallet.html';
            }
            return;
        }
        
        if (confirm('Unlock this chapter for 5 coins?')) {
            localStorage.setItem('userCoins', (userCoins - 5).toString());
            window.location.href = `reader.html?chapter=${chapterNum}`;
        }
    } else {
        window.location.href = `reader.html?chapter=${chapterNum}`;
    }
}

function addToLibrary() {
    if (!auth.currentUser) {
        alert('Please login to add books to your library');
        showLoginForm();
        return;
    }
    
    alert('Book added to your library!');
}
