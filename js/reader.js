// Reader Page Logic
let currentFontSize = 1.1;

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
    const content = document.getElementById('readerContent');
    const currentBg = getComputedStyle(content).backgroundColor;
    
    if (currentBg === 'rgb(30, 41, 59)') { // dark-surface
        // Switch to sepia
        content.style.backgroundColor = '#f4ecd8';
        content.style.color = '#5c4a3a';
    } else if (content.style.backgroundColor === 'rgb(244, 236, 216)') {
        // Switch to light
        content.style.backgroundColor = '#ffffff';
        content.style.color = '#1e293b';
    } else {
        // Switch back to dark
        content.style.backgroundColor = '';
        content.style.color = '';
    }
}
