$(function () {
	//Hides the Slide Images and Panel Texts for Preloading
	$('.slideimage').hide();
	
	$('.slide-minicaption').hide();
	$('.slide-minicaptiontitle').hide();
	$('.slidecaption').hide();
	$('.slidecaptiontitle').hide();
	
	var slidenos = $('.slideimage').length;
	
});

var i;

$(window).bind("load", function() {

	//Preload

	var slidenos = $('.slideimage').length;

		$('.slideimage:hidden').fadeIn(800);

	

		$(".kwicks.horizontal li").css('background', '#fff');
		
		$('.slide-minicaption').show();
		$('.slide-minicaptiontitle').show();
		$('.slidecaption').show();
		$('.slidecaptiontitle').show();

		$('.kwicks').kwicks({
			max : 660,
			spacing : 0
		});
		


});

$(function(){

	//Hide all Captions and Mini Captions
	$(".slidecaption").fadeTo(1, 0);
	$(".slide-minicaption").fadeTo(1, 0.8);


	//On hover of a Kwick Panel
	//The Following Block is repeated for every Kwick Panel added
	//Basically It Hide the mini captions - Shows the hovered Panel with Full Caption and Fades the rest.
	//On Mouse Out it resets things back with mini captions
	//If you Add another Panel Simply Duplicate this block with additional kwickblock#
	$('#kwickblock1').hover(function() {
		$(".slide-minicaption").stop().fadeTo("fast", 0);	// Hide Mini Caption
		$('#kwickblock1 .slidecaption').stop().fadeTo("slow", 0.8);	// Show Fullcaption
		$("#kwickblock1 .slideimage").stop().fadeTo("slow", 1);	// Show Image in without transparency
		$("#kwickblock2 .slideimage,#kwickblock3 .slideimage,#kwickblock4 .slideimage,#kwickblock5 .slideimage,#kwickblock6 .slideimage").stop().fadeTo("slow", 0.3);	// Fade the rest of the kwich panels
	},function(){
		$('.slidecaption').stop().fadeTo("slow", 0);	// Hide fullcaption on mouse out
		$(".slide-minicaption").stop().fadeTo("slow", 0.8);	// Show minicaption
		$(".slideimage").stop().fadeTo("slow", 1);	// Show all kwicks wihout transparency again
	});
	
	$('#kwickblock2').hover(function() {
		$(".slide-minicaption").stop().fadeTo("slow", 0);
		$('#kwickblock2 .slidecaption').stop().fadeTo("slow", 0.8);
		$("#kwickblock2 .slideimage").stop().fadeTo("slow", 1);
		$("#kwickblock1 .slideimage,#kwickblock3 .slideimage,#kwickblock4 .slideimage,#kwickblock5 .slideimage,#kwickblock6 .slideimage").stop().fadeTo("slow", 0.3);
	},function(){
		$('.slidecaption').stop().fadeTo("slow", 0);
		$(".slide-minicaption").stop().fadeTo("slow", 0.8);
		$(".slideimage").stop().fadeTo("slow", 1);	
	});
	
	$('#kwickblock3').hover(function() {
		$(".slide-minicaption").stop().fadeTo("slow", 0);
		$('#kwickblock3 .slidecaption').stop().fadeTo("slow", 0.8);
		$("#kwickblock3 .slideimage").stop().fadeTo("slow", 1);
		$("#kwickblock1 .slideimage,#kwickblock2 .slideimage,#kwickblock4 .slideimage,#kwickblock5 .slideimage,#kwickblock6 .slideimage").stop().fadeTo("slow", 0.3);
	},function(){
		$('.slidecaption').stop().fadeTo("slow", 0);
		$(".slide-minicaption").stop().fadeTo("slow", 0.8);
		$(".slideimage").stop().fadeTo("slow", 1);	
	});
	
	$('#kwickblock4').hover(function() {
		$(".slide-minicaption").stop().fadeTo("slow", 0);
		$('#kwickblock4 .slidecaption').stop().fadeTo("slow", 0.8);
		$("#kwickblock4 .slideimage").stop().fadeTo("slow", 1);
		$("#kwickblock1 .slideimage,#kwickblock2 .slideimage,#kwickblock3 .slideimage,#kwickblock5 .slideimage,#kwickblock6 .slideimage").stop().fadeTo("slow", 0.3);
	},function(){
		$('.slidecaption').stop().fadeTo("slow", 0);
		$(".slide-minicaption").stop().fadeTo("slow", 0.8);
		$(".slideimage").stop().fadeTo("slow", 1);
	});
	
	$('#kwickblock5').hover(function() {
		$(".slide-minicaption").stop().fadeTo("slow", 0);
		$('#kwickblock5 .slidecaption').stop().fadeTo("slow", 0.8);
		$("#kwickblock5 .slideimage").stop().fadeTo("slow", 1);
		$("#kwickblock1 .slideimage,#kwickblock2 .slideimage,#kwickblock3 .slideimage,#kwickblock4 .slideimage,#kwickblock6 .slideimage").stop().fadeTo("slow", 0.3);
	},function(){
		$('.slidecaption').stop().fadeTo("slow", 0);
		$(".slide-minicaption").stop().fadeTo("slow", 0.8);
		$(".slideimage").stop().fadeTo("slow", 1);
	});
	
	$('#kwickblock6').hover(function() {
		$(".slide-minicaption").stop().fadeTo("slow", 0);
		$('#kwickblock6 .slidecaption').stop().fadeTo("slow", 0.8);
		$("#kwickblock6 .slideimage").stop().fadeTo("slow", 1);
		$("#kwickblock1 .slideimage,#kwickblock2 .slideimage,#kwickblock3 .slideimage,#kwickblock4 .slideimage,#kwickblock5 .slideimage").stop().fadeTo("slow", 0.3);
	},function(){
		$('.slidecaption').stop().fadeTo("slow", 0);
		$(".slide-minicaption").stop().fadeTo("slow", 0.8);
		$(".slideimage").stop().fadeTo("slow", 1);
	});


	
});