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

    // Setup newly added edit book and chapter form listeners
    setupEditBookForm();
    setupChapterForm();
    
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
            <div class="empty-state-card" style="text-align: center; padding: 4rem 2rem; background-color: var(--bg-main); border: 1px solid var(--border-color); border-radius: 16px; box-shadow: var(--card-shadow);">
                <i class="fas fa-book-open" style="font-size: 4rem; margin-bottom: 1.5rem; color: var(--success-color); filter: drop-shadow(0 4px 10px rgba(98,171,0,0.15));"></i>
                <h3 style="font-family: 'PT Serif', serif; font-size: 1.55rem; margin-bottom: 0.75rem; color: var(--text-primary);">No Books Created Yet</h3>
                <p style="color: var(--text-secondary); max-width: 420px; margin: 0 auto 2rem; font-size: 0.95rem; line-height: 1.6;">Unleash your imagination and publish your first story on StoryVerse to start building your audience and unlocking direct revenue shares!</p>
                <button class="btn-primary btn-large" onclick="showSection('create-book')" style="padding: 12px 36px; font-weight: 700; border-radius: 6px; box-shadow: 0 4px 14px rgba(98, 171, 0, 0.25);">Create Your First Book</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = books.map(book => `
        <div class="book-item animate-card">
            <div class="book-item-cover" style="background: ${book.coverGradient || 'linear-gradient(135deg, #667eea, #764ba2)'}; position: relative; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; text-align: center; padding: 10px; font-size: 0.9rem; font-family: var(--font-heading);">
                ${book.title}
            </div>
            <div class="book-item-info">
                <div class="book-item-title">${book.title}</div>
                <p style="color: var(--text-secondary); margin: 0.5rem 0; font-size: 0.9rem; line-height: 1.5;">${book.synopsis.substring(0, 150)}...</p>
                <div class="book-item-meta">
                    <span><i class="fas fa-eye"></i> ${book.views || 0} views</span>
                    <span><i class="fas fa-star"></i> ${book.rating || 0} rating</span>
                    <span><i class="fas fa-file-alt"></i> ${book.chapters || 0} chapters</span>
                </div>
                <div class="book-item-actions">
                    <button class="btn-primary" onclick="editBook('${book.id}')" style="background-color: var(--success-color); border: none; color: white;">
                        <i class="fas fa-edit"></i> Edit Info
                    </button>
                    <button class="btn-secondary" onclick="manageChapters('${book.id}')">
                        <i class="fas fa-list"></i> Chapters
                    </button>
                    <button class="btn-secondary" onclick="viewBook('${book.id}')">
                        <i class="fas fa-eye"></i> Reader View
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
        
        // Initialize an empty chapters array for this book
        localStorage.setItem('bookChapters_' + newBook.id, JSON.stringify([]));
        
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
    
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
    }
    
    const sidebarLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (sidebarLink) {
        sidebarLink.classList.add('active');
    }
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

function viewBook(bookId) {
    window.location.href = `book.html?id=${bookId}&preview=true`;
}

/* ==========================================================================
   Book Editing Functionality
   ========================================================================== */

function editBook(bookId) {
    const books = JSON.parse(localStorage.getItem('myBooks') || '[]');
    const book = books.find(b => b.id === bookId);
    
    if (!book) {
        alert('Book not found.');
        return;
    }
    
    document.getElementById('editBookId').value = book.id;
    document.getElementById('editBookTitle').value = book.title;
    document.getElementById('editBookSynopsis').value = book.synopsis;
    document.getElementById('editBookGenre').value = book.genre;
    document.getElementById('editBookRating').value = book.ageRating;
    
    document.getElementById('editBookModal').style.display = 'flex';
}

function closeEditBookModal() {
    document.getElementById('editBookModal').style.display = 'none';
    document.getElementById('editBookForm').reset();
}

function setupEditBookForm() {
    const form = document.getElementById('editBookForm');
    if (!form) return;
    
    form.onsubmit = function(e) {
        e.preventDefault();
        
        const bookId = document.getElementById('editBookId').value;
        const books = JSON.parse(localStorage.getItem('myBooks') || '[]');
        const bookIndex = books.findIndex(b => b.id === bookId);
        
        if (bookIndex !== -1) {
            books[bookIndex].title = document.getElementById('editBookTitle').value;
            books[bookIndex].synopsis = document.getElementById('editBookSynopsis').value;
            books[bookIndex].genre = document.getElementById('editBookGenre').value;
            books[bookIndex].ageRating = document.getElementById('editBookRating').value;
            
            localStorage.setItem('myBooks', JSON.stringify(books));
            alert('Book information updated successfully!');
            closeEditBookModal();
            loadMyBooks();
        } else {
            alert('Failed to save changes. Book not found.');
        }
    };
}

/* ==========================================================================
   Chapter Management Functionality
   ========================================================================== */

function manageChapters(bookId) {
    const books = JSON.parse(localStorage.getItem('myBooks') || '[]');
    const book = books.find(b => b.id === bookId);
    
    if (!book) {
        alert('Book not found.');
        return;
    }
    
    document.getElementById('chapterBookId').value = bookId;
    document.getElementById('manageChaptersBookTitle').textContent = `Manage Chapters — ${book.title}`;
    
    // Render the chapters list table
    loadChaptersList(bookId);
    
    // Switch to manage chapters tab
    showSection('manage-chapters');
}

function loadChaptersList(bookId) {
    const container = document.getElementById('studioChaptersList');
    if (!container) return;
    
    const chapters = JSON.parse(localStorage.getItem('bookChapters_' + bookId) || '[]');
    
    // Update chapter badge count
    document.getElementById('chaptersCountBadge').textContent = `${chapters.length} Chapters`;
    
    if (chapters.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                    <i class="fas fa-file-pdf" style="font-size: 2.5rem; margin-bottom: 1rem; display: block; color: var(--text-muted);"></i>
                    No chapters have been uploaded yet. Click "Add New Chapter" to publish.
                </td>
            </tr>
        `;
        return;
    }
    
    // Sort chapters by number ascending
    chapters.sort((a, b) => parseInt(a.number) - parseInt(b.number));
    
    container.innerHTML = chapters.map(chapter => {
        const typeBadge = chapter.isFree ? 
            `<span class="status-badge status-completed">Free</span>` : 
            `<span class="status-badge status-pending" style="color:#b59c00; background-color:rgba(236,205,0,0.12); border-color:rgba(236,205,0,0.2);">Paid</span>`;
            
        const priceDisplay = chapter.isFree ? '—' : `৳${chapter.price}`;
        
        return `
            <tr>
                <td><strong>Ch ${chapter.number}</strong></td>
                <td>${chapter.title}</td>
                <td>
                    <span class="chart-period" style="font-size:0.75rem; padding: 2px 8px; border-radius: 4px;">
                        Version ${chapter.version || 1}
                    </span>
                    <span style="font-size: 0.8rem; display:block; color:var(--text-secondary); margin-top:2px;">
                        <i class="fas fa-file-pdf" style="color:var(--secondary-color);"></i> ${chapter.fileName || 'document.pdf'} (${chapter.fileSize || '1.8 MB'})
                    </span>
                </td>
                <td>${typeBadge}</td>
                <td><strong>${priceDisplay}</strong></td>
                <td><span style="font-size:0.85rem; color:var(--text-secondary);">${chapter.date}</span></td>
                <td style="text-align: right;">
                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                        <button class="btn-primary" onclick="openEditChapterModal('${chapter.id}')" style="padding: 6px 12px; font-size: 0.8rem; border-radius: 4px; background-color: var(--success-color); border:none;">
                            <i class="fas fa-upload"></i> Re-upload
                        </button>
                        <button class="btn-secondary" onclick="previewReaderPerspective('${bookId}', ${chapter.number})" style="padding: 6px 12px; font-size: 0.8rem; border-radius: 4px;">
                            <i class="fas fa-eye"></i> Preview
                        </button>
                        <button class="btn-secondary" onclick="deleteChapter('${chapter.id}')" style="padding: 6px 12px; font-size: 0.8rem; border-radius: 4px; color: var(--danger-color); border-color: rgba(189,0,24,0.15);">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function openAddChapterModal() {
    const bookId = document.getElementById('chapterBookId').value;
    const chapters = JSON.parse(localStorage.getItem('bookChapters_' + bookId) || '[]');
    
    // Clear the form and set create values
    document.getElementById('editChapterId').value = '';
    document.getElementById('chapterNumber').value = chapters.length + 1;
    document.getElementById('chapterTitleField').value = '';
    document.getElementById('chapterPdfFile').value = '';
    document.getElementById('chapterAccessType').value = 'free';
    document.getElementById('chapterPrice').value = '';
    
    document.getElementById('chapterFileDisplay').style.display = 'none';
    document.getElementById('chapterPriceContainer').style.display = 'none';
    document.getElementById('chapterModalTitle').textContent = 'Add New Chapter';
    document.getElementById('chapterSubmitBtn').textContent = 'Publish Chapter';
    
    document.getElementById('chapterModal').style.display = 'flex';
}

function openEditChapterModal(chapterId) {
    const bookId = document.getElementById('chapterBookId').value;
    const chapters = JSON.parse(localStorage.getItem('bookChapters_' + bookId) || '[]');
    const chapter = chapters.find(c => c.id === chapterId);
    
    if (!chapter) {
        alert('Chapter not found.');
        return;
    }
    
    document.getElementById('editChapterId').value = chapter.id;
    document.getElementById('chapterNumber').value = chapter.number;
    document.getElementById('chapterTitleField').value = chapter.title;
    document.getElementById('chapterPdfFile').value = ''; // Reset file input
    document.getElementById('chapterAccessType').value = chapter.isFree ? 'free' : 'paid';
    document.getElementById('chapterPrice').value = chapter.price || '';
    
    const fileLabel = document.getElementById('chapterFileDisplay');
    fileLabel.textContent = `Current File: ${chapter.fileName || 'unknown.pdf'} (V${chapter.version || 1})`;
    fileLabel.style.display = 'block';
    
    toggleChapterPriceVisibility();
    
    document.getElementById('chapterModalTitle').textContent = 'Edit / Re-upload Chapter';
    document.getElementById('chapterSubmitBtn').textContent = 'Update Chapter';
    
    document.getElementById('chapterModal').style.display = 'flex';
}

function closeChapterModal() {
    document.getElementById('chapterModal').style.display = 'none';
    document.getElementById('chapterForm').reset();
}

function toggleChapterPriceVisibility() {
    const type = document.getElementById('chapterAccessType').value;
    const priceContainer = document.getElementById('chapterPriceContainer');
    const priceField = document.getElementById('chapterPrice');
    
    if (type === 'paid') {
        priceContainer.style.display = 'block';
        priceField.required = true;
    } else {
        priceContainer.style.display = 'none';
        priceField.required = false;
        priceField.value = '';
    }
}

function setupChapterForm() {
    const form = document.getElementById('chapterForm');
    if (!form) return;
    
    form.onsubmit = function(e) {
        e.preventDefault();
        
        const bookId = document.getElementById('chapterBookId').value;
        const editChapterId = document.getElementById('editChapterId').value;
        const chapters = JSON.parse(localStorage.getItem('bookChapters_' + bookId) || '[]');
        
        const numVal = parseInt(document.getElementById('chapterNumber').value);
        const titleVal = document.getElementById('chapterTitleField').value;
        const accessVal = document.getElementById('chapterAccessType').value;
        const priceVal = accessVal === 'paid' ? parseInt(document.getElementById('chapterPrice').value) : 0;
        
        const fileInput = document.getElementById('chapterPdfFile');
        let fileObj = null;
        
        if (fileInput.files && fileInput.files[0]) {
            fileObj = fileInput.files[0];
        }
        
        if (editChapterId) {
            // EDIT / RE-UPLOAD CHAPTER
            const chapIndex = chapters.findIndex(c => c.id === editChapterId);
            if (chapIndex !== -1) {
                const currentChap = chapters[chapIndex];
                
                currentChap.number = numVal;
                currentChap.title = titleVal;
                currentChap.isFree = (accessVal === 'free');
                currentChap.price = priceVal;
                
                // If a new PDF file is selected, increment version count!
                if (fileObj) {
                    currentChap.version = (currentChap.version || 1) + 1;
                    currentChap.fileName = fileObj.name;
                    currentChap.fileSize = (fileObj.size / (1024 * 1024)).toFixed(2) + ' MB';
                }
                
                localStorage.setItem('bookChapters_' + bookId, JSON.stringify(chapters));
                alert(`Chapter updated successfully! ${fileObj ? 'New version V' + currentChap.version + ' uploaded.' : ''}`);
                closeChapterModal();
                loadChaptersList(bookId);
            }
        } else {
            // ADD NEW CHAPTER
            // Check if chapter number already exists
            if (chapters.some(c => c.number === numVal)) {
                alert(`Chapter ${numVal} already exists. Please choose a different number or edit the existing chapter instead.`);
                return;
            }
            
            const newChapter = {
                id: Date.now().toString(),
                number: numVal,
                title: titleVal,
                version: 1,
                fileName: fileObj ? fileObj.name : 'document.pdf',
                fileSize: fileObj ? (fileObj.size / (1024 * 1024)).toFixed(2) + ' MB' : '1.8 MB',
                isFree: (accessVal === 'free'),
                price: priceVal,
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
            };
            
            chapters.push(newChapter);
            localStorage.setItem('bookChapters_' + bookId, JSON.stringify(chapters));
            
            // Increment chapter count in the book's metadata
            updateBookChapterCount(bookId, chapters.length);
            
            alert('New chapter published successfully!');
            closeChapterModal();
            loadChaptersList(bookId);
        }
    };
}

function updateBookChapterCount(bookId, count) {
    const books = JSON.parse(localStorage.getItem('myBooks') || '[]');
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex !== -1) {
        books[bookIndex].chapters = count;
        localStorage.setItem('myBooks', JSON.stringify(books));
        loadMyBooks(); // Reload main book card grids
    }
}

function deleteChapter(chapterId) {
    if (!confirm('Are you sure you want to delete this chapter? This action is permanent.')) return;
    
    const bookId = document.getElementById('chapterBookId').value;
    const chapters = JSON.parse(localStorage.getItem('bookChapters_' + bookId) || '[]');
    const filteredChapters = chapters.filter(c => c.id !== chapterId);
    
    localStorage.setItem('bookChapters_' + bookId, JSON.stringify(filteredChapters));
    
    // Update count in book metadata
    updateBookChapterCount(bookId, filteredChapters.length);
    
    alert('Chapter deleted successfully.');
    loadChaptersList(bookId);
}

function previewReaderPerspective(bookId, chapterNum) {
    // Open reader.html with preview parameters
    const url = `reader.html?bookId=${bookId}&chapter=${chapterNum}&preview=true`;
    window.open(url, '_blank');
}
