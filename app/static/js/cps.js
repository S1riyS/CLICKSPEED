import {
    parseURLParams
} from './modules/url_parser.js';
import {
    returnURL,
    followLink
} from './modules/send_result.js';

let isTestStarted = false,
    clicks = 0, // clicks
    cps = 0, // clicks per second
    countdownValue = parseURLParams(window.location.href)['test_time'][0], // seconds
    time = 0, // current time in timer
    timer;

const counter = document.querySelector('#counter'),
    timerElement = document.querySelector('#timer'),
    cpsCounter = document.querySelector('#cps'),
    clickButton = document.querySelector('#start-btn'),
    clickArea = document.querySelector('#click-area');

document.addEventListener("click", function (e) {
    console.log(e.target);
});
// Функция, которая отрабатывает при нажатии на "кнопку"
function clickOnButton() {
    clicks++;
    counter.innerHTML = clicks;

    if (isTestStarted == false) {
        time = 0;
        isTestStarted = true;
        startTestLoop();
        clickButton.innerHTML = '';
    }
}
clickArea.onclick = clickOnButton;

//Удаление/добавление класса ripple (мобильное устройсвтво/ПК)
$(function () {
    $(window).on('load resize', function () {
        console.log($(window).width());
        if ($(window).width() > 1201) {
            clickArea.classList.add('ripple');
            clickButton.onclick = clickOnButton;
        } else {
            clickArea.classList.remove('ripple');
            clickButton.onclick = undefined;

        }
    })
})

function updateHTML(time) {
    let dateTimer = new Date(time);
    let currentTime =
        dateTimer.getUTCSeconds() + '.' +
        ('0' + dateTimer.getUTCMilliseconds()).slice(-3, -1);

    timerElement.innerHTML = currentTime
    cpsCounter.innerHTML = (clicks / (time / 1000)).toFixed(2);
}
// Главная функция
function startTestLoop() {
    clearInterval(timer);

    timer = setInterval(() => {
        time += 10;
        updateHTML(time);

        if (time >= countdownValue * 1000) {
            cps = (clicks / (time / 1000)).toFixed(2)
            //            console.log(returnURL('CPS', cps, countdownValue));
            followLink(returnURL('CPS', cps, countdownValue))
            timerElement.innerHTML = countdownValue + ".00";
            clicks = 0;
            cps = 0;
            clickButton.innerHTML = 'Click here to start playing';
            clearInterval(timer);
            isTestStarted = false;
        }
    }, 10)
}
