let navigation,
    header

function setAtributes() {
    navigation = $('#header__nav');
    console.log(navigation)
    if (window.screen.width < 1201) {
        let header = $('header');
        navigation.css('top', header.outerHeight() + "px");
        navigation.addClass('box-shadow');
    } else {
        navigation.removeAttr('style');
        navigation.removeClass('box-shadow');
    }
}

setAtributes()
$(function () {
    $(window).resize(function () {
        setAtributes();
    })
})

$(document).on('click', '#menu-btn', function () {
    $(this).toggleClass('opened');
    $(this).attr('aria-expanded', this.classList.contains('opened'));
    console.log(navigation)
    if ($(this).hasClass('opened')) {
        navigation.css('opacity', 1);
    } else {
        navigation.css('opacity', 0);
    }
})
