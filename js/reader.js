// Reader Page Logic
let currentFontSize = 1.1;
let currentMode = 'light';

let bookId = null;
let chapterNum = null;
let isPreview = false;
let customBook = null;
let chapters = [];
let currentChapter = null;

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    bookId = urlParams.get('bookId');
    const chapterQuery = urlParams.get('chapter');
    isPreview = urlParams.get('preview') === 'true';
    
    if (bookId && chapterQuery) {
        chapterNum = parseInt(chapterQuery);
        const books = JSON.parse(localStorage.getItem('myBooks') || '[]');
        customBook = books.find(b => b.id === bookId);
        
        if (customBook) {
            chapters = JSON.parse(localStorage.getItem('bookChapters_' + bookId) || '[]');
            chapters.sort((a, b) => parseInt(a.number) - parseInt(b.number));
            currentChapter = chapters.find(c => c.number === chapterNum);
            
            if (currentChapter) {
                renderCustomChapter();
            }
        }
    }
    
    // Render sticky writer preview banner
    if (isPreview) {
        renderPreviewBanner();
    }
    
    // Load saved reading mode on page load
    const savedMode = localStorage.getItem('readingMode') || 'light';
    setReadingMode(savedMode);
});

function renderCustomChapter() {
    // Overwrite document title
    document.title = `Reading Ch ${currentChapter.number}: ${currentChapter.title} - StoryVerse`;
    
    // Chapter headers
    const chapNumHeader = document.querySelector('.chapter-number');
    if (chapNumHeader) chapNumHeader.textContent = `Chapter ${currentChapter.number}`;
    
    const titleHeader = document.querySelector('.reader-container h1');
    if (titleHeader) titleHeader.textContent = currentChapter.title;
    
    // Replace text contents with premium PDF reader mockup and simulated scroll panels!
    const content = document.getElementById('readerContent');
    if (content) {
        content.innerHTML = `
            <div class="pdf-viewer-mockup" style="background-color: #f1f5f9; padding: 2.5rem; border-radius: 12px; border: 2px dashed var(--border-color); text-align: center; margin-bottom: 2rem; box-shadow: inset 0 2px 8px rgba(0,0,0,0.05); font-family: var(--font-body);">
                <i class="fas fa-file-pdf" style="font-size: 5.5rem; color: #bd0018; margin-bottom: 1.5rem; filter: drop-shadow(0 4px 12px rgba(189,0,24,0.2));"></i>
                <h3 style="font-family: 'PT Serif', serif; font-size: 1.7rem; margin-bottom: 0.5rem; color: #0f172a;">${currentChapter.fileName || 'chapter_pages.pdf'}</h3>
                <p style="color: #64748b; font-weight: 700; font-size: 0.95rem; margin-bottom: 1.5rem;">
                    File Size: ${currentChapter.fileSize || '1.8 MB'} &nbsp;|&nbsp; 
                    Access: <span class="status-badge ${currentChapter.isFree ? 'status-completed' : 'status-pending'}" style="padding: 2px 10px; font-size: 0.75rem; border-radius: 4px; font-weight: bold; margin-left: 5px; ${!currentChapter.isFree ? 'color:#b59c00; background-color:rgba(236,205,0,0.12); border-color:rgba(236,205,0,0.2);' : ''}">${currentChapter.isFree ? 'FREE' : 'PAID (৳' + currentChapter.price + ')'}</span> &nbsp;|&nbsp;
                    Active Version: <span class="chart-period" style="font-size: 0.8rem; background-color: rgba(98, 171, 0, 0.1); color: var(--success-color); border: 1px solid rgba(98, 171, 0, 0.2); padding: 2px 8px; border-radius: 4px; font-weight: bold;">V${currentChapter.version || 1}</span>
                </p>
                
                <div style="background-color: white; border-radius: 8px; padding: 1.5rem; text-align: left; max-width: 480px; margin: 0 auto 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; font-size:0.85rem; color:#64748b; font-weight:700;">
                        <span>DOCUMENT PREVIEW STATUS:</span>
                        <span style="color:var(--success-color);"><i class="fas fa-check-circle"></i> SECURE DECODE SUCCESS</span>
                    </div>
                    <div style="font-weight: 600; color: #334155; line-height: 1.6; font-size: 0.92rem;">
                        StoryVerse Reader Decoded Chapter ${currentChapter.number} PDF successfully. Dynamic visual pages represent high-definition scans. Use the controls above to toggle page styles.
                    </div>
                </div>
            </div>
            
            <!-- Simulated Webtoon Scroll Panels for high fidelity visual WOW -->
            <div class="simulated-webtoon-panels" style="display: flex; flex-direction: column; gap: 1.5rem; align-items: center; margin-top: 3rem; font-family: var(--font-body);">
                <div style="width: 100%; max-width: 600px; height: 380px; background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #db2777; font-weight: bold; border: 1px solid #f9a8d4; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <i class="fas fa-images" style="font-size: 3.5rem; margin-bottom: 1.25rem;"></i>
                    <span style="letter-spacing:1px; font-size:1.1rem;">[ PDF PAGE 1 / SCAN PANEL ]</span>
                    <small style="color: #f472b6; margin-top: 0.6rem; font-weight: 700;">StoryVerse Render Engine v2.1</small>
                </div>
                <div style="width: 100%; max-width: 600px; height: 380px; background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #2563eb; font-weight: bold; border: 1px solid #93c5fd; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <i class="fas fa-paint-brush" style="font-size: 3.5rem; margin-bottom: 1.25rem;"></i>
                    <span style="letter-spacing:1px; font-size:1.1rem;">[ PDF PAGE 2 / SCAN PANEL ]</span>
                    <small style="color: #60a5fa; margin-top: 0.6rem; font-weight: 700;">High fidelity layout presentation</small>
                </div>
            </div>
        `;
    }
    
    // Navigation buttons
    const prevBtn = document.querySelector('.reader-navigation button:first-child');
    const nextBtn = document.querySelector('.reader-navigation button:last-child');
    
    // Find index of current chapter
    const currentIndex = chapters.findIndex(c => c.number === chapterNum);
    
    if (prevBtn) {
        if (currentIndex > 0) {
            const prevChapter = chapters[currentIndex - 1];
            prevBtn.disabled = false;
            prevBtn.onclick = function() {
                window.location.href = `reader.html?bookId=${bookId}&chapter=${prevChapter.number}${isPreview ? '&preview=true' : ''}`;
            };
        } else {
            prevBtn.disabled = true;
        }
    }
    
    if (nextBtn) {
        if (currentIndex < chapters.length - 1) {
            const nextChapter = chapters[currentIndex + 1];
            nextBtn.disabled = false;
            nextBtn.onclick = function() {
                if (isPreview) {
                    window.location.href = `reader.html?bookId=${bookId}&chapter=${nextChapter.number}&preview=true`;
                } else {
                    if (!nextChapter.isFree) {
                        alert('Unlock the next chapter from the book details page.');
                        window.location.href = `book.html?id=${bookId}`;
                    } else {
                        window.location.href = `reader.html?bookId=${bookId}&chapter=${nextChapter.number}`;
                    }
                }
            };
        } else {
            nextBtn.disabled = true;
            nextBtn.innerHTML = `End of Story <i class="fas fa-check"></i>`;
        }
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

function changeFont(direction) {
    const content = document.getElementById('readerContent');
    if (!content) return;
    if (direction === 'larger' && currentFontSize < 1.5) {
        currentFontSize += 0.1;
    } else if (direction === 'smaller' && currentFontSize > 0.9) {
        currentFontSize -= 0.1;
    }
    content.style.fontSize = currentFontSize + 'rem';
}

function toggleTheme() {
    const modes = ['light', 'sepia', 'dark'];
    const currentIndex = modes.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setReadingMode(modes[nextIndex]);
}

function setReadingMode(mode) {
    const content = document.getElementById('readerContent');
    const buttons = document.querySelectorAll('.mode-btn');
    if (!content || buttons.length < 3) return;
    
    buttons.forEach(btn => btn.classList.remove('active'));
    currentMode = mode;
    
    switch(mode) {
        case 'light':
            content.style.backgroundColor = '#ffffff';
            content.style.color = '#333333';
            buttons[0].classList.add('active');
            break;
        case 'sepia':
            content.style.backgroundColor = '#f4ecd8';
            content.style.color = '#5c4a3a';
            buttons[1].classList.add('active');
            break;
        case 'dark':
            content.style.backgroundColor = '#1e293b';
            content.style.color = '#e2e8f0';
            buttons[2].classList.add('active');
            break;
    }
    
    localStorage.setItem('readingMode', mode);
}
