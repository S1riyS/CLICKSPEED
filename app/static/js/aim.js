import { parseURLParams } from './modules/url_parser.js';
import { getRandomInt } from './modules/random.js';
import {
    returnURL,
    followLink
} from './modules/send_result.js';


let isGameStarted = false,
    score = 0,
    targetPerSecond = 0,
    countdownValue = parseURLParams(window.location.href)['test_time'][0],
    time = 0, // current time in timer
    timer,
    targetCreateInterval = 500; //milliseconds


const gameSurface = document.getElementById("game-area"),
    startGameButton = document.getElementById("start-btn"),
    timerElement = document.getElementById('timer'),
    targetPerSecondElement = document.getElementById('targetPerSecond'),
    scoreElement = document.getElementById('score');


// Target settings
const target = {
    "width": 70,
    "height": 70,
    "main-color": "rgb(244 123 53)",
    "background-color": "rgb(255 255 255)",
    "animation-time": 5
}

//Инициализация теста
function startGame() {
    startGameButton.style.display = "none";
    isGameStarted = true;
    score = 0;
    time = 0;
    startTestLoop();
}
startGameButton.onclick = startGame;

//Создание target
function drawTarget(x, y) {
    const element = document.createElement("div");
    element.className = "target";
    element.onclick = function () {
        hitTarget();
        this.remove();
    };
    element.style.position = "absolute";
    element.style.top = y + "px";
    element.style.left = x + "px";
    element.style.width = target["width"] + "px";
    element.style.height = target["height"] + "px";

    element.style.backgroundColor = target["main-color"];
    element.style.borderRadius = "50%";
    element.style.boxShadow =
        `${target["main-color"]} 0px 0px 0px ${target["width"] / 6.5}px inset, ${target["background-color"]} 0px 0px 0px ${target["width"] / 3}px inset`;
    element.style.animation = `targetAppearance ${target["animation-time"]}s ease`;

    gameSurface.appendChild(element);

    setTimeout(function () {
        element.remove();
    }, target["animation-time"] * 1000)
}

function createTarget() {
    if (isGameStarted) {
        let x = getRandomInt(target["width"], gameSurface.offsetWidth - target["width"]);
        let y = getRandomInt(target["height"], gameSurface.offsetHeight - target["height"]);
        drawTarget(x, y)
    }
}

function deleteAllTargets() {
    let targets = document.getElementsByClassName("target")
    while (targets.length) {
        targets[0].parentNode.removeChild(targets[0]);
    }
}

function hitTarget() {
    score++;
    scoreElement.innerHTML = score;
    let sound = document.getElementById("click-sound");
    sound.play();
}

// Игровой цикл
function startTestLoop() {
    clearInterval(timer);
    timer = setInterval(() => {
        time += 10;
        let dateTimer = new Date(time);
        let currentTime = 
            dateTimer.getUTCSeconds() + '.' + 
            ('0' + dateTimer.getUTCMilliseconds()).slice(-3, -1);
        
        timerElement.innerHTML = currentTime;
        targetPerSecondElement.innerHTML = (score / parseFloat(currentTime)).toFixed(2);
        
        if (time >= countdownValue * 1000) {
            targetPerSecond = (score / parseFloat(currentTime)).toFixed(2)
            followLink(returnURL('Aim', targetPerSecond, countdownValue))
            deleteAllTargets();
            timerElement.innerHTML = countdownValue + ".00"
            startGameButton.style.display = "flex";
            isGameStarted = false;
            clearInterval(timer);
        }
    }, 10)
}

//Отрисовка target раз в N миллисек
setInterval(createTarget, targetCreateInterval);