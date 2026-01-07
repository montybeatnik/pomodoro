let workTime = 25 * 60; // 25 minutes in seconds
let breakTime = 5 * 60; // 5 minutes in seconds
let currentTime = workTime;
let isRunning = false;
let isWorkTime = true;

const timeElement = document.getElementById('time');
const workTimeInput = document.getElementById('work-time');
const breakTimeInput = document.getElementById('break-time');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');

startButton.addEventListener('click', () => {
    if (!isRunning) {
        isRunning = true;
        startButton.textContent = 'Stop';
        startTimer();
    } else {
        isRunning = false;
        startButton.textContent = 'Start';
    }
});

resetButton.addEventListener('click', () => {
    isRunning = false;
    startButton.textContent = 'Start';
    currentTime = workTime;
    isWorkTime = true;
    updateTime();
});

workTimeInput.addEventListener('change', (e) => {
    workTime = parseInt(e.target.value) * 60;
    if (!isRunning) {
        currentTime = workTime;
        updateTime();
    }
});

breakTimeInput.addEventListener('change', (e) => {
    breakTime = parseInt(e.target.value) * 60;
});

function startTimer() {
    const intervalId = setInterval(() => {
        if (isRunning) {
            currentTime--;
            updateTime();

            if (currentTime <= 0) {
                if (isWorkTime) {
                    playSound(660); // Hz (E5 note)
                    isWorkTime = false;
                    currentTime = breakTime;
                } else {
                    playSound(440); // Hz (A4 note)
                    isWorkTime = true;
                    currentTime = workTime;
                }
            }
        } else {
            clearInterval(intervalId);
        }
    }, 1000);
}

function updateTime() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    timeElement.textContent = `${padZero(minutes)}:${padZero(seconds)}`;
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}

function playSound(frequency) {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    oscillator.connect(audioContext.destination);
    oscillator.start();
    setTimeout(() => {
        oscillator.stop();
        audioContext.close();
    }, 2000); // Play sound for 2 seconds
}

updateTime();

// Add color switching functionality
const colorSchemes = ['cool-blue', 'deep-purple', 'mint-green'];
let currentColorSchemeIndex = 0;

const timerElement = document.getElementById('timer');

startButton.addEventListener('click', () => {
    // ... (rest of the event listener code remains the same)

    // Switch color scheme on every start
    currentColorSchemeIndex = (currentColorSchemeIndex + 1) % colorSchemes.length;
    timerElement.classList = colorSchemes[currentColorSchemeIndex];
});

// Initialize the color scheme
timerElement.classList = colorSchemes[currentColorSchemeIndex];

resetButton.addEventListener('click', () => {
    fetch('/reset_timer', { method: 'POST' })
        .then(response => response.json())
        .then(data => console.log(data.message));

    isRunning = false;
    startButton.textContent = 'Start';
    currentTime = workTimeInput.value * 60;
    isWorkTime = true;
    updateTime();
});