let workTime = 25 * 60; // 25 minutes in seconds
let breakTime = 5 * 60; // 5 minutes in seconds
let currentTime = workTime;
let isRunning = false;
let isWorkTime = true;

const timeElement = document.getElementById('time');
const workTimeInput = document.getElementById('work-time');
const breakTimeInput = document.getElementById('break-time');
const startButton = document.getElementById('start-button');

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

workTimeInput.addEventListener('change', (e) => {
    workTime = parseInt(e.target.value) * 60;
    currentTime = workTime;
    updateTime();
});

breakTimeInput.addEventListener('change', (e) => {
    breakTime = parseInt(e.target.value) * 60;
});

function startTimer() {
    const intervalId = setInterval(() => {
        if (isRunning) {
            currentTime--;
            updateTime();

            if (currentTime === 0) {
                if (isWorkTime) {
                    // Play sound when work time ends
                    playSound(660); // Hz (E5 note)
                    isWorkTime = false;
                    currentTime = breakTime;
                } else {
                    // Play sound when break time ends
                    playSound(440, 2000); // Hz (A4 note)
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