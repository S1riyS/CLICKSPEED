var clicks = 0; // clicks
var countdownValue = parseURLParams(window.location.href)['test_time'][0]; // seconds
var time = 0; // current time in timer
var cps = 0; // clicks per second

var counter = document.getElementById('counter');
var timerElement = document.getElementById('timer');
var cpsCounter = document.getElementById('cps');
var clickButton = document.getElementById('start-btn');

var isTestStarted = false;

// Получаем все url параметры
function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        params = {}, i, n, v, nv;

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

// Функция, которая отрабатывает при нажатии на "кнопку"
function trigger() {
    clicks++;
    counter.innerHTML = clicks;

    if (isTestStarted == false) {
        time = 0;
        isTestStarted = true;
        startTest();
    }
}

// Главная функция
function startTest() {
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

    }
    else {
        timer = setTimeout(startTest, 10);
    }
}
