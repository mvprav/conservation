$.widget
('map.mapWithSingleMarker',{
    marker:null,
    _init: function(){
	
	this._initialize(this.element)
    },
    _initialize:function (mapDiv) {
	var latlng
	latlng  = new google.maps.LatLng(13.341520159660119, 76.70654296875);
	var myOptions = {
	    zoom: 7,
	    center: latlng,
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	self=this
	var map = new google.maps.Map(mapDiv.get()[0],myOptions);
	
	google.maps.event.addListener(map, 'click', function(event) {
	    placeMarker(event.latLng,self);
	});

	
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
	self=this;
	$.ajax({ url: "reports_json?"+$("form").serialize(), success: function(data){
	    $.each(data,function(index,val){
		if(val.report.lat!=null && val.report.lng!=null){
		    var latlng  = new google.maps.LatLng(val.report.lat,val.report.lng);
		    self.marker = new google.maps.Marker({
			position: latlng, 
			map: self.map,
			dragable: true
		    });
		}
	    })
	}})
    }

	       
})