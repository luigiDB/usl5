$(document).ready(function() {
    console.log("deviceready");
    
    console.log("___handler inizialization");
    
    console.log("__map handler");
    ////////////////////////////////////////////////////////////////////////////
    $(document).on("pageshow","#mappa",function(){       //pageshow is thrown each time
        console.log("dentro script"); 
        //setting div height
        $("#map_canvas").height( $(window).height() - $("div[data-role='header']").height() - 32 );
                        
        //since page show is thrown each time i use a session storage variable
        //so i make the init map only one time
        if( !sessionStorage.mapinit ) {
            console.log("----------mapinit is not set");
            sessionStorage.mapinit=1;
            console.log("----------mapinit=1");
            // Initialize the map plugin
            var mapDiv = document.getElementById("map_canvas");
            var map = plugin.google.maps.Map.getMap(mapDiv);
            
            map.setMyLocationEnabled(true);
            var pisaCenter = new plugin.google.maps.LatLng(43.723072, 10.396585);
            map.setCenter(pisaCenter);
            map.setZoom(13);
            map.one(plugin.google.maps.event.MAP_READY, onMapInit);
        } else {
            console.log("----------map already set");
            var mapDiv = document.getElementById("map_canvas");
            var map = plugin.google.maps.Map.getMap(mapDiv);
        }  
    });
    
    $(document).on("pageshow","#sedi",function(){
        console.log("/\/\/\/\/\/\/\/\/\/\/\/\\ sedi");
    });
                
    function onMapInit(map) {
        console.log("**********onMapInit");
        $.support.cors=true;
        $.mobile.allowCrossDomainPages = true;
        $.getJSON('http://www.aimini.it/provaluigi/sedi.php?sedi=allLatLon&callback=?',function(data){
            $.each(data, function(i, dat){
                // dat.i -> address
                //dat.d -> names
                console.log("indirizzo "+i+"  "+dat.i+" pisa"+"   "+dat.d);
                var request = {
                    'address': dat.i+" pisa"
                };
                map.geocode(request, function(results) {
                    console.log("     geocoding "+i);
                    if (results.length) {
                        var result = results[0];
                        var position = result.position; 
      
                        map.addMarker({
                            'position': position,
                            'title':  dat.d,
                            'draggable': false
                            }, function(marker) {
        
                                marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function() {
                                    this.showInfoWindow();
                                });
        
                                marker.addEventListener(plugin.google.maps.event.INFO_CLICK, function() {
                                    //evento scatenato al click del pannello informativo
                                    //deve fare qualcosa simile al codice seguente 
                                    //verificare se più comodo l'evento o nel listener precedente un campo di tipo link
                                    //<a href="sediDettaglio.html" onclick="sessionStorage.setItem(\'sede\', this.text );">'+dat.nam+'</a>
                                });		
                            });
                    } else {
                        console.log("Not found: "+dat.i+" pisa");
                        //alert("Not found");
                    }
                });
            });
        });
    }
    
});