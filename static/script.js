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
            if (currentTime > 0) {
                currentTime--;
                updateTime();
            } else {
                console.log('Time is up!');
                if (isWorkTime) {
                    console.log('Playing break sound');
                    playSound(660);
                    isWorkTime = false;
                    currentTime = breakTime;
                } else {
                    console.log('Playing work sound');
                    playSound(440);
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
    console.log(`Updated time: ${timeElement.textContent}`);
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}

function playSound(frequency) {
    try {
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
    } catch (error) {
        console.error('Error playing sound:', error);
    }
}

updateTime();

// Add color switching functionality
const colorSchemes = ['cool-blue', 'deep-purple', 'mint-green'];
let currentColorSchemeIndex = 0;

const timerElement = document.getElementById('timer');

startButton.addEventListener('click', () => {
    console.log('Start button clicked');
    isRunning = !isRunning;
    startButton.textContent = isRunning ? 'Stop' : 'Start';
    if (isRunning) {
        startTimer();
    }
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