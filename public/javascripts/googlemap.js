$.widget
('map.mapWithSingleMarker',{
    marker:null,
    options:{from_server: false,edit_marker:true},
    _init: function(){
	this._initialize(this.element)
    },
    _initialize:function (mapDiv) {

	
	var latlng

	if (!this.options.from_server)
	{
	    latlng  = new google.maps.LatLng(13.341520159660119, 76.70654296875);  
	}
	else
	{
	    latlng  = new google.maps.LatLng(13.341520159660119, 76.70654296875);  
	}

	var myOptions = {
	    zoom: 7,
	    center: latlng,
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var self
	self=this
	var map = new google.maps.Map(mapDiv.get()[0],myOptions);
	

	if(this.options.edit_marker)
	{
	    google.maps.event.addListener(map, 'click', function(event) {
		placeMarker(event.latLng,self);
	    });
	}
	
	if(this.options.from_server)
	{
	    var latlng  = new google.maps.LatLng($("#"+this.options.lat).val(),$("#"+this.options.lng).val());
	    var marker = new google.maps.Marker({
		position: latlng, 
		map:map,
		dragable: true
	    });
	}
	
	function placeMarker(location,self) {
	    var clickedLocation = new google.maps.LatLng(location);
	    if(self.marker==null)
	    {
		self.marker = new google.maps.Marker({
		    position: location, 
		    map: map,
		    dragable: true
		});
	    }
	    self.marker.setPosition(location);
	    $("#report_lat").val(self.marker.position.lat())
	    $("#report_lng").val(self.marker.position.lng())
      }
  }
})

$.widget("map.multipleMarker",{
    map:null,
    initialized:false,
    _init: function(){
	if(!this.initialized)
	this.initialize()
	this.updateMarkers()
    },
    initialize:function () {
	this.initialized=true;
	var latlng
	latlng  = new google.maps.LatLng(13.341520159660119, 76.70654296875);
	var myOptions = {
	    zoom: 7,
	    center: latlng,
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	this.map = new google.maps.Map(document.getElementById("map"),
				      myOptions);

	
    },
    updateMarkers:function(){
	
	var self
	self=this;
	$.ajax({ url: "reports_json?"+$("form").serialize(), success: function(data){
	    $.each(data,function(index,val){
		var report=val.report
		if(val.report.lat!=null && val.report.lng!=null){
		    var infowindow = new google.maps.InfoWindow({
			content: self.infoContent(report),
			maxWidth:400
		    });
		    var latlng  = new google.maps.LatLng(val.report.lat,val.report.lng);
		    self.marker = new google.maps.Marker({
			position: latlng, 
			map: self.map,
			dragable: false,
			title:report.title

		    });
		    google.maps.event.addListener(self.marker, 'click', function() {
			infowindow.open(self.map,self.marker);
		    });
		}
	    })
	}})
    },
    infoContent:function(report){
	var contentString = '<div id="content">'+
	    '<div id="siteNotice">'+
	    '</div>'+
	    '<h1 id="firstHeading" class="firstHeading">'+report.title+'</h1>'+
	    '<div id="bodyContent">'+
	    '<p><b>Category :</b> '+report.category.name+
	    '<br/><b>Location :</b> '+ report.location.name+
	    '<br/><b>Report :</b> <a href="/reports/'+report.id+'">' +
	    'http://conservationthreats.org/reports/'+report.id+
	    '</div>'+
	    '</div>';

	return contentString;
    }



	       
})