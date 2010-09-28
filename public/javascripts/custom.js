// Innitiate Main Menu
$(document).ready(function() { 
	$('ul#menu').superfish(); 
}); 

//Homepage boxes
function equalHeight(group) {
	tallest = 0;
	group.each(function() {
		thisHeight = $(this).height();
		if(thisHeight > tallest) {
			tallest = thisHeight;
		}
	});
	group.height(tallest);
}
$(document).ready(function() {
	equalHeight($(".equalize"));
	equalHeight($(".equalize2"));
});


//News Scroller (Widget)
$(document).ready(function() {
 
 	$('.news-scroller').cycle({ 
	    fx: 'scrollVert',
		speed: 1000,
		rev: true,
		timeout: 4000,
		next: '.news-next', 
	    prev: '.news-previous'
	 });      
 
});


// Social Drop Down Panel 
$(document).ready(function() {
	$(".btn-slide").click( function() {
		if ($("#openCloseIdentifier").is(":hidden")) {
			$("#social").animate( {top: "0"} , 650 );
			$(this).addClass("active");
			$("#openCloseIdentifier").show();
		} else {
			$("#social").animate( {top: "-46px"} , 650 );
			$(this).removeClass("active");
			$("#openCloseIdentifier").hide();
		}
	});  
});


//Innititate Pretty Photo
$(document).ready(function(){
	$("a[rel^='lightbox']").prettyPhoto({theme:'light_rounded'});
});


//Contact Form
$(document).ready(function() {

	//Define URL to PHP mail file
	var url = "sendmail.html";
	
	//Activate jQuery form validation
	$("#jaybich-contact").validate({
	
		submitHandler: function() {
		
			//Define data string
			var datastring = $("#jaybich-contact").serialize();
			
			//Submit form
			$.ajax({
				type: "POST",
				url: url,
				data: datastring,
				success: function(){
					$('#jaybich-contact').slideUp();
					$('#sent').fadeIn();
				}
			});
		}
	
	});
			
});

//Comments Form
$(document).ready(function() {
	
	//Activate jQuery form validation
	$(".comments-form").validate();
			
});

//Portfolio thumbnail
$(document).ready(function(){

	$('.portfolio-box a').hover(function() {
		
		//Show darkenned hover over thumbnail image
		$(this).find('img').stop(true, true).animate({opacity:0.5},400);

	}, function() {
		
		//Hide darkenned hover over thumbnail image
		$(this).find('img').stop(true, true).animate({opacity:1},400);
			
	});

});



//Cufon text
Cufon.replace('h2, h3');