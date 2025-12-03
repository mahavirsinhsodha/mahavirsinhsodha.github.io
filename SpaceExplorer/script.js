
// ===== DOM Elements =====
const welcomeOverlay = document.querySelector('.welcome-overlay');
const beginBtn = document.getElementById('begin-btn');
const soundBtn = document.getElementById('sound-toggle');
const infoPanel = document.querySelector('.info-panel');
const progressDots = document.querySelectorAll('.progress-dot');
const zoomLevels = document.querySelectorAll('.zoom-level');
const spaceAudio = document.getElementById('space-audio');
const scrollHint = document.querySelector('.scroll-hint');
const customCursor = document.getElementById('custom-cursor');
const trailContainer = document.getElementById('trail-container');

// ===== Audio State =====
let isAudioEnabled = true;
let isAudioPlaying = false;

// ===== Cursor and Trail Variables =====
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let isMoving = false;
let lastMouseMoveTime = 0;
let trailInterval;
let trailParticles = [];
const TRAIL_LENGTH = 15; // Number of particles in trail
const TRAIL_SPAWN_RATE = 50; // ms between particles

// ===== Initialize Custom Cursor =====
function initCustomCursor() {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        lastMouseMoveTime = Date.now();
        
        if (!isMoving) {
            isMoving = true;
            customCursor.classList.add('boost');
            startTrail();
        }
    });
    
    // Smooth cursor movement
    function updateCursor() {
        const speed = 0.15; // Lower = smoother, slower movement
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;
        
        // Calculate angle for rotation
        const deltaX = mouseX - cursorX;
        const deltaY = mouseY - cursorY;
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        
        customCursor.style.left = cursorX + 'px';
        customCursor.style.top = cursorY + 'px';
        customCursor.style.transform = `translate(-50%, -50%) rotate(${angle + 90}deg)`;
        
        // Check if mouse stopped moving
        if (Date.now() - lastMouseMoveTime > 100 && isMoving) {
            isMoving = false;
            customCursor.classList.remove('boost');
            stopTrail();
        }
        
        requestAnimationFrame(updateCursor);
    }
    
    updateCursor();
}

// ===== Smoke Trail Effect =====
function startTrail() {
    if (trailInterval) return;
    
    trailInterval = setInterval(() => {
        if (!isMoving) return;
        
        createTrailParticle(cursorX, cursorY);
    }, TRAIL_SPAWN_RATE);
}

function stopTrail() {
    if (trailInterval) {
        clearInterval(trailInterval);
        trailInterval = null;
    }
}

function createTrailParticle(x, y) {
    const particle = document.createElement('div');
    particle.classList.add('trail-particle');
    
    // Randomly add smoke effect
    if (Math.random() > 0.7) {
        particle.classList.add('smoke');
    }
    
    // Random size and opacity
    const size = Math.random() * 4 + 3;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.opacity = Math.random() * 0.5 + 0.3;
    
    // Position at cursor (adjusted for direction)
    const angle = Math.atan2(mouseY - cursorY, mouseX - cursorX);
    const offset = 25; // Distance from cursor
    const adjustedX = x - Math.cos(angle) * offset;
    const adjustedY = y - Math.sin(angle) * offset;
    
    particle.style.left = adjustedX + 'px';
    particle.style.top = adjustedY + 'px';
    
    trailContainer.appendChild(particle);
    trailParticles.push(particle);
    
    // Limit trail length
    if (trailParticles.length > TRAIL_LENGTH) {
        const oldParticle = trailParticles.shift();
        if (oldParticle && oldParticle.parentNode) {
            oldParticle.parentNode.removeChild(oldParticle);
        }
    }
    
    // Animate particle
    const duration = Math.random() * 1000 + 500;
    const targetX = adjustedX + (Math.random() - 0.5) * 40;
    const targetY = adjustedY + (Math.random() - 0.5) * 40;
    
    particle.animate([
        { 
            transform: 'scale(1) translate(0, 0)', 
            opacity: particle.style.opacity 
        },
        { 
            transform: `scale(0.1) translate(${targetX - adjustedX}px, ${targetY - adjustedY}px)`, 
            opacity: 0 
        }
    ], {
        duration: duration,
        easing: 'cubic-bezier(0.2, 0, 0.8, 1)'
    }).onfinish = () => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
        const index = trailParticles.indexOf(particle);
        if (index > -1) {
            trailParticles.splice(index, 1);
        }
    };
}

// ===== Initialize Audio =====
spaceAudio.volume = 0.3;

// ===== Start Journey =====
beginBtn.addEventListener('click', () => {
    welcomeOverlay.classList.remove('active');
    
    setTimeout(() => {
        infoPanel.classList.add('visible');
    }, 1000);
    
    if (isAudioEnabled && !isAudioPlaying) {
        spaceAudio.play().then(() => {
            isAudioPlaying = true;
        }).catch(error => {
            console.log("Audio play failed:", error);
        });
    }
    
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
        icon.classList.replace('fa-volume-up', 'fa-volume-mute');
        spaceAudio.volume = 0;
        isAudioEnabled = false;
    } else {
        icon.classList.replace('fa-volume-mute', 'fa-volume-up');
        spaceAudio.volume = 0.3;
        isAudioEnabled = true;
        
        if (!isAudioPlaying) {
            spaceAudio.play().then(() => {
                isAudioPlaying = true;
            });
        }
    }
});

// ===== Progress Dot Navigation =====
progressDots.forEach(dot => {
    dot.addEventListener('click', function() {
        const level = this.getAttribute('data-level');
        goToLevel(parseInt(level));
        playTransitionSound();
    });
});

// ===== Basic Level Navigation =====
let currentLevel = 0;

function goToLevel(level) {
    zoomLevels.forEach(z => z.classList.remove('active'));
    zoomLevels[level].classList.add('active');
    
    progressDots.forEach(d => d.classList.remove('active'));
    progressDots[level].classList.add('active');
    
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
    "Earth — the only known life-bearing planet.",
    "The Solar System — the Sun and its orbiting worlds.",
    "The Orion Arm — our Milky Way neighborhood.",
    "The Milky Way — a barred spiral with billions of stars.",
    "The Local Group — our small galaxy cluster.",
    "The Virgo Supercluster — a vast galaxy concentration.",
    "Laniakea — our 520-million-light-year supercluster.",
    "The Observable Universe — all we can see from Earth.",
    "The Cosmic Web — the universe’s filament structure.",
    "The Universe — all space, time, and matter.",
    "The Multiverse — the idea of many universes."
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
    
    if (level > 6) {
        spaceAudio.volume = 0.4;
    } else {
        spaceAudio.volume = 0.3;
    }
    
    currentLevel = level;
}

// ===== Transition Sound Effect =====
function playTransitionSound() {
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
        if (currentLevel < zoomLevels.length - 1) {
            goToLevel(currentLevel + 1);
            playTransitionSound();
        }
    } else {
        if (currentLevel > 0) {
            goToLevel(currentLevel - 1);
            playTransitionSound();
        }
    }
    
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
    
    if (Math.abs(diff) > 50) {
        if (diff > 0) {
            if (currentLevel < zoomLevels.length - 1) {
                goToLevel(currentLevel + 1);
                playTransitionSound();
            }
        } else {
            if (currentLevel > 0) {
                goToLevel(currentLevel - 1);
                playTransitionSound();
            }
        }
    }
});

// ===== Initialize Everything =====
function init() {
    // Initialize cursor
    initCustomCursor();
    
    // Set first level as active
    goToLevel(0);
    
    // Auto-start audio on user interaction
    document.addEventListener('click', function initAudio() {
        if (!isAudioPlaying && isAudioEnabled) {
            spaceAudio.play().then(() => {
                isAudioPlaying = true;
            });
        }
        document.removeEventListener('click', initAudio);
    }, { once: true });
}

// Start initialization when page loads
window.addEventListener('load', init);

// Clean up trail particles when not needed
window.addEventListener('beforeunload', () => {
    stopTrail();
    trailParticles.forEach(particle => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    });
    trailParticles = [];
});



// ===== ENHANCED TRAIL CREATION =====
function createTrailParticle(x, y) {
    const particle = document.createElement('div');
    
    // Choose particle type
    const particleType = Math.random();
    if (particleType < 0.6) {
        particle.classList.add('trail-particle', 'engine-trail');
        // Larger engine particles
        const size = Math.random() * 25 + 15; // 15-40px
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
    } else if (particleType < 0.9) {
        particle.classList.add('trail-particle', 'smoke');
        // Even larger smoke particles
        const size = Math.random() * 35 + 20; // 20-55px
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
    } else {
        particle.classList.add('trail-particle', 'star');
        // Smaller star particles
        const size = Math.random() * 15 + 5; // 5-20px
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
    }
    
    // Calculate particle direction (behind spaceship)
    const angle = Math.atan2(mouseY - cursorY, mouseX - cursorX);
    const offset = 70; // Increased from 25px
    const adjustedX = x - Math.cos(angle) * offset;
    const adjustedY = y - Math.sin(angle) * offset;
    
    // Add some randomness to position
    const randomOffsetX = (Math.random() - 0.5) * 40;
    const randomOffsetY = (Math.random() - 0.5) * 40;
    
    particle.style.left = (adjustedX + randomOffsetX) + 'px';
    particle.style.top = (adjustedY + randomOffsetY) + 'px';
    
    // Set custom properties for animation
    const randomX = (Math.random() - 0.5) * 100;
    const randomY = (Math.random() - 0.5) * 100 + 50; // More downward drift
    
    particle.style.setProperty('--tx', randomX + 'px');
    particle.style.setProperty('--ty', randomY + 'px');
    
    trailContainer.appendChild(particle);
    trailParticles.push(particle);
    
    // Enhanced trail length for larger effect
    const MAX_TRAIL_LENGTH = 30; // Increased from 15
    
    // Limit trail length
    if (trailParticles.length > MAX_TRAIL_LENGTH) {
        const oldParticle = trailParticles.shift();
        if (oldParticle && oldParticle.parentNode) {
            oldParticle.parentNode.removeChild(oldParticle);
        }
    }
    
    // Remove particle after animation completes
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
        const index = trailParticles.indexOf(particle);
        if (index > -1) {
            trailParticles.splice(index, 1);
        }
    }, 2000); // Increased from previous duration
}