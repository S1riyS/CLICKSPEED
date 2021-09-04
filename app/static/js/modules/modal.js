import {
    sendResult
} from './send_result.js';

export function getModalWindow() {
    const modalWindow = new bootstrap.Modal(document.getElementById('modal'))
    return modalWindow;
}

export function setModalValues(test_name, score, time) {
    const resultScore = $('#resultScore');
    const resultTime = $('#resultTime');
    resultScore.html(score);
    resultTime.html(time + " sec");
    $(document).on('click', '#save-result-btn', function () {
        sendResult(test_name, score, time)
        $("#save-result-btn").prop("onclick", null).off("click");
    })
}
