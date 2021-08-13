let navigation,
    header = $('#header');

function setAtributes() {
    navigation = $('#header__nav');
    if (window.screen.width < 1201) {
        let header = $('#header');
        navigation.addClass('box-shadow');
    } else {
        navigation.removeAttr('style');
        navigation.removeClass('box-shadow');
    }
}

setAtributes();

$(function () {
    $(window).resize(function () {
        setAtributes();
    })
})

$(document).on('click', '#menu-btn', function () {
    $(this).toggleClass('opened');
    $(this).attr('aria-expanded', this.classList.contains('opened'));
    navigation.css('top', header.outerHeight() + "px");
    if ($(this).hasClass('opened')) {
        $('body').addClass('stop-scrolling');
        navigation.css({
            'height': '100%',
            'padding': '20px'
        });
    } else {
        $('body').removeClass('stop-scrolling');
        navigation.css({
            'height': '0',
            'padding': '0px'
        });
    }
})
