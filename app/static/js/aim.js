let isGameStarted = false;
const gameSurface = document.getElementById("game-area");
const startGameButton = document.getElementsByClassName("game__start-btn")[0];

// Target settings

target = {
    "width": 90,
    "height": 90,
    "background-color": "#ffffff"
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function startGame() {
    isGameStarted = true;
    x = getRandomInt(target["width"], gameSurface.offsetWidth - target["width"]);
    y = getRandomInt(target["height"], gameSurface.offsetHeight - target["height"]);
    console.log(gameSurface.offsetWidth)
    addTarget(x, y);
}



function addTarget(x, y) {
    const element = document.createElement("div");
    element.style.position = "absolute";
    element.style.width = target["width"] / 4 + "px";
    element.style.height = target["height"] / 4 + "px";
    element.style.backgroundColor = target["background-color"];
    element.style.borderRadius = "50%";
    element.style.backgroundClip = "content-box";
    element.style.padding = target["width"] / 4 + "px";
    element.style.border = `${target["width"] / 4}px solid ${target["background-color"]}`;
    element.style.top = y + "px";
    element.style.left = x + "px";

    gameSurface.appendChild(element);
}

let timerId = setTimeout(function tick() {

    timerId = setTimeout(tick, 2000); // (*)
}, 2000);
