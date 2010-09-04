$.widget
("common.multiPhotoUpload",{

    _init:function(){
	var multi_selector = new MultiSelector( this.element.get()[0], 3 );
	multi_selector.addElement( document.getElementById( 'photos' ) );
    }
 
})