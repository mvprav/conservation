$(function () {	$('.loopslide').hide();	});$(window).bind("load", function() {	$('.container').css('background', 'none');		$('.loopslide:hidden').fadeIn(800);		$('#loopedSlider').loopedSlider({		addPagination: true,		containerClick: false,		autoStart: 8000	});});