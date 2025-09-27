// app.js

const startButton = document.getElementById('start-btn');
const statusText = document.getElementById('status');
const sections = document.querySelectorAll('.section');
const galleryImageContainer = document.getElementById('gallery-image-container');
const galleryImage = document.getElementById('gallery-image');

// Image Array (10 Images)
const images = [
    "1.png",
    "2.png",
    "3.png",
    "4.png",
    "5.png",
    "6.png",
    "7.png",
    "8.png",
    "9.png",
    "10.jpg"
];

let currentImageIndex = 0; // Track the current image index

// Initialize SpeechRecognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;  // Keep listening after each command
recognition.interimResults = false; // Only give final result

recognition.onstart = () => {
    statusText.innerText = 'Status: Listening...';
};

recognition.onresult = (event) => {
    const transcript = event.results[event.resultIndex][0].transcript.toLowerCase();
    console.log(`Command received: ${transcript}`);
    processCommand(transcript);
};

recognition.onerror = (event) => {
    console.log('Error occurred: ', event.error);
    statusText.innerText = 'Status: Error. Please try again.';
};

startButton.onclick = () => {
    recognition.start(); // Start listening when button is clicked
    statusText.innerText = 'Status: Listening...';  // Show status
};

// Process commands from the user
function processCommand(command) {
    if (command.includes('home')) {
        navigate('home');
    } else if (command.includes('about')) {
        navigate('about');
    } else if (command.includes('contact')) {
        navigate('contact');
    } else if (command.includes('gallery')) {
        navigate('gallery');
    } else if (command.includes('next') || command.includes('next image')) {
        nextImage();
    } else if (command.includes('previous') || command.includes('previous image')) {
        previousImage();
    } else {
        statusText.innerText = 'Status: Command not recognized. Try again.';
    }
}

// Action functions
function navigate(section) {
    sections.forEach(sec => sec.classList.remove('active')); // Hide all sections
    document.getElementById(section).classList.add('active'); // Show the selected section
    statusText.innerText = `Status: Navigating to ${section.charAt(0).toUpperCase() + section.slice(1)}`;
}

function nextImage() {
    if (currentImageIndex < images.length - 1) {
        currentImageIndex++;
        galleryImage.src = images[currentImageIndex];
        statusText.innerText = `Status: Showing image ${currentImageIndex + 1}`;
    } else {
        statusText.innerText = 'Status: You are already at the last image!';
    }
}

function previousImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        galleryImage.src = images[currentImageIndex];
        statusText.innerText = `Status: Showing image ${currentImageIndex + 1}`;
    } else {
        statusText.innerText = 'Status: You are already at the first image!';
    }
}