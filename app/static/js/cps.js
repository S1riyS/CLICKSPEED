import {
    parseURLParams
} from './modules/url_parser.js';

let isTestStarted = false,
    clicks = 0, // clicks
    cps = 0, // clicks per second
    countdownValue = parseURLParams(window.location.href)['test_time'][0], // seconds
    time = 0, // current time in timer
    timer;

const counter = document.getElementById('counter'),
    timerElement = document.getElementById('timer'),
    cpsCounter = document.getElementById('cps'),
    clickButton = document.getElementById('start-btn'),
    clickArea = document.getElementById('click-area');


// Функция, которая отрабатывает при нажатии на "кнопку"
function startGame() {
    clicks++;
    counter.innerHTML = clicks;

    if (isTestStarted == false) {
        time = 0;
        isTestStarted = true;
        startTestLoop();
    }
}
clickButton.onclick = startGame;
clickArea.onclick = startGame;

// Главная функция
function startTestLoop() {
    time++;
    timerElement.innerHTML = (time / 100).toFixed(2);
    cpsCounter.innerHTML = (clicks / (time / 100)).toFixed(2);
    clickButton.innerHTML = '';

    if (time >= countdownValue * 100) {
        clicks = 0;
        cps = 0;
        clickButton.innerHTML = 'Click here to start playing';
        clearTimeout(timer);
        isTestStarted = false;

    } else {
        timer = setTimeout(startTestLoop, 10);
    }
}
