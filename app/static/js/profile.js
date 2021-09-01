const tableWrapper = $('.table-wrapper');
const rows = $('#table-activity-feed>tbody>tr:gt(3)');

$('#table-activity-feed>tbody>tr:gt(3)').each(function () {
    $(this).css('display', 'none')
});


$(document).on('click', '.show-hide-btn', function () {
    if (tableWrapper.attr('aria-expanded') == 'true') {
        rows.each(function () {
            $(this).css('display', 'none');
            tableWrapper.attr('aria-expanded', 'false');
        })
    } else {
        rows.each(function () {
            $(this).css('display', '');
            tableWrapper.attr('aria-expanded', 'true');
        })
    }
})
