let targetCreateInterval = 500; //milliseconds

let isGameStarted = false;
const gameSurface = document.getElementById("game-area");
const startGameButton = document.getElementsByClassName("game__start-btn")[0];

let score = 0;
let targetPerSecond = 0;
var countdownValue = parseURLParams(window.location.href)['test_time'][0];

var time = 0; // current time in timer

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

// Получаем все url параметры
function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        params = {},
        i, n, v, nv;

    if (query === url || query === "") return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!params.hasOwnProperty(n)) params[n] = [];
        params[n].push(nv.length === 2 ? v : null);
    }
    return params;
}

//Рандомное число от min до max   
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

//Инициализация теста
function startGame() {
    startGameButton.style.display = "none";
    isGameStarted = true;
    score = 0;
    time = 0;
    startTestLoop();
}

//Создание target
function drawTarget(x, y) {
    const element = document.createElement("div");
    element.className = "target";
    element.onclick = function () {
        hitTarget();
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
        x = getRandomInt(target["width"], gameSurface.offsetWidth - target["width"]);
        y = getRandomInt(target["height"], gameSurface.offsetHeight - target["height"]);
        drawTarget(x, y)
    }
}

function deleteAllTargets() {
    targets = document.getElementsByClassName("target")
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
