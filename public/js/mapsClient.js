
$(document).ready(function(){ 
    
    //if(navigator.geolocation) navigator.geolocation.getCurrentPosition(handleGetCurrentPosition, handle_errors);
	
    //$('#mapLat').html("<b> 1 </b>");
    //$('#mapLong').html("<b> 2 </b>");
    
});
    
    
function handleGetCurrentPosition(location){
    
    var latHtml = "<b>" + location.coords.latitude + "</b>";
    var longHtml = "<b>" + location.coords.longitude + "</b>";
    
    $('#mapLat').html(latHtml);
    $('#mapLong').html(longHtml);
    
    //var timestamp = moment(location.timestamp);
    //console.log( timestamp.format("HH/mm/ss") );
    var timest = moment().format('HH:mm:ss');
    
    $('#mapTime').html(timest);
    
    console.dir(location);
    
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: location.coords.latitude, lng: location.coords.longitude},
      zoom: 15
    });
    
      
    var marker = new google.maps.Marker({
        position: {lat: location.coords.latitude, lng: location.coords.longitude},
        map: map,
        icon : {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 4,
            fillColor: 'blue',
            strokeColor: 'blue',
            fillOpacity: 0.8,
            strokeWeight: 2 
            
            
          },
        title: 'position'
    });
    marker.setMap(map);
      
}



  function initMap() {
    if(navigator.geolocation) navigator.geolocation.getCurrentPosition(handleGetCurrentPosition, handle_errors);
  }


 function handle_errors(error){
    switch(error.code)
    {
        case error.PERMISSION_DENIED: alert("user did not share geolocation data");
        break;

        case error.POSITION_UNAVAILABLE: alert("could not detect current position");
        break;

        case error.TIMEOUT: alert("retrieving position timed out");
        break;

        default: alert("unknown error");
        break;
    }
}