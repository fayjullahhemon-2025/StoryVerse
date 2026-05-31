// Authentication System
class AuthSystem {
    constructor() {
        this.currentUser = this.loadUser();
        this.init();
    }

    init() {
        // Check if user is logged in
        if (this.currentUser) {
            this.showUserMenu();
        }
    }

    loadUser() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    }

    saveUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
    }

    login(email, password) {
        // Simulate login - In production, this would call your backend API
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            const userSession = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                avatar: user.avatar || 'assets/default-avatar.png'
            };
            this.saveUser(userSession);
            return { success: true, user: userSession };
        }
        return { success: false, message: 'Invalid credentials' };
    }

    signup(userData) {
        // Simulate signup - In production, this would call your backend API
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if email already exists
        if (users.find(u => u.email === userData.email)) {
            return { success: false, message: 'Email already registered' };
        }

        const newUser = {
            id: Date.now().toString(),
            ...userData,
            role: 'reader',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        const userSession = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            avatar: 'assets/default-avatar.png'
        };
        this.saveUser(userSession);
        return { success: true, user: userSession };
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        window.location.reload();
    }

    showUserMenu() {
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('signupBtn').style.display = 'none';
        document.getElementById('userMenu').style.display = 'block';
        
        if (this.currentUser.role === 'writer') {
            document.getElementById('creatorStudioLink').style.display = 'block';
        }
    }

    becomeWriter() {
        if (!this.currentUser) {
            alert('Please login first');
            return;
        }

        this.currentUser.role = 'writer';
        this.saveUser(this.currentUser);
        
        // Update in users array
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].role = 'writer';
            localStorage.setItem('users', JSON.stringify(users));
        }

        alert('Congratulations! You are now a writer. Access Creator Studio from your profile menu.');
        window.location.reload();
    }
}

// Initialize auth system
const auth = new AuthSystem();
