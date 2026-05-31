// Main Application Logic
document.addEventListener('DOMContentLoaded', function() {
    // Modal handling
    const authModal = document.getElementById('authModal');
    const closeModal = document.querySelector('.close');
    
    if (closeModal) {
        closeModal.onclick = function() {
            authModal.style.display = 'none';
        };
    }

    window.onclick = function(event) {
        if (event.target == authModal) {
            authModal.style.display = 'none';
        }
    };

    // Login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.onclick = function() {
            showLoginForm();
        };
    }

    // Signup button
    const signupBtn = document.getElementById('signupBtn');
    if (signupBtn) {
        signupBtn.onclick = function() {
            showSignupForm();
        };
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick = function(e) {
            e.preventDefault();
            auth.logout();
        };
    }

    // User avatar dropdown
    const userAvatar = document.getElementById('userAvatar');
    const dropdownMenu = document.getElementById('dropdownMenu');
    if (userAvatar && dropdownMenu) {
        userAvatar.onclick = function() {
            dropdownMenu.classList.toggle('show');
        };
    }

    // Become a writer
    const becomeWriter = document.getElementById('becomeWriter');
    if (becomeWriter) {
        becomeWriter.onclick = function(e) {
            e.preventDefault();
            auth.becomeWriter();
        };
    }

    // Hero buttons
    const heroStartWriting = document.getElementById('heroStartWriting');
    if (heroStartWriting) {
        heroStartWriting.onclick = function() {
            if (auth.currentUser) {
                auth.becomeWriter();
            } else {
                showSignupForm();
            }
        };
    }

    const heroExplore = document.getElementById('heroExplore');
    if (heroExplore) {
        heroExplore.onclick = function() {
            window.location.href = 'discover.html';
        };
    }

    // Load books
    loadTrendingBooks();
    loadNewBooks();
});

function showLoginForm() {
    const authContainer = document.getElementById('authContainer');
    authContainer.innerHTML = `
        <h2 style="margin-bottom: 1.5rem; text-align: center;">Login to StoryVerse</h2>
        <form id="loginForm" style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Email</label>
                <input type="email" id="loginEmail" required 
                    style="width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--dark-border); 
                    background-color: var(--dark-bg); color: var(--text-primary); font-size: 1rem;">
            </div>
            <div>
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Password</label>
                <input type="password" id="loginPassword" required 
                    style="width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--dark-border); 
                    background-color: var(--dark-bg); color: var(--text-primary); font-size: 1rem;">
            </div>
            <button type="submit" class="btn-primary" style="width: 100%; margin-top: 1rem;">Login</button>
        </form>
        <div style="text-align: center; margin-top: 1rem; color: var(--text-secondary);">
            Don't have an account? <a href="#" onclick="showSignupForm()" style="color: var(--primary-color);">Sign up</a>
        </div>
        <div style="text-align: center; margin-top: 1rem;">
            <p style="color: var(--text-muted); margin-bottom: 1rem;">Or continue with</p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button class="btn-secondary" style="flex: 1;"><i class="fab fa-google"></i> Google</button>
                <button class="btn-secondary" style="flex: 1;"><i class="fab fa-facebook"></i> Facebook</button>
            </div>
        </div>
    `;

    document.getElementById('authModal').style.display = 'block';

    document.getElementById('loginForm').onsubmit = function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const result = auth.login(email, password);
        if (result.success) {
            document.getElementById('authModal').style.display = 'none';
            window.location.reload();
        } else {
            alert(result.message);
        }
    };
}

function showSignupForm() {
    const authContainer = document.getElementById('authContainer');
    authContainer.innerHTML = `
        <h2 style="margin-bottom: 1.5rem; text-align: center;">Join StoryVerse</h2>
        <form id="signupForm" style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Full Name</label>
                <input type="text" id="signupName" required 
                    style="width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--dark-border); 
                    background-color: var(--dark-bg); color: var(--text-primary); font-size: 1rem;">
            </div>
            <div>
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Email</label>
                <input type="email" id="signupEmail" required 
                    style="width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--dark-border); 
                    background-color: var(--dark-bg); color: var(--text-primary); font-size: 1rem;">
            </div>
            <div>
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Password</label>
                <input type="password" id="signupPassword" required 
                    style="width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--dark-border); 
                    background-color: var(--dark-bg); color: var(--text-primary); font-size: 1rem;">
            </div>
            <button type="submit" class="btn-primary" style="width: 100%; margin-top: 1rem;">Create Account</button>
        </form>
        <div style="text-align: center; margin-top: 1rem; color: var(--text-secondary);">
            Already have an account? <a href="#" onclick="showLoginForm()" style="color: var(--primary-color);">Login</a>
        </div>
    `;

    document.getElementById('authModal').style.display = 'block';

    document.getElementById('signupForm').onsubmit = function(e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        
        const result = auth.signup({ name, email, password });
        if (result.success) {
            document.getElementById('authModal').style.display = 'none';
            window.location.reload();
        } else {
            alert(result.message);
        }
    };
}

function loadTrendingBooks() {
    const container = document.getElementById('trendingBooks');
    if (!container) return;

    const books = getSampleBooks().slice(0, 6);
    container.innerHTML = books.map(book => createBookCard(book)).join('');
}

function loadNewBooks() {
    const container = document.getElementById('newBooks');
    if (!container) return;

    const books = getSampleBooks().slice(6, 12);
    container.innerHTML = books.map(book => createBookCard(book)).join('');
}

function createBookCard(book) {
    return `
        <div class="book-card" onclick="window.location.href='book.html?id=${book.id}'">
            <div class="book-cover">
                <img src="${book.coverImage}" alt="${book.title}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="book-info">
                <div class="book-title">${book.title}</div>
                <div class="book-author">by ${book.author}</div>
                <div class="book-meta">
                    <div class="book-rating">
                        <i class="fas fa-star"></i>
                        <span>${book.rating}</span>
                    </div>
                    <span class="book-status ${book.isPremium ? 'status-premium' : 'status-free'}">
                        ${book.isPremium ? 'Premium' : 'Free'}
                    </span>
                </div>
            </div>
        </div>
    `;
}

function getSampleBooks() {
    return [
        { id: 1, title: 'The Last Kingdom', author: 'Sarah Johnson', rating: 4.8, isPremium: true, 
          coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop', icon: 'fas fa-crown' },
        { id: 2, title: 'Midnight Tales', author: 'Alex Chen', rating: 4.6, isPremium: false,
          coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop', icon: 'fas fa-moon' },
        { id: 3, title: 'Digital Dreams', author: 'Maya Patel', rating: 4.9, isPremium: true,
          coverImage: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=400&h=600&fit=crop', icon: 'fas fa-robot' },
        { id: 4, title: 'Forest Whispers', author: 'John Smith', rating: 4.5, isPremium: false,
          coverImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop', icon: 'fas fa-tree' },
        { id: 5, title: 'City of Shadows', author: 'Emma Wilson', rating: 4.7, isPremium: true,
          coverImage: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=600&fit=crop', icon: 'fas fa-city' },
        { id: 6, title: 'Ocean Deep', author: 'David Lee', rating: 4.4, isPremium: false,
          coverImage: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=600&fit=crop', icon: 'fas fa-water' },
        { id: 7, title: 'Mountain Peak', author: 'Lisa Brown', rating: 4.8, isPremium: true,
          coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop', icon: 'fas fa-mountain' },
        { id: 8, title: 'Time Traveler', author: 'Mike Davis', rating: 4.6, isPremium: false,
          coverImage: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=400&h=600&fit=crop', icon: 'fas fa-clock' },
        { id: 9, title: 'Space Odyssey', author: 'Anna Kim', rating: 4.9, isPremium: true,
          coverImage: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop', icon: 'fas fa-rocket' },
        { id: 10, title: 'Magic Realm', author: 'Tom Garcia', rating: 4.5, isPremium: false,
          coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop', icon: 'fas fa-hat-wizard' },
        { id: 11, title: 'Dark Knight', author: 'Rachel Green', rating: 4.7, isPremium: true,
          coverImage: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=400&h=600&fit=crop', icon: 'fas fa-shield-alt' },
        { id: 12, title: 'Love Story', author: 'Chris Martin', rating: 4.4, isPremium: false,
          coverImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=600&fit=crop', icon: 'fas fa-heart' }
    ];
}
