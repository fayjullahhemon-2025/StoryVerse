// Wallet Logic
document.addEventListener('DOMContentLoaded', function() {
    if (!auth.currentUser) {
        alert('Please login to access your wallet');
        window.location.href = 'index.html';
        return;
    }

    loadBalance();
    loadTransactions();

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

function loadBalance() {
    const balance = parseInt(localStorage.getItem('userCoins') || '0');
    document.getElementById('coinBalance').textContent = `${balance} Coins`;
}

function loadTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const container = document.getElementById('transactionsList');
    
    if (transactions.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                <i class="fas fa-receipt" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>No transactions yet</p>
            </div>
        `;
        return;
    }

    container.innerHTML = transactions.map(tx => `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-icon ${tx.type}">
                    <i class="fas ${tx.type === 'purchase' ? 'fa-plus' : 'fa-minus'}"></i>
                </div>
                <div class="transaction-details">
                    <h4>${tx.description}</h4>
                    <div class="transaction-date">${tx.date}</div>
                </div>
            </div>
            <div class="transaction-amount ${tx.type === 'purchase' ? 'positive' : 'negative'}">
                ${tx.type === 'purchase' ? '+' : '-'}${tx.amount} coins
            </div>
        </div>
    `).join('');
}

function buyCoins(amount, price) {
    if (!auth.currentUser) {
        alert('Please login to buy coins');
        return;
    }

    if (confirm(`Purchase ${amount} coins for $${price}?`)) {
        // Simulate payment processing
        const currentBalance = parseInt(localStorage.getItem('userCoins') || '0');
        const newBalance = currentBalance + amount;
        localStorage.setItem('userCoins', newBalance.toString());

        // Add transaction
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        transactions.unshift({
            type: 'purchase',
            description: `Purchased ${amount} coins`,
            amount: amount,
            date: new Date().toLocaleDateString()
        });
        localStorage.setItem('transactions', JSON.stringify(transactions));

        alert('Purchase successful!');
        loadBalance();
        loadTransactions();
    }
}
