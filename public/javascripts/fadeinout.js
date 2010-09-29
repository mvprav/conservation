// JavaScript Document for Fade in Out effect

$(document).ready(function () {

if ($.browser.msie && $.browser.version < 7) return; // Don't execute code if it's IE6 or below cause it doesn't support it.


// Main Page Hover Tiltes to effect the Images on top too.
$(function(){
	
	$('.columntitle1').hover(function() {
		$(".columnimage1").stop().fadeTo("fast", 0.6);
	},function(){
		$(".columnimage1").stop().fadeTo("fast", 1);	
	});
	
	$('.columntitle2').hover(function() {
		$(".columnimage2").stop().fadeTo("fast", 0.6);
	},function(){
		$(".columnimage2").stop().fadeTo("fast", 1);	
	});
	
	$('.columntitle3').hover(function() {
		$(".columnimage3").stop().fadeTo("fast", 0.6);
	},function(){
		$(".columnimage3").stop().fadeTo("fast", 1);	
	});
	
	$('.columntitle4').hover(function() {
		$(".columnimage4").stop().fadeTo("fast", 0.6);
	},function(){
		$(".columnimage4").stop().fadeTo("fast", 1);	
	});
	
});


  $(".fade").fadeTo(1, 1);
  $(".fade").hover(
    function () {
      $(this).stop().fadeTo("fast", 0.6);
    },
    function () {
      $(this).stop().fadeTo("fast", 1);
    }
  );
  
  $(".fadeaccordion").fadeTo(1, 0.8);
  $(".fadeaccordion").hover(
    function () {
      $(this).fadeTo("fast", 1);
    },
    function () {
      $(this).fadeTo("fast", 0.8);
    }
  );
  
  $(".overlay").fadeTo(1, 0.5);

  $(".captionfade").fadeTo(1, 0.8);
  $(".captionfade").hover(
    function () {
      $(this).fadeTo("fast", 0.9);
    },
    function () {
      $(this).fadeTo("slow", 0.8);
    }
  );
  
  $(".invfade").fadeTo(1, 0.5);
  $(".invfade").hover(
    function () {
      $(this).fadeTo("fast", 1);
    },
    function () {
      $(this).fadeTo("slow", 0.5);
    }
  );
  
  $(".photofade").fadeTo(1, 1);
  $(".photofade").hover(
    function () {
      $(this).fadeTo("fast", 0.88);
    },
    function () {
      $(this).fadeTo("fast", 1);
    }
  );
  
});
