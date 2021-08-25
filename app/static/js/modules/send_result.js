export function sendResult(test_name, score, test_time = null) {
    $.ajax({
        url: '/send_result',
        type: 'POST',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({
            test_name: test_name,
            score: score,
            test_time: test_time
        })
    })
}
