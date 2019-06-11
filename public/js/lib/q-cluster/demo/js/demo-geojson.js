$(document).ready(function(){
	
	var map = L.map('map').setView([8.54, 10], 6);
            
    map.addLayer(L.tileLayer('http://{s}.tiles.mapbox.com/v3/643gwozdz.h00dfolo/{z}/{x}/{y}.png', {}));
           
	$.ajax({
		context: this,
		type: 'GET',
		dataType: "json",
		url: 'data/nigeria-sample-small.geojson',
		success: function(data, textStatus, jqXHR){
			
			
			pointClusterer = new QCluster.PointClusterer(data, 'nigeria', map, 'nigeria-layer',
	                                                    {
	                                                        backgroundColor: '#0099dd',
	                                                        dataFormat: 'GeoJSON'
	                                                    });
			
		},
		error: function(jqXHR, textStatus, errorThrown){
			
		}
	});
	
});