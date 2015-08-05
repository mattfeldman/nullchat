$('.fadeup').addClass('fade');
$('.fadeup').waypoint(function(direction) {
    $(this.element).addClass('fadeInUp');
}, { offset: '95%' });
