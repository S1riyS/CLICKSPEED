import {
    getRandomInt
} from './modules/random.js';

let testArea = document.querySelector("#test-area");

let timeoutID;
let timeoutList = [];
let duration, startTime, endTime;


function setContent(icon, title, text = "") {
    let testIcon = document.querySelector("#test-area>.test-content>.test-icon"),
        testTitle = document.querySelector("#test-area>.test-content>.test-title"),
        testText = document.querySelector("#test-area>.test-content>.test-text");

    testIcon.innerHTML = icon;
    testTitle.innerHTML = title;
    testText.innerHTML = text;
}

function startCountdown() {
    let delay = getRandomInt(2500, 3000)
    timeoutID = setTimeout(function () {
        startTime = Date.now();
        testArea.dataset.state = "go";
        setContent(
            '<i class="fa fa-ellipsis-h" aria-hidden="true"></i>',
            "Click!"
        )
    }, delay);
    timeoutList.push(timeoutID);
    return timeoutID
}

function clearTimeoutList() {
    timeoutList.forEach((e) => {
        clearTimeout(e)
    });
    timeoutList = [];
}

$("#test-area").mousedown(() => {
    console.log(timeoutList);
    switch (testArea.dataset.state) {
        case "splash":
            testArea.dataset.state = "waiting";
            setContent(
                '<i class="fa fa-ellipsis-h" aria-hidden="true"></i>',
                "Wait for green"
            );
            startCountdown();
            break;

        case "waiting":
            testArea.dataset.state = "failed";
            clearTimeoutList();
            setContent(
                '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>',
                "Too soon!",
                "Click to try again"
            );
            break;

        case "failed":
            testArea.dataset.state = "waiting";
            setContent(
                '<i class="fa fa-ellipsis-h" aria-hidden="true"></i>',
                "Wait for green"
            );
            startCountdown();
            break;

        case "go":
            endTime = Date.now();
            duration = endTime - startTime;
            
            testArea.dataset.state = "score";
            setContent(
                '<i class="fa fa-clock-o" aria-hidden="true"></i>',
                `${duration} ms`,
                "Click to keep going"
            );
            break;

        case "score":
            testArea.dataset.state = "waiting";
            setContent(
                '<i class="fa fa-ellipsis-h" aria-hidden="true"></i>',
                "Wait for green",
            );
            startCountdown();
            break;
    }
});