// Book Page Logic
let customBook = null;
let bookId = null;
let isPreview = false;

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    bookId = urlParams.get('id');
    isPreview = urlParams.get('preview') === 'true';

    if (bookId) {
        const books = JSON.parse(localStorage.getItem('myBooks') || '[]');
        customBook = books.find(b => b.id === bookId);
        
        if (customBook) {
            renderCustomBookDetails();
        }
    }
    
    // Load chapters
    loadChapters();
    
    // Render sticky writer preview banner
    if (isPreview) {
        renderPreviewBanner();
    }
});

function renderCustomBookDetails() {
    document.title = `${customBook.title} - StoryVerse`;
    
    const titleHeader = document.querySelector('.book-header-info h1');
    if (titleHeader) titleHeader.textContent = customBook.title;
    
    const authorLink = document.querySelector('.book-author-link');
    if (authorLink) {
        authorLink.textContent = `by ${customBook.author || 'Anonymous Writer'}`;
        authorLink.href = '#';
    }
    
    const coverContainer = document.querySelector('.book-header-cover');
    if (coverContainer) {
        coverContainer.innerHTML = `
            <div style="width: 100%; height: 100%; background: ${customBook.coverGradient || 'linear-gradient(135deg, #667eea, #764ba2)'}; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; text-align: center; padding: 20px; font-size: 1.4rem; font-family: var(--font-heading); box-shadow: 0 8px 30px rgba(0,0,0,0.3);">
                ${customBook.title}
            </div>
            <div class="book-cover-badge" style="background-color: var(--color-success);">Custom</div>
        `;
    }
    
    const synopsisContainer = document.querySelector('.book-synopsis p');
    if (synopsisContainer) {
        synopsisContainer.textContent = customBook.synopsis;
        const siblingParagraphs = document.querySelectorAll('.book-synopsis p ~ p');
        siblingParagraphs.forEach(p => p.remove());
    }
    
    const tagsContainer = document.querySelector('.book-tags');
    if (tagsContainer) {
        const ratingLabel = customBook.ageRating === 'mature' ? 'Mature (18+)' : customBook.ageRating === 'teen' ? 'Teen (13+)' : 'General';
        tagsContainer.innerHTML = `
            <span class="tag" style="text-transform: capitalize;">${customBook.genre}</span>
            <span class="tag">Ongoing</span>
            <span class="tag">${ratingLabel}</span>
        `;
    }
    
    const statsContainer = document.querySelector('.book-stats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="book-stat">
                <i class="fas fa-star" style="color: #eccd00;"></i>
                <span>${customBook.rating || 0.0} (0 reviews)</span>
            </div>
            <div class="book-stat">
                <i class="fas fa-eye" style="color: var(--color-success);"></i>
                <span>${customBook.views || 0} views</span>
            </div>
            <div class="book-stat">
                <i class="fas fa-book-open" style="color: var(--color-primary);"></i>
                <span>${customBook.chapters || 0} chapters</span>
            </div>
        `;
    }
}

function renderPreviewBanner() {
    const banner = document.createElement('div');
    banner.style.position = 'sticky';
    banner.style.top = '0';
    banner.style.zIndex = '99999';
    banner.style.backgroundColor = 'var(--color-success)';
    banner.style.color = '#ffffff';
    banner.style.textAlign = 'center';
    banner.style.padding = '12px 20px';
    banner.style.fontWeight = '700';
    banner.style.fontSize = '0.95rem';
    banner.style.boxShadow = '0 4px 15px rgba(98, 171, 0, 0.3)';
    banner.style.fontFamily = 'var(--font-body)';
    banner.innerHTML = `
        <i class="fas fa-eye" style="margin-right: 8px;"></i> 
        Writer Preview Mode — Reader Perspective 
        <span style="background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 4px; font-size: 0.8rem; margin-left: 12px; font-weight: 800; border: 1px solid rgba(255,255,255,0.3);">
            Bypassing Wallet Lockouts
        </span>
        <button onclick="window.close()" style="background: transparent; border: 1px solid rgba(255,255,255,0.6); color: white; border-radius: 4px; padding: 2px 8px; font-size: 0.75rem; margin-left: 15px; font-weight: 700; cursor: pointer; float: right;">
            Close Preview
        </button>
    `;
    document.body.insertBefore(banner, document.body.firstChild);
    
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.top = '45px';
    }
}

let currentChapterToUnlock = null;
let currentChapterPrice = 0;
let currentChapterTitle = '';
let activeOtp = null;
let otpInterval = null;

function loadChapters() {
    const container = document.getElementById('chaptersList');
    if (!container) return;

    let chapters = [];
    
    if (customBook) {
        chapters = JSON.parse(localStorage.getItem('bookChapters_' + bookId) || '[]');
        chapters.sort((a, b) => parseInt(a.number) - parseInt(b.number));
    } else {
        chapters = [
            { number: 1, title: 'The Awakening', date: 'May 1, 2026', isFree: true },
            { number: 2, title: 'The Sword of Destiny', date: 'May 3, 2026', isFree: true },
            { number: 3, title: 'Betrayal in the Night', date: 'May 5, 2026', isFree: true },
            { number: 4, title: 'The Mage\'s Secret', date: 'May 7, 2026', isFree: false, price: 10 },
            { number: 5, title: 'Journey to the North', date: 'May 9, 2026', isFree: false, price: 10 },
            { number: 6, title: 'The Dragon\'s Lair', date: 'May 11, 2026', isFree: false, price: 10 },
            { number: 7, title: 'Allies and Enemies', date: 'May 13, 2026', isFree: false, price: 15 },
            { number: 8, title: 'The Dark Lord Rises', date: 'May 15, 2026', isFree: false, price: 15 }
        ];
    }

    if (chapters.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 4rem 2rem; color: var(--text-secondary); width: 100%;">
                <i class="fas fa-file-pdf" style="font-size: 3rem; margin-bottom: 1.5rem; color: var(--border-color); display: block;"></i>
                <p style="font-weight:700; font-size:1.1rem; color:var(--text-primary); margin-bottom:0.5rem;">No Chapters Published</p>
                <p style="font-size:0.9rem; max-width:350px; margin:0 auto;">This writer hasn't uploaded any chapters for this story yet.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = chapters.map(chapter => {
        const escapedTitle = chapter.title.replace(/'/g, "\\'");
        return `
            <div class="chapter-item" onclick="readChapter(${chapter.number}, ${chapter.isFree}, ${chapter.price || 0}, '${escapedTitle}')">
                <div class="chapter-info">
                    <div class="chapter-number">Chapter ${chapter.number}</div>
                    <div class="chapter-title">${chapter.title}</div>
                    <div class="chapter-meta">Published ${chapter.date || 'Today'}</div>
                </div>
                <div class="chapter-status">
                    ${chapter.isFree ? 
                        '<span class="chapter-free"><i class="fas fa-check"></i> FREE</span>' : 
                        `<i class="fas fa-lock chapter-lock"></i>
                         <span class="chapter-price">৳${chapter.price}</span>`
                    }
                </div>
            </div>
        `;
    }).join('');
}

function startReading() {
    if (customBook) {
        const chapters = JSON.parse(localStorage.getItem('bookChapters_' + bookId) || '[]');
        if (chapters.length > 0) {
            chapters.sort((a, b) => parseInt(a.number) - parseInt(b.number));
            const firstChapter = chapters[0];
            readChapter(firstChapter.number, firstChapter.isFree, firstChapter.price || 0, firstChapter.title);
        } else {
            alert('No chapters available to read yet.');
        }
    } else {
        readChapter(1, true, 0, 'The Awakening');
    }
}

function readChapter(chapterNum, isFree, price, title) {
    if (isPreview) {
        // Writer Preview Mode - ALWAYS bypass lock checks and open reader in preview
        window.location.href = `reader.html?bookId=${bookId}&chapter=${chapterNum}&preview=true`;
        return;
    }
    
    if (!isFree) {
        // Store chapter info
        currentChapterToUnlock = chapterNum;
        currentChapterPrice = price;
        currentChapterTitle = title;
        
        // Show payment modal with proper transitions
        document.getElementById('chapterTitle').textContent = `Chapter ${chapterNum}: ${title}`;
        document.getElementById('chapterPrice').textContent = `৳${price}`;
        
        // Update specific gateway merchant details
        document.getElementById('bkashAmountVal').textContent = `৳${price}.00`;
        document.getElementById('nagadAmountVal').textContent = `৳${price}.00`;
        document.getElementById('rocketAmountVal').textContent = `৳${price}.00`;
        document.getElementById('cardPayBtn').textContent = `Pay ৳${price}`;
        
        // Reset sub-flows
        resetForms();
        
        const modal = document.getElementById('paymentModal');
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
    } else {
        if (customBook) {
            window.location.href = `reader.html?bookId=${bookId}&chapter=${chapterNum}`;
        } else {
            window.location.href = `reader.html?chapter=${chapterNum}`;
        }
    }
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        resetForms();
    }, 300);
}

function resetForms() {
    // Hide screens
    document.getElementById('paymentMethodSelection').style.display = 'block';
    document.getElementById('bkashInterface').style.display = 'none';
    document.getElementById('nagadInterface').style.display = 'none';
    document.getElementById('rocketInterface').style.display = 'none';
    document.getElementById('cardInterface').style.display = 'none';
    document.getElementById('paymentLoader').style.display = 'none';
    document.getElementById('paymentSuccessScreen').style.display = 'none';
    
    // Clear MFS steps
    ['bkash', 'nagad', 'rocket'].forEach(method => {
        document.getElementById(`${method}Step1`).style.display = 'block';
        document.getElementById(`${method}Step2`).style.display = 'none';
        document.getElementById(`${method}Step3`).style.display = 'none';
        
        document.getElementById(`${method}Phone`).value = '';
        document.getElementById(`${method}Otp`).value = '';
        document.getElementById(`${method}Pin`).value = '';
        
        document.getElementById(`${method}Btn1`).disabled = true;
        document.getElementById(`${method}Btn2`).disabled = true;
        document.getElementById(`${method}Btn3`).disabled = true;
    });

    // Clear Card fields
    document.getElementById('cardNumber').value = '';
    document.getElementById('cardHolder').value = '';
    document.getElementById('cardExpiry').value = '';
    document.getElementById('cardCvv').value = '';
    document.getElementById('cardPayBtn').disabled = true;

    // Reset card UI
    document.getElementById('cardNumberDisplay').textContent = '•••• •••• •••• ••••';
    document.getElementById('cardHolderDisplay').textContent = 'CARDHOLDER NAME';
    document.getElementById('cardExpiryDisplay').textContent = 'MM/YY';
    document.getElementById('cardCvvDisplay').textContent = '***';
    document.getElementById('cardBrandLogo').innerHTML = '<i class="fas fa-credit-card"></i>';
    document.getElementById('virtualCard').classList.remove('flipped');

    // Clear timers
    if (otpInterval) {
        clearInterval(otpInterval);
        otpInterval = null;
    }
    
    activeOtp = null;
}

function selectPaymentMethod(method) {
    document.getElementById('paymentMethodSelection').style.display = 'none';
    document.getElementById(`${method}Interface`).style.display = 'block';
}

function backToMethods() {
    resetForms();
}

// Play a realistic mobile synthetic double chime
function playNotificationSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc1.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.3);
        osc2.stop(ctx.currentTime + 0.3);
    } catch (e) {
        console.log('Audio Context blocked/not supported.', e);
    }
}

// SMS notification logic
function showSmsToast(otpCode) {
    const toast = document.getElementById('smsToast');
    const toastBody = document.getElementById('smsToastBody');
    toastBody.innerHTML = `Your StoryVerse verification code is <strong>${otpCode}</strong>. It will expire in 2 minutes.`;
    
    playNotificationSound();
    
    toast.classList.add('active');
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
        toast.classList.remove('active');
    }, 8000);
}

/* ==========================================================================
   Mobile Financial Services (MFS) flows: bKash, Nagad, Rocket
   ========================================================================== */

function validateMfsPhone(method) {
    const phoneInput = document.getElementById(`${method}Phone`);
    phoneInput.value = phoneInput.value.replace(/\D/g, ''); // Digits only
    
    const val = phoneInput.value;
    const requiredLength = (method === 'rocket') ? 12 : 11;
    const btn = document.getElementById(`${method}Btn1`);
    
    if (val.length === requiredLength && val.startsWith('01')) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

function sendMfsOtp(method) {
    const phoneVal = document.getElementById(`${method}Phone`).value;
    document.getElementById(`${method}PhoneDisplay`).textContent = phoneVal;
    
    // Generate 6-digit random code
    activeOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hide Step 1, Show Step 2
    document.getElementById(`${method}Step1`).style.display = 'none';
    document.getElementById(`${method}Step2`).style.display = 'block';
    
    // Setup SMS display
    showSmsToast(activeOtp);
    
    // Timer setup
    let timeLeft = 120;
    const timerDisplay = document.getElementById(`${method}Timer`);
    const resendLink = document.getElementById(`${method}Resend`);
    timerDisplay.parentElement.style.display = 'block';
    resendLink.style.display = 'none';
    
    if (otpInterval) clearInterval(otpInterval);
    
    otpInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(otpInterval);
            timerDisplay.parentElement.style.display = 'none';
            resendLink.style.display = 'inline';
        }
    }, 1000);
}

function validateMfsOtp(method) {
    const otpInput = document.getElementById(`${method}Otp`);
    otpInput.value = otpInput.value.replace(/\D/g, '');
    const btn = document.getElementById(`${method}Btn2`);
    
    if (otpInput.value.length === 6) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

function verifyMfsOtp(method) {
    const otpVal = document.getElementById(`${method}Otp`).value;
    
    if (otpVal === activeOtp) {
        // Clear OTP timer
        if (otpInterval) clearInterval(otpInterval);
        
        // Show Step 3, Hide Step 2
        document.getElementById(`${method}Step2`).style.display = 'none';
        document.getElementById(`${method}Step3`).style.display = 'block';
    } else {
        alert('Invalid verification code. Please enter the correct OTP code.');
    }
}

function validateMfsPin(method) {
    const pinInput = document.getElementById(`${method}Pin`);
    pinInput.value = pinInput.value.replace(/\D/g, '');
    
    const requiredLength = (method === 'nagad') ? 4 : 5;
    const btn = document.getElementById(`${method}Btn3`);
    
    if (pinInput.value.length === requiredLength) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

function submitMfsPayment(method) {
    // Show Loader Screen
    const loader = document.getElementById('paymentLoader');
    document.getElementById('loaderMessage').textContent = `Verifying PIN with ${method.toUpperCase()} gateway...`;
    loader.style.display = 'flex';
    
    // Simulate gateway request delay
    setTimeout(() => {
        loader.style.display = 'none';
        saveTransactionAndShowReceipt(method);
    }, 2500);
}

/* ==========================================================================
   Credit / Debit Card Flow
   ========================================================================== */

function formatCardNumber() {
    const input = document.getElementById('cardNumber');
    let val = input.value.replace(/\D/g, '');
    
    // Detect Brand dynamically
    const logoSpan = document.getElementById('cardBrandLogo');
    if (val.startsWith('4')) {
        logoSpan.innerHTML = '<i class="fab fa-cc-visa" style="color: #60a5fa;"></i>';
    } else if (val.startsWith('5')) {
        logoSpan.innerHTML = '<i class="fab fa-cc-mastercard" style="color: #fb7185;"></i>';
    } else if (val.startsWith('3')) {
        logoSpan.innerHTML = '<i class="fab fa-cc-amex" style="color: #38bdf8;"></i>';
    } else if (val.startsWith('6')) {
        logoSpan.innerHTML = '<i class="fab fa-cc-discover" style="color: #fbbf24;"></i>';
    } else {
        logoSpan.innerHTML = '<i class="fas fa-credit-card"></i>';
    }
    
    // Enforce 16 digit limit
    val = val.substring(0, 16);
    
    // Spacer format
    const formatted = val.match(/.{1,4}/g)?.join(' ') || '';
    input.value = formatted;
    
    // Update card mockup
    document.getElementById('cardNumberDisplay').textContent = formatted || '•••• •••• •••• ••••';
    
    validateCardForm();
}

function updateCardHolder() {
    const input = document.getElementById('cardHolder');
    // Sanitize input to characters only
    input.value = input.value.replace(/[^a-zA-Z\s]/g, '');
    
    document.getElementById('cardHolderDisplay').textContent = input.value.toUpperCase() || 'CARDHOLDER NAME';
    validateCardForm();
}

function formatCardExpiry() {
    const input = document.getElementById('cardExpiry');
    let val = input.value.replace(/\D/g, '');
    
    val = val.substring(0, 4);
    if (val.length > 2) {
        val = val.substring(0, 2) + '/' + val.substring(2);
    }
    input.value = val;
    
    document.getElementById('cardExpiryDisplay').textContent = val || 'MM/YY';
    validateCardForm();
}

function updateCardCvv() {
    const input = document.getElementById('cardCvv');
    input.value = input.value.replace(/\D/g, '');
    
    const len = input.value.length;
    document.getElementById('cardCvvDisplay').textContent = '•'.repeat(len) || '***';
    validateCardForm();
}

function flipCard(shouldFlip) {
    const card = document.getElementById('virtualCard');
    if (shouldFlip) {
        card.classList.add('flipped');
    } else {
        card.classList.remove('flipped');
    }
}

function validateCardForm() {
    const numVal = document.getElementById('cardNumber').value.replace(/\D/g, '');
    const nameVal = document.getElementById('cardHolder').value.trim();
    const expiryVal = document.getElementById('cardExpiry').value;
    const cvvVal = document.getElementById('cardCvv').value;
    const btn = document.getElementById('cardPayBtn');

    // Basic fields validation
    const isNumValid = (numVal.length === 16);
    const isNameValid = (nameVal.length >= 3);
    const isCvvValid = (cvvVal.length >= 3 && cvvVal.length <= 4);
    
    // Expiry verification
    let isExpiryValid = false;
    if (expiryVal.length === 5) {
        const parts = expiryVal.split('/');
        const month = parseInt(parts[0], 10);
        if (month >= 1 && month <= 12) {
            isExpiryValid = true;
        }
    }

    if (isNumValid && isNameValid && isCvvValid && isExpiryValid) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

function submitCardPayment() {
    const loader = document.getElementById('paymentLoader');
    document.getElementById('loaderMessage').textContent = 'Verifying credit card authorization...';
    loader.style.display = 'flex';
    
    setTimeout(() => {
        loader.style.display = 'none';
        saveTransactionAndShowReceipt('card');
    }, 2500);
}

/* ==========================================================================
   Common Transaction Complete / Redirection Actions
   ========================================================================== */

function saveTransactionAndShowReceipt(method) {
    // Generate Invoice/TXN ID
    const randomNum = Math.floor(10000000 + Math.random() * 90000000);
    const methodPrefixes = { bkash: 'BK', nagad: 'ND', rocket: 'RT', card: 'CR' };
    const txId = `SV-${methodPrefixes[method] || 'TX'}${randomNum}`;
    
    const bookTitle = document.querySelector('.book-header-info h1')?.textContent || 'The Last Kingdom';
    const desc = `Unlocked Chapter ${currentChapterToUnlock} of "${bookTitle}"`;
    
    // Save to localStorage
    const transaction = {
        method: method,
        description: desc,
        amount: currentChapterPrice,
        date: new Date().toISOString()
    };
    
    const transactions = JSON.parse(localStorage.getItem('bdtTransactions') || '[]');
    transactions.unshift(transaction);
    if (transactions.length > 20) transactions.pop();
    localStorage.setItem('bdtTransactions', JSON.stringify(transactions));
    
    // Fill receipt details
    document.getElementById('receiptChapter').textContent = `Chapter ${currentChapterToUnlock}: ${currentChapterTitle}`;
    document.getElementById('receiptMethod').textContent = (method === 'card') ? 'Credit/Debit Card' : method;
    document.getElementById('receiptAmount').textContent = `৳${currentChapterPrice}`;
    document.getElementById('receiptTxId').textContent = txId;
    
    // Display receipt screen
    document.getElementById('paymentSuccessScreen').style.display = 'flex';
}

function proceedToChapter() {
    closePaymentModal();
    window.location.href = `reader.html?chapter=${currentChapterToUnlock}`;
}

function addToLibrary() {
    alert('Book added to your library!');
}
