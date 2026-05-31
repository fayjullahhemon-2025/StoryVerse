// Creator Studio Logic
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is a writer
    if (!auth.currentUser || auth.currentUser.role !== 'writer') {
        alert('You need to be a writer to access Creator Studio');
        window.location.href = 'index.html';
        return;
    }

    // Setup sidebar navigation
    setupSidebarNavigation();
    
    // Load my books
    loadMyBooks();
    
    // Setup create book form
    setupCreateBookForm();
    
    // User avatar dropdown
    const userAvatar = document.getElementById('userAvatar');
    const dropdownMenu = document.getElementById('dropdownMenu');
    if (userAvatar && dropdownMenu) {
        userAvatar.onclick = function() {
            dropdownMenu.classList.toggle('show');
        };
    }
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick = function(e) {
            e.preventDefault();
            auth.logout();
        };
    }
});

function setupSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sections = document.querySelectorAll('.studio-section');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            sidebarLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

function loadMyBooks() {
    const container = document.getElementById('myBooksList');
    if (!container) return;
    
    // Get user's books from localStorage
    const books = JSON.parse(localStorage.getItem('myBooks') || '[]');
    
    if (books.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <i class="fas fa-book" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>You haven't created any books yet.</p>
                <button class="btn-primary" onclick="showSection('create-book')">Create Your First Book</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = books.map(book => `
        <div class="book-item">
            <div class="book-item-cover" style="background: ${book.coverGradient || 'linear-gradient(135deg, #667eea, #764ba2)'};">
            </div>
            <div class="book-item-info">
                <div class="book-item-title">${book.title}</div>
                <p style="color: var(--text-secondary); margin: 0.5rem 0;">${book.synopsis.substring(0, 150)}...</p>
                <div class="book-item-meta">
                    <span><i class="fas fa-eye"></i> ${book.views || 0} views</span>
                    <span><i class="fas fa-star"></i> ${book.rating || 0} rating</span>
                    <span><i class="fas fa-file-alt"></i> ${book.chapters || 0} chapters</span>
                </div>
                <div class="book-item-actions">
                    <button class="btn-primary" onclick="editBook('${book.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-secondary" onclick="manageChapters('${book.id}')">
                        <i class="fas fa-list"></i> Chapters
                    </button>
                    <button class="btn-secondary" onclick="viewBook('${book.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function setupCreateBookForm() {
    const form = document.getElementById('createBookForm');
    if (!form) return;
    
    form.onsubmit = function(e) {
        e.preventDefault();
        
        const newBook = {
            id: Date.now().toString(),
            title: document.getElementById('bookTitle').value,
            synopsis: document.getElementById('bookSynopsis').value,
            genre: document.getElementById('bookGenre').value,
            ageRating: document.getElementById('bookRating').value,
            author: auth.currentUser.name,
            authorId: auth.currentUser.id,
            createdAt: new Date().toISOString(),
            views: 0,
            rating: 0,
            chapters: 0,
            coverGradient: getRandomGradient()
        };
        
        // Save to localStorage
        const books = JSON.parse(localStorage.getItem('myBooks') || '[]');
        books.push(newBook);
        localStorage.setItem('myBooks', JSON.stringify(books));
        
        alert('Book created successfully!');
        form.reset();
        showSection('my-books');
        loadMyBooks();
    };
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.studio-section');
    const links = document.querySelectorAll('.sidebar-link');
    
    sections.forEach(s => s.classList.remove('active'));
    links.forEach(l => l.classList.remove('active'));
    
    document.getElementById(sectionId).classList.add('active');
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
}

function getRandomGradient() {
    const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
}

function editBook(bookId) {
    alert('Edit book functionality - would open book editor');
}

function manageChapters(bookId) {
    alert('Manage chapters functionality - would open chapter manager');
}

function viewBook(bookId) {
    window.location.href = `book.html?id=${bookId}`;
}
