// ===== DOM Elements =====
const welcomeOverlay = document.querySelector('.welcome-overlay');
const beginBtn = document.getElementById('begin-btn');
const soundBtn = document.getElementById('sound-toggle');
const infoPanel = document.querySelector('.info-panel');
const progressDots = document.querySelectorAll('.progress-dot');
const zoomLevels = document.querySelectorAll('.zoom-level');
const spaceAudio = document.getElementById('space-audio');
const scrollHint = document.querySelector('.scroll-hint');

// ===== Audio State =====
let isAudioEnabled = true;
let isAudioPlaying = false;

// ===== Initialize Audio =====
// Set volume to 30% (subtle background)
spaceAudio.volume = 0.3;

// ===== Start Journey =====
beginBtn.addEventListener('click', () => {
    // Hide welcome screen
    welcomeOverlay.classList.remove('active');
    
    // Show info panel with animation
    setTimeout(() => {
        infoPanel.classList.add('visible');
    }, 1000);
    
    // Start audio (if enabled)
    if (isAudioEnabled && !isAudioPlaying) {
        spaceAudio.play().then(() => {
            isAudioPlaying = true;
            console.log("🎵 Cosmic audio started");
        }).catch(error => {
            console.log("Audio play failed (user interaction required):", error);
            // Some browsers require user interaction first
        });
    }
    
    // Hide scroll hint after 5 seconds
    setTimeout(() => {
        scrollHint.style.opacity = '0';
        setTimeout(() => {
            scrollHint.style.display = 'none';
        }, 1000);
    }, 5000);
});

// ===== Sound Toggle =====
soundBtn.addEventListener('click', function() {
    const icon = this.querySelector('i');
    
    if (isAudioEnabled) {
        // Mute
        icon.classList.replace('fa-volume-up', 'fa-volume-mute');
        spaceAudio.volume = 0;
        isAudioEnabled = false;
    } else {
        // Unmute
        icon.classList.replace('fa-volume-mute', 'fa-volume-up');
        spaceAudio.volume = 0.3;
        isAudioEnabled = true;
        
        // If audio was stopped, restart it
        if (!isAudioPlaying) {
            spaceAudio.play().then(() => {
                isAudioPlaying = true;
            });
        }
    }
});

// ===== Volume Control (Optional - add if you want slider) =====
function setVolume(level) {
    spaceAudio.volume = level;
    if (level > 0 && !isAudioEnabled) {
        isAudioEnabled = true;
        soundBtn.querySelector('i').classList.replace('fa-volume-mute', 'fa-volume-up');
    }
}

// ===== Progress Dot Navigation =====
progressDots.forEach(dot => {
    dot.addEventListener('click', function() {
        const level = this.getAttribute('data-level');
        goToLevel(parseInt(level));
        
        // Optional: Play subtle transition sound
        playTransitionSound();
    });
});

// ===== Basic Level Navigation =====
let currentLevel = 0;

// Replace the goToLevel function with this updated version
function goToLevel(level) {
    // Update active zoom level
    zoomLevels.forEach(z => z.classList.remove('active'));
    zoomLevels[level].classList.add('active');
    
    // Update progress dots
    progressDots.forEach(d => d.classList.remove('active'));
    progressDots[level].classList.add('active');
    
    // Update info panel content
    const titles = [
        "Earth",
        "Solar System", 
        "Orion Arm",
        "Milky Way Galaxy",
        "Local Group",
        "Virgo Supercluster",
        "Laniakea Supercluster",
        "Observable Universe",
        "Cosmic Web",
        "Universe",
        "Multiverse"
    ];
    
    const descriptions = [
        "Our home planet — a pale blue dot in the vast cosmic ocean.",
        "Our Sun and everything bound to it by gravity — 8 planets, countless smaller bodies.",
        "A minor spiral arm of the Milky Way Galaxy where our Solar System is located.",
        "Our home galaxy — a barred spiral with over 100 billion stars.",
        "A collection of more than 50 galaxies, including Andromeda and Milky Way.",
        "A mass concentration of galaxies containing the Virgo Cluster and Local Group.",
        "Our home supercluster containing over 100,000 galaxies across 520 million light-years.",
        "Everything we can possibly observe — about 93 billion light-years across.",
        "The large-scale structure of the universe, a cosmic network of galaxies and dark matter.",
        "The totality of all space, time, matter, and energy, including unobservable regions.",
        "A speculative collection of potentially diverse universes beyond our own."
    ];
    
    const scales = [
        "12,742 km diameter",
        "287 billion km across",
        "10,000 light-years long",
        "100,000 light-years across",
        "10 million light-years across",
        "110 million light-years across",
        "520 million light-years across",
        "93 billion light-years across",
        "Billions of light-years",
        "At least 250x observable universe",
        "Beyond measurable scale"
    ];
    
    document.querySelector('.level-title').textContent = titles[level];
    document.querySelector('.level-description').textContent = descriptions[level];
    document.querySelector('.scale-value').textContent = scales[level];
    
    // Optional: Change audio based on level (more intense as we zoom out)
    if (level > 6) { // For universe+ levels
        spaceAudio.volume = 0.4;
    } else {
        spaceAudio.volume = 0.3;
    }
    
    currentLevel = level;
}

// ===== Transition Sound Effect (Optional) =====
function playTransitionSound() {
    // Create a quick "whoosh" sound for transitions
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.5);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
}

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        if (currentLevel < zoomLevels.length - 1) {
            goToLevel(currentLevel + 1);
            playTransitionSound();
        }
    }
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentLevel > 0) {
            goToLevel(currentLevel - 1);
            playTransitionSound();
        }
    }
    
    // Mute with 'M' key
    if (e.key === 'm' || e.key === 'M') {
        soundBtn.click();
    }
});

// ===== Mouse Wheel Navigation =====
let isScrolling = false;
document.addEventListener('wheel', (e) => {
    if (isScrolling) return;
    
    isScrolling = true;
    
    if (e.deltaY > 0) {
        // Scroll down = zoom out
        if (currentLevel < zoomLevels.length - 1) {
            goToLevel(currentLevel + 1);
            playTransitionSound();
        }
    } else {
        // Scroll up = zoom in
        if (currentLevel > 0) {
            goToLevel(currentLevel - 1);
            playTransitionSound();
        }
    }
    
    // Prevent too fast scrolling
    setTimeout(() => {
        isScrolling = false;
    }, 500);
});

// ===== Touch Swipe for Mobile =====
let touchStartY = 0;
document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
        if (diff > 0) {
            // Swipe up = zoom out
            if (currentLevel < zoomLevels.length - 1) {
                goToLevel(currentLevel + 1);
                playTransitionSound();
            }
        } else {
            // Swipe down = zoom in
            if (currentLevel > 0) {
                goToLevel(currentLevel - 1);
                playTransitionSound();
            }
        }
    }
});

// ===== Initialize =====
// Set first level as active
goToLevel(0);

// Auto-start audio on user interaction (for browsers that require it)
document.addEventListener('click', function initAudio() {
    if (!isAudioPlaying && isAudioEnabled) {
        spaceAudio.play().then(() => {
            isAudioPlaying = true;
        });
    }
    // Remove listener after first click
    document.removeEventListener('click', initAudio);
}, { once: true });