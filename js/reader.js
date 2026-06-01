// Reader Page Logic
let currentFontSize = 1.1;
let currentMode = 'light';

function changeFont(direction) {
    const content = document.getElementById('readerContent');
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
    
    // Remove active class from all buttons
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Set the mode
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
    
    // Save preference
    localStorage.setItem('readingMode', mode);
}

// Load saved reading mode on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedMode = localStorage.getItem('readingMode') || 'light';
    setReadingMode(savedMode);
});
