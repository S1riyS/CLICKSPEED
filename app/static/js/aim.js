import { parseURLParams } from './modules/url_parser.js';
import { getRandomInt } from './modules/random.js';

let targetCreateInterval = 500; //milliseconds

let isGameStarted = false;
const gameSurface = document.getElementById("game-area");
const startGameButton = document.getElementsByClassName("game__start-btn")[0];

let score = 0;
let targetPerSecond = 0;
var countdownValue = parseURLParams(window.location.href)['test_time'][0];

var time = 0; // current time in timer
let timer;

const timerElement = document.getElementById('timer');
const targetPerSecondElement = document.getElementById('targetPerSecond');
const scoreElement = document.getElementById('score');


// Target settings
let target = {
    "width": 50,
    "height": 50,
    "main-color": "rgb(244 123 53)",
    "background-color": "rgb(255 255 255)"
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
        $(this).remove();
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

    gameSurface.appendChild(element);
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
}

// Игровой цикл
function startTestLoop() {
    time++;
    timerElement.innerHTML = (time / 100).toFixed(2);
    targetPerSecondElement.innerHTML = (score / (time / 100)).toFixed(2);

    if (time >= countdownValue * 100) {
        clearTimeout(timer);
        deleteAllTargets();
        startGameButton.style.display = "flex";
        isGameStarted = false;

    } else {
        timer = setTimeout(startTestLoop, 10);
    }
}

//Отрисовка target раз в N миллисек
setInterval(createTarget, targetCreateInterval);
