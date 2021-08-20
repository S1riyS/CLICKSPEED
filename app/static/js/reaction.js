import {
    getRandomInt
} from './modules/random.js';
import {
    returnURL,
    followLink
} from './modules/send_result.js';

let testArea = document.querySelector("#test-area");

const maxRounds = 1;
let currentRound = 0,
    reactionTimeList = [],
    averageReaction = 0

let timeoutID,
    timeoutList = [],
    duration, startTime, endTime;


function setContent(icon, title, text = "", buttons = "") {
    let testIcon = document.querySelector("#test-area>.test-content>.test-icon"),
        testTitle = document.querySelector("#test-area>.test-content>.test-title"),
        testText = document.querySelector("#test-area>.test-content>.test-text"),
        testButtons = document.querySelector("#test-area>.test-content>.test-buttons");

    testIcon.innerHTML = icon;
    testTitle.innerHTML = title;
    testText.innerHTML = text;
    testButtons.innerHTML = buttons;
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

            reactionTimeList.push(duration);
            currentRound += 1;

            if (currentRound >= maxRounds) {
                let sum = reactionTimeList.reduce(function (acc, val) {
                    return acc + val;
                }, 0);
                console.log(sum, maxRounds)
                averageReaction = Math.round(sum / maxRounds);
                //                followLink(returnURL('Reaction', averageReaction));
                reactionTimeList = [];
                currentRound = 0;

                testArea.dataset.state = "final-score";
                setContent(
                    '<i class="fa fa-bolt" aria-hidden="true"></i>',
                    `${averageReaction} ms`,
                    "Save your score to see how you compare.",
                    '<button class="save-result-btn gradient-btn">Save result</button><button class="try-again-btn gradient-btn">Try again</button>'
                );
                averageReaction = 0;

            } else {
                testArea.dataset.state = "score";
                setContent(
                    '<i class="fa fa-clock-o" aria-hidden="true"></i>',
                    `${duration} ms`,
                    "Click to keep going"
                );
            };

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
