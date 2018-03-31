
var QCluster = (function(module){

	module.Utils = (function (utils) {
        
        utils.FacetColorLibrary = function(facetId, facetName, facetValues, propMap, opts) {
	
            var color,
                options,
                index,
                colorPalette,
                maxColors,
                otherColor,
                facet;
            
            options = opts || {};
                    
            colorPalette = options.colorPalette || ['#8b722c', '#e7dfc7', '#040707', '#c96228', 
                                                    '#80adc0', '#a19788', '#ddecf2', '#9e0000', 
                                                    '#03671f', '#8e2b5c', '#e13066', '#5c8276', 
                                                    '#efa0cb', '#62517b', '#2c688b', '#56c2a7', 
                                                    '#e1df2f', '#ed3333', '#e69890', '#545454']; 
                
            maxColors = options.maxColors || 50;
            
            otherColor = options.otherColor || '#666666';
            
                facet = {
                    
                    'id': facetId,
                    'name': facetName,
                    'values_keyVal' : {},
                    'values_arr': [],
                    'otherColor': otherColor
                    
                };	
                
                // Loop thru each classification
                _.each(facetValues, function(fVal, i){
                    
                    var facetValue = {
                        'id': fVal[propMap.id],
                        'name': fVal[propMap.name], 
                        'color': fVal[propMap.color], 
                    };
                    
                    if(typeof facetValue.color === 'undefined' || facetValue.color === null) {
                        
                        if (i > maxColors - 1) {
                            facetValue.color = otherColor;
                        
                        } else if (i > colorPalette.length - 1) {
                            
                            index = (i % colorPalette.length) - 1;
                            facetValue.color = colorPalette[index];
                        
                        } else {
                            
                            facetValue.color = colorPalette[i];					
                        }				
                    }
                    
                    facet.values_keyVal[facetValue.id] = facetValue;
                    
                    facet.values_arr.push(facetValue);
                });
        
            return facet;
        };

	    utils.HypotenuseOfMapAsInt = function(map) {
            var el = $(map.getContainer());
            var w = el.width();
            var h = el.height();
            return Math.floor(Math.sqrt(w*w+h*h));
        }

		return utils;

	}(module.Utils || {}));

	return module;

}(QCluster || {}));


/**
 * @author Rich Gwozdz
 * @created_date 
 */

var QCluster = (function(module){
	
	// Private methods
	var addPinsWithinRange;
	
	addPinsWithinRange = function(points, index, direction, currentCluster, resolution, tolerance){
	
		var clusterwidth,
			finished,
			searchindex,
			pMax,
			xDis,
			yDis;
			
	
		//Cluster width & heigth are in pixels. So any point within 20 pixels at the zoom level will be clustered.
	    clusterwidth = tolerance; // Cluster region width, all points within this area are clustered
		finished = false; // flag
	    searchindex = index + direction;
	    pMax = points.length;
	
		// Loop thru the points array
		while (!finished)
	    {
	    	
	    	// Stop if outside array bounds
	    	if (searchindex >= pMax || searchindex < 0)
	        {
	            finished = true;
	        }
	        else
	        {
	        	// continue if this point has not yet been placed into an existing cluster
	        	if (!points[searchindex].c)
	            {
	                //find distance between two points ( the initial point and one of the other points 'close' to it).
	                xDis = Math.abs(points[searchindex].x - points[index].x) / resolution;
	                yDis = Math.abs(points[searchindex].y - points[index].y) / resolution;
	                
	                if ( xDis < clusterwidth) // the x distance between the two points is within the cluster tolerance
	                {
	                    if (yDis < clusterwidth) // the y distance between the two points is within the cluster tolerance
	                    {
	                        //add to cluster
	                        currentCluster.points.push(points[searchindex]);
	                      	
	                      	//this point represents a cluster...
	                        currentCluster.c = true;
	                        
	                        points[searchindex].c = true;
						}
	
							
					}
					else // we have reached a point whose x distance from the initial point is > the cluster tolerance
	            	{
						/* We have reached a point whose y distance from the initial point is > the cluster tolerance
						/ we assume subsequent points in the list will also be beyond the cluster tolerance since the 
						/ the list is sorted by location grid (GEOREF)
						*/
	                	finished = true;
	            	}
	
	            }
	            //increment the search index
	       	 	searchindex += direction;
	   		}
	        
	    }	
	};
	
	// Public Methods
  module.clusterPoints = function (points, mapBounds, resolution, clusterTolerance) {

    function withinBounds(x, y, xmin, xmax, ymin, ymax) {
      if (x > xmax || x < xmin || y > ymax || y < ymin) {
        return false;
      } else {
        return true;
      }
    }

    var ctr = 0;
    var clusters = [];
    var currentCluster = null;
    var pLength = points.length;

    for (var i = pLength - 1; i >= 0; i--) {
      points[i]['c'] = null
    }

    // loop thru the point array
    for (var index = pLength - 1; index >= 0; index--) {

      if (! points[index].c &&
            //skip already clustered pins
            withinBounds( points[index].x, points[index].y,
                          mapBounds.xmin, mapBounds.xmax,
                          mapBounds.ymin, mapBounds.ymax)) {

        currentCluster = {'id': ctr, 'points': [], 'xSum': 0, 'ySum': 0, 'cX': null, 'cY': null};
        ctr++;
        currentCluster.points.push(points[index]);

        //look backwards in the list for any points within the range, return after we hit a point that exceeds range
        addPinsWithinRange(points, index, -1, currentCluster, resolution, clusterTolerance);

        //look forwards in the list for any points within the range, return after we hit a point that exceeds range
        addPinsWithinRange(points, index, 1, currentCluster, resolution, clusterTolerance);

        // Add the cluster to the storage array
        clusters.push(currentCluster);
      }
    }

    // Loop thru the created clusters and find the center of all cluster points
    for (var j = 0, iMax = clusters.length; j < iMax; j++) {

      var c = clusters[j];

      // Average the x, y coordinates
      for (var k = 0, kMax = c.points.length; k < kMax; k++) {

        c.xSum = c.xSum + c.points[k].x;
        c.ySum = c.ySum + c.points[k].y;

      }
      c.cX = c.xSum / c.points.length;
      c.cY = c.ySum / c.points.length;

      // delete the coordinate sum properties
      delete c.xSum;
      delete c.ySum;
    }

    return clusters;
  };
	
		// Public Methods
	module.moreThanOneCluster = function(points, resolution, clusterTolerance) {
		
		
		var ctr = 0,
			c,
			clusters = [],
			currentCluster;

        var pLength = points.length;

		for(var i = pLength - 1; i >= 0; i--){
			points[i]['c'] = null
		}
	
		// loop thru the point array
		for(var index = pLength - 1; index >= 0; index--){
			
			if (!points[index].c) //skip already clustered pins
	        {
	        	
	        	currentCluster = {'id': ctr, 'points':[], 'xSum': 0, 'ySum':0, 'cX':null, 'cY':null};
	        	ctr++;
	        	currentCluster.points.push(points[index]);
	        	
	        	//look backwards in the list for any points within the range, return after we hit a point that exceeds range
	        	addPinsWithinRange(points, index, -1, currentCluster, resolution, clusterTolerance);
	 
	            //look forwards in the list for any points within the range, return after we hit a point that exceeds range 
	            addPinsWithinRange(points, index, 1, currentCluster, resolution, clusterTolerance);
	 			
	 			// Add the cluster to the storage array
	 			clusters.push(currentCluster);
	        }
	    }
		
		if(clusters.length > 1) {
			return true;
		}
		
		return false;
	};
	return module;
	
}(QCluster || {}));



var QCluster = (function(module){
	
	//Private Vars
	var map;
	
	// Private Functions
	function getBufferedMercatorMapBounds(bounds, resolution, edgeBuffer) {
		var xmin,
			xmax,
			ymin,
			ymax,
			mapEdgeBuffer;
		
		mapEdgeBuffer = edgeBuffer || 0;
		
		xmin = L.CRS.EPSG3857.project(bounds._southWest).x - edgeBuffer * resolution;
		xmax = L.CRS.EPSG3857.project(bounds._northEast).x + edgeBuffer * resolution;
		ymin = L.CRS.EPSG3857.project(bounds._southWest).y - edgeBuffer * resolution;
		ymax = L.CRS.EPSG3857.project(bounds._northEast).y + edgeBuffer * resolution;
		
		return {'xmin': xmin, 'xmax': xmax, 'ymin': ymin, 'ymax': ymax };
		
	}	
	
	function getResolution(leafletMap, bounds) {

		var xmin,
			xmax,
			bounds,
			mapWidth;
					
		mapWidth = leafletMap.getSize().x;
	
		xmin = L.CRS.EPSG3857.project(bounds._southWest).x;
		xmax = L.CRS.EPSG3857.project(bounds._northEast).x;
			
		return (xmax - xmin)/mapWidth; // meters/pixel
	}
	
	function sortGeoRef(a, b) {
		if (a.georef < b.georef)
			return -1;
		if (a.georef > b.georef)
			return 1;
		return 0;	
	} 
	
    function geodeticToGeoRef(longitude,latitude,  precision){
	      
            function convertMinutesToString(minutes, precision)
            { 
            /*    
             *  This function converts minutes to a string of length precision.
             *
             *    minutes       : Minutes to be converted                  (input)
             *    precision     : Length of resulting string               (input)
             *    str           : String to hold converted minutes         (output)
             */
            
              var divisor, min, minLength, padding, minStr = '';
              
              divisor = Math.pow(10.0, (5.0 - precision));
              
              if (minutes == 60.0)
                minutes = 59.999;
              
              minutes = minutes * 1000;
              
              min = Math.floor(minutes/divisor);
              minLength = min.toString().length;
              
              if(minLength < precision) {
                padding = precision - minLength;
              }
              
              for(var i = 0; i < padding; i++) {
                minStr = minStr + '0';
              }
              
              minStr = minStr + min;
              
              return minStr;
            }
            
	      var long_min,                           /* number: GEOREF longitude minute part   */
		      lat_min,                            /* number: GEOREF latitude minute part    */
		      origin_long,                        /* number: Origin longitude (-180 degrees)*/
		      origin_lat,                         /* number: Origin latitude (-90 degrees)  */
		      letter_number = [],                 /* long integer array: GEOREF alpha-indices                */
		      long_min_str = [],                  /* char array: Longitude minute string        */
		      lat_min_str = [],                   /* char array: Latitude minute string         */
		      i,                                  /* integer: counter in for loop            */
		      GEOREFString = '',					//  The resultant GEOREF code
		      division1Lng,							// intermediate var
		      division2Lng, 						// intermediate vars
		      division1Lat, 						// intermediate vars
		      division2Lat, 						// intermediate vars
		      abc, 									// alphabet string from which we pick georef letters
		      LATITUDE_LOW, 						// Constants
		      LATITUDE_HIGH, 
		      LONGITUDE_LOW, 
		      LONGITUDE_HIGH, 
		      MIN_PER_DEG, 
		      GEOREF_MINIMUM,
		      GEOREF_MAXIMUM, 
		      GEOREF_LETTERS, 
		      MAX_PRECISION,
		      LETTER_I, 
		      LETTER_M, 
		      LETTER_O, 
		      LETTER_Q, 
		      LETTER_Z, 
		      LETTER_A_OFFSET, 
		      ZERO_OFFSET, 
		      QUAD, 
		      ROUND_ERROR,
		      ABC;
		
		  var ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ';
		
		  LATITUDE_LOW = -90.0;           /* Minimum latitude                      */
		  LATITUDE_HIGH = 90.0;           /* Maximum latitude                      */
		  LONGITUDE_LOW = -180.0;         /* Minimum longitude                     */
		  LONGITUDE_HIGH = 360.0;         /* Maximum longitude                     */
		  MIN_PER_DEG = 60.0;             /* Number of minutes per degree          */
		  GEOREF_MINIMUM = 4;                /* Minimum number of chars for GEOREF    */
		  GEOREF_MAXIMUM = 14;               /* Maximum number of chars for GEOREF    */
		  GEOREF_LETTERS = 4;                //# Number of letters in GEOREF string    */
		  MAX_PRECISION = 5;                 //# Maximum precision of minutes part     */
		  LETTER_I = 8;                      //# Index for letter I                    */
		  LETTER_M = 12;                     //# Index for letter M                    */
		  LETTER_O = 14;                     //# Index for letter O                    */
		  LETTER_Q = 16;                     //# Index for letter Q                    */
		  LETTER_Z = 25;                     //# Index for letter Z                    */
		  LETTER_A_OFFSET = 78;              //# Letter A offset in character set      */
		  ZERO_OFFSET = 48;                  //# Number zero offset in character set   */
		  PI = 3.14159265358979323e0;     //# PI                                    */
		  QUAD = 15.0;                    //# Degrees per grid square               */
		  ROUND_ERROR = 0.0000005;        //# Rounding factor                       */
		
		  if ((latitude < LATITUDE_LOW) || (latitude > LATITUDE_HIGH)) {
		    return null;  
		  }
		
		  if (longitude < LONGITUDE_LOW)  {
		    return null;  
		  }
		
		  if ((precision < 0) || (precision > MAX_PRECISION)) {
		    return null;
		  }
		
		  if (longitude > 180){
		        longitude -= 360;
		  }
		
		  origin_long = LONGITUDE_LOW;
		  origin_lat = LATITUDE_LOW;
		
		  // First division longitude
		  division1Lng = (longitude-origin_long) / QUAD + ROUND_ERROR;
		
		  if(division1Lng >= 0) {
		    letter_number[0] = Math.floor(division1Lng);
		  } else {
		    letter_number[0] = Math.ceil(division1Lng);
		  }
		
		  division2Lng = longitude - (letter_number[0] * QUAD + origin_long);
		
		  if(division2Lng >= 0) {
		    letter_number[2] = Math.floor(division2Lng);
		  } else {
		    letter_number[2] = Math.ceil(division2Lng)  + ROUND_ERROR;
		  }
		
		  long_min = (division2Lng - letter_number[2]) * MIN_PER_DEG;
		    
		
		  division1Lat = (latitude - origin_lat) / QUAD + ROUND_ERROR;
		
		  if(division1Lat >= 0) {
		    letter_number[1] = Math.floor(division1Lat);
		  } else {
		    letter_number[1] = Math.ceil(division1Lat);
		  }
		
		  division2Lat = latitude - (letter_number[1] * QUAD + origin_lat);
		
		  if(division2Lat >= 0) {
		    letter_number[3] = Math.floor(division2Lat + ROUND_ERROR);
		  } else {
		    letter_number[3] = Math.ceil(division2Lat + ROUND_ERROR);
		  }
		
		  lat_min = (division2Lat- letter_number[3]) * MIN_PER_DEG;
		  
		  for (i = 0;i < 4; i++)
		  {
		    if (letter_number[i] >= LETTER_I)
		      letter_number[i] += 1;
		    if (letter_number[i] >= LETTER_O)
		      letter_number[i] += 1;
		  }
		
		  if (letter_number[0] == 26)
		  { /* longitude of 180 degrees */
		    letter_number[0] = LETTER_Z;
		    letter_number[2] = LETTER_Q;
		    long_min = 59.999;
		  }
		  
		  if (letter_number[1] == 13)
		  { /* latitude of 90 degrees */
		    letter_number[1] = LETTER_M;
		    letter_number[3] = LETTER_Q;
		    lat_min = 59.999;
		  }
		
		  for (i=0;i<4;i++){
		      GEOREFString = GEOREFString + ABC[(letter_number[i])];// + LETTER_A_OFFSET];
		    }  
		  
		  GEOREFString = GEOREFString + convertMinutesToString(long_min,precision);
		  GEOREFString = GEOREFString + convertMinutesToString(lat_min,precision);
		  
		  return GEOREFString;

		};
	
	function webMercToGeodetic(mercatorY,mercatorX) {
	
			var x,
				y,
				lng,
				lat;
			
		    if (Math.abs(mercatorX) > 20037508.3427892){
		    	console.error('Mercator X: ' + mercatorX + ' is > 20037508.3427892.');
		        return [null, null];
			}
			
			if (Math.abs(mercatorY) > 20037508.3427892) {
		    	console.error('Mercator Y: ' + mercatorY + ' is > 20037508.3427892.');
		        return [null, null];
			}
			
		    lng = ((mercatorX / 6378137.0) * 57.295779513082323) - (Math.floor( ( (((mercatorX / 6378137.0) * 57.295779513082323) + 180.0) / 360.0)) * 360.0);
		    lat = (1.5707963267948966 - (2.0 * Math.atan(Math.exp((-1.0 * mercatorY) / 6378137.0)))) * 57.295779513082323;
			
		    return [lng, lat];
		};		

	function processGeoJson(geoJson) {
        var features = [];

        // You can just give it regular GeoJSON...
        if (geoJson.features) {
            features = geoJson.features;
        }

        // You can feed in an array of several GeoJSON objects...
        else if (geoJson instanceof Array) {
            for (var i = geoJson.length - 1; i >= 0; --i) {
                features = features.concat(geoJson[i].features);
            }
        }

        // You can also feed it an object that has GeoJSON in it...
        else if (geoJson[Object.keys(geoJson)[0]].features) {
            for (var key in geoJson) {
                if (geoJson[key].features)
                    features = features.concat(geoJson[key].features);
            }
        }

        // Oops... Bad data.
        else {
            console.err('Faulty Data. No GeoJSON found.');
            return [];
        }

        var pointData = [];
		for (var j = features.length - 1; j >= 0; --j) {
			var feature = features[j];
			var pointObj = features[j].properties;
			var lng = feature.geometry.coordinates[0];
			var lat = feature.geometry.coordinates[1];

			// Convert to Web Mercator
			var webMerc = L.CRS.EPSG3857.project(L.latLng(lat, lng));

			// Calculate georef and add it and web merc coords to object
			pointData.push($.extend(true, {
				georef: geodeticToGeoRef(lng,lat,4),
				lng: lng,
				lat: lat,
				x: webMerc.x,
				y: webMerc.y
			}, pointObj));
		}

		return pointData.sort(sortGeoRef);
	}

	function processPointArray(pointArr) {
		var pointData, i, len, pointObj, webMerc;

		pointData = [];
		len = pointArr.length;

		for (i = len - 1; i >= 0; --i) {
			pointObj = pointArr[i];
			lng = pointObj.lng;
			lat = pointObj.lat;

            // Convert to Web Mercator
			webMerc = L.CRS.EPSG3857.project(L.latLng(lat, lng));
			
            // Calculate georef and add it and web merc coords to object
			pointData.push($.extend(true, {
				georef: geodeticToGeoRef(lng,lat,4),
				x: webMerc.x,
				y: webMerc.y
			}, pointObj));
		}

		return pointData.sort(sortGeoRef);
	}

	module.PointClusterer = function(pointArr, layerId, map, clusterCssClass, opts){
		var options, pointArrLength, lng, lat, i, webMerc;
		
		options = opts || {};
		
        this.layerId = layerId;
        this.clickHandler = options.clickHandler || this.defaultClickHandler;
        this.mouseoverHandler = options.mouseoverHandler || this.defaultMouseoverHandler;
        this.mouseoutHandler = options.mouseoutHandler || this.defaultMouseoutHandler;
        this.backgroundColor = options.backgroundColor || '#666666';
        this.dataFormat = options.dataFormat ? options.dataFormat.toLowerCase() : 'pointarray'; 
        this.clusterCssClass = clusterCssClass;
		this.map = map;
        this.pointIdProperty = options.pointIdProperty || null;
		this.tolerance = options.clusterTolerance || 130;
		this.mapEdgeBuffer = options.mapEdgeBuffer || module.Utils.HypotenuseOfMapAsInt(map);
		this.layerVisibility = (typeof options.layerVisibility === 'boolean') ? options.layerVisibility : true;
		this.reportingProperty = options.reportingProperty || null;
        this.reportingDictionary = options.reportingDictionary || {};
        this.defaultPalette = options.defaultPalette || ['#8b722c', '#e7dfc7', '#040707', '#c96228', '#80adc0', 
                                                         '#a19788', '#ddecf2', '#9e0000', '#03671f', '#8e2b5c', 
                                                         '#e13066', '#5c8276', '#efa0cb', '#62517b', '#2c688b', 
                                                         '#56c2a7', '#e1df2f', '#ed3333', '#e69890', '#545454'];
        this.mapOrder = options.mapOrder || null
        this.reportingValueNA = options.reportingValueNA || {color: '#666666', label: 'NA'};
        this.donutIRFrac =  options.donutIRFrac || 0.4;
		
        this.activeCluster = null;
        
        pointArrLength = pointArr.length;
		
		if (this.dataFormat === 'geojson') {
			this.pointData = processGeoJson(pointArr);
		} else { // point array
			this.pointData = processPointArray(pointArr);
		}

		// Do the clustering
		this.makeClusters();
		
		//  When the map pans or zooms, fire this.mapMove
		this.map.on('moveend', this.mapMove, this);

		// Remove the indicator points when the map zooms. 
		// The mouseout event won't be fired (because the mouse is still there)...
		this.map.on('zoomstart', this.removeIndicatorPoints, this);
		
		return this;
		
	};
	
	module.PointClusterer.prototype.makeClusters = function(map, layer, clusterTolerance, mapBounds) {
	

		var clusterArr, clusterDictionary, cnt,divHtml,divClass,myIcon,
			latlon,points,clusterMarker,classificationIds, mapBounds,
			resolution, webMercMapBounds, clusterLength, i
			clusterMarkers = [], lats = [], lngs = [];
	
		// If map is not visible, don't proceed
		if(!$(this.map._container).is(":visible")) {
			return;
		}
		
		// If the PointCluster's layer property is defined, remove it from map; we recluster and add the layer back
		if(typeof this.layer !== 'undefined') {
            
            // TODO: prob need to unbind cluster click events...?
			this.map.removeLayer(this.layer);
		}		
		
        // Calculate the extent bounds
		mapBounds = this.map.getBounds();
		
        // Calculate the map's resolutions (px/meter)
		resolution = getResolution(this.map, mapBounds);
		
        // Convert map bounds to web merc and add buffer (px) if one has been passed
		webMercMapBounds = getBufferedMercatorMapBounds(mapBounds, resolution, this.mapEdgeBuffer);
		
        // Cluster the points
		clusterArr = module.clusterPoints(this.pointData, webMercMapBounds, resolution, this.tolerance);
		
        
		clusterDictionary = {};

		clusterLength = clusterArr.length;
		      
		// Now create the cluster markers for the clusters qCluster returned
		for(i = clusterLength - 1; i >= 0; i--){
			  
			// Test to see if this cluster is in the defined rendering extent
			//if(module.Utils.withinBounds(clusterArr[i].cX, clusterArr[i].cY, webMercMapBounds, resolution)) {
				
				// Add this cluster to an object, with a key that matches a css class name that will be added to the leaflet map marker
				clusterDictionary['cId_' + clusterArr[i].id] = clusterArr[i];
				
				points = clusterArr[i].points;
				
				// Number of points in each cluster
				cnt = points.length;
				
				// Create custom HTML inside of each leaflet marker div
				if ( this.backgroundColor ) {
					divHtml = '<div style="background-color: ' + this.backgroundColor + ';"><span>' + cnt +'</span></div>';
				} else {
					divHtml = '<div><span>' + cnt +'</span></div>';
				}
				
				// create the class name(s) for the leaflet marker div; the layer id added as the first additional class
				divClass = 'leaflet-marker-icon q-marker-cluster ' + this.clusterCssClass;
				
				// differeniate class names based on cluster point count; clusters greater than one get a 'cluster id' class that matches a key in clustersDictionary object
				if (cnt === 1) {
					
					divHtml = '<div><div class="q-marker-single-default"><span>' + cnt +'</span></div></div></div>';
					
					divClass = divClass + ' q-marker-cluster-single';
					
					// Color single points by classification color?
					if(this.reportingProperty !== null && points[0][this.reportingProperty]) {
                        
						// Use color of first reporting id
						classificationIds = points[0][this.reportingProperty].toString().split(',');
							
						if (typeof this.reportingDictionary[classificationIds[0]] !== 'undefined') {
	
							divHtml = '<div style="background-color: ' + this.reportingDictionary[classificationIds[0]].color 
                                    + '"><div class="q-marker-single-default"><span>' + cnt +'</span></div></div></div>';
						}
					}
							
				}
				else if (cnt < 100){
					
					divClass =  divClass + ' q-marker-cluster-small cId_' + clusterArr[i].id;
					
				} else if (cnt < 1000){
					
					divClass = divClass + ' q-marker-cluster-medium cId_' + clusterArr[i].id;
				} 
				
				else {
					
					divClass = divClass + ' q-marker-cluster-large cId_' + clusterArr[i].id;
				}
				
				// set up the custom leaflet marker icon
				myIcon = L.divIcon({'className':divClass , 'html': divHtml });
				
				// Convert web mercator coordinates to lat/lng as required by leaflet
				var lngLat =  webMercToGeodetic(clusterArr[i].cY, clusterArr[i].cX);
				
				// instaniate the leaflet marker
				clusterMarker = L.marker([lngLat[1], lngLat[0]], {icon:myIcon});
				
                clusterMarker["points"] = points;
                clusterMarker["pointIds"] = [];
                
                if(this.pointIdProperty) {
                    
                    for(var j = points.length - 1; j >= 0; j--){
                    
                            clusterMarker["pointIds"].push(points[j][this.pointIdProperty]);
                    
                    }
                }
            
                // Determine if all points within a cluster have the approximately same coordinates
                clusterMarker['stacked'] = true;
                
                lats[0] = Math.round(points[0].lat*10000)/10000;
                lngs[0] = Math.round(points[0].lng*10000)/10000;

                for (var n = points.length - 1; n >= 0; n--) {
                    
                    lats[n] = 	Math.round(points[n].lat * 10000)/10000;
                    lngs[n] = Math.round(points[n].lng * 10000)/10000;
                    if( lats[n] !== lats[0] 
                        || lngs[n] !== lngs[0]){
                    
                        clusterMarker['stacked'] = false;
                        break;
                    }
                }
                
				// Deal with cluster click event
				if(this.clickHandler) {
					
                    
					if(this.clickHandler){
						clusterMarker.on('click', this.clickHandler, this);
					}
					
					if (this.mouseoverHandler) {
						clusterMarker.on('mouseover', this.mouseoverHandler, this);
					}
                    
                    if (this.mouseoutHandler) {
                    	clusterMarker.on('mouseout', this.mouseoutHandler, this);
                    }

					if(this.idProperty){
						clusterMarker['pointIds'] = [];
					
						for (var j = 0, jMax = cnt; j < jMax; j ++) {
							clusterMarker['pointIds'].push(points[j][this.idProperty]);
						}
                    
					}
 
				}
				
				// Store it in an array
				clusterMarkers.push(clusterMarker);
                
			}
 
		//}
		
        this.clusters = clusterDictionary;
        
		// instaniate a leaflet feature group that contains our clusters
		this.layer = L.featureGroup(clusterMarkers);
		
		this.map.addLayer(this.layer);
		
		// Add layer to map if displayState is true; 
		if(this.layerVisibility){
			
			this.map.addLayer(this.layer);
			
			// Set the z-index of the layer if specified
			
			if(typeof this.mapOrder === 'number'){
				$('.' + this.layerId).css('z-index', this.mapOrder);
			}
			
			// check if reporting property is actually in the points object
            if(this.reportingProperty) {
                this.makeDonuts();
            }
			
		}

		if(this.activeCluster) {
			this.markActiveCluster();
		}
        

	};

	module.PointClusterer.prototype.mapMove = function(){
		if(!$(this.map._container).is(":visible")) {
			return;
		}
		this.map.removeLayer(this.layer);
		
	    this.makeClusters();
	};	
    
    module.PointClusterer.prototype.markActiveCluster = function() {
		
		if(this.activeCluster === null) {
			return;
		}
		// When the user click on a cluster that can be made active (i.e., less than 20 points), the map centers on that cluster
		// Of course, when that happens, the old clusters/layer gets destoyed and remade.  Thus we lose reference to the cluster
		// that we clicked to make active.  However, the lat/lng of the orginally clicked cluster, will be identical to the new
		// cluster that should be made active
		
		// Loop thru all the 'markers' (aka _layers) in the map layer 
		for(var i in this.layer._layers) {
			
			var latlng = this.layer._layers[i]._latlng;
			
			// If this marker's latlng & point count === the clicked cluster's properties, add active-marker class to the divIcon
			if(latlng.lat === this.activeCluster._latlng.lat && latlng.lng === this.activeCluster._latlng.lng ) {
				$(this.layer._layers[i]._icon).toggleClass('active-marker', true);
			}
		}

    };

    
    module.PointClusterer.prototype.removeActiveCluster = function() {
	
		this.activeCluster = null;
		
		$('.leaflet-marker-pane .active-marker').toggleClass('active-marker', false);
        
    };

    module.PointClusterer.prototype.removeLayer = function(){
	
        this.map.off('moveend', this.mapMove, this);
        this.map.off('click', this.removeActiveCluster, this);
        this.map.removeLayer(this.layer);
    
    };

    module.PointClusterer.prototype.replaceLayer = function(){
        
        this.map.on('moveend', this.mapMove, this);
        this.map.on('click', function(){
            // Remove the active marker and publish notification
            this.removeActiveCluster(true);
        }, this);
        
        this.makeClusters();
    
    };
    
    module.PointClusterer.prototype.defaultClickHandler = function(e) {
	
		var clusterLayer,
			cluster,
			priorActiveCluster, currentZoom, points, mapBounds, resolution, maxZoom;
			
		clusterLayer = this;
        clusterLayer.removeActiveCluster();

		cluster = e.target;

		//Get the points for this cluster
		points = cluster.points;
		
		maxZoom = this.map.getMaxZoom();
		currentZoom = this.map.getZoom();       
		
        // Calculate the map's resolutions (px/meter)
		resolution = getResolution(this.map, this.map.getBounds());

		// Loop thru higher zoom levels
		for(var i = currentZoom + 1; i < maxZoom; i++) {

			if(module.moreThanOneCluster(points, resolution/this.map.getZoomScale(i), this.tolerance)) {
				break;
			}

		}

		this.map.setView(cluster._latlng, i);	
        
    };

    module.PointClusterer.prototype.defaultMouseoverHandler = function(e) {
    	if (this.mouseoverGroup) return;
    	
    	this.mouseoverCluster = e.target;
    	var points = this.mouseoverCluster.points;
    	var len = points.length;
    	this.mouseoverGroup = L.layerGroup();
    	for(var i=len-1; i>=0; --i) {
    		var p = points[i];

    		if(this.reportingProperty && p[this.reportingProperty]) {
    			var prop = p[this.reportingProperty];
    			var color = this.reportingDictionary[prop].color;
    		} else {
    			var color = this.backgroundColor;
    		}

    		var latLng = L.latLng([p.lat, p.lng]);
    		var circle = new L.CircleMarker(latLng, {
    			radius: 3,
    			color: color,
    			fillOpacity: .3,
    			opacity: 0
    		});
    		this.mouseoverGroup.addLayer(circle);
    	}
    	this.mouseoverGroup.addTo(this.map);
    };

    module.PointClusterer.prototype.removeIndicatorPoints = function() {
		this.mouseoverCluster = null;
		if (this.map && this.map.removeLayer && this.mouseoverGroup)
			this.map.removeLayer(this.mouseoverGroup);
		delete this.mouseoverGroup;
	};

    module.PointClusterer.prototype.defaultMouseoutHandler = function(e) {
    	this.removeIndicatorPoints();
    };

	return module;
	
}(QCluster || {}));


var QCluster = (function(module){

    module.PointClusterer.prototype.makeDonuts = function(){
	
        var points, dataDictionary, tmpDataset,
            dataset, width, height, radius,
            wrapper, color, pie, arc,
            svg, path, reportingArr, rId, clusters, numReportingCtr = 0;
         
        
        // Loop thru the this.clusters object  
        clusters = this.clusters;
        
        for (var i in clusters){
        
            dataDictionary = {};
            
            points = this.clusters[i].points;
            
            // Loop through the clusters points and summarize the points by counts per unique reporting attribute

            for (var j = points.length - 1; j >= 0; j--) {
                  
                // Split the comma delimited string of reporting ids; do this if the property value is a comma seperated list of values
                reportingArr = points[j][this.reportingProperty].toString().split(',');
                
                // Loop
                var kMax = reportingArr.length - 1;
                for ( var k = kMax; k >= 0; k--) {
                    
                    // this iteration's reporting id	
                    rId = reportingArr[k];	
                    
                    // If we have already come across this id before (and started a count of its frequency), increment the count
                    if(dataDictionary.hasOwnProperty(rId)) {
                        dataDictionary[rId]['count']++; 
                    }
                    else if (rId === ''){
                        // Null report id's come through as an empty string because this starts as a comma delimited string
                        //  We're assigning null ids to a pseudo-id of -9999
                        
                        // Increment the count of -9999 
                        if(dataDictionary.hasOwnProperty('-9999')) {
                            dataDictionary['-9999']['count']++; 
                        }
                        else {
                            // if this is the first null id, create an object property and start the counter
                            dataDictionary['-9999'] = {
                            'count': 1,
                            'color': this.reportingValueNA.color,
                            'alias': this.reportingValueNA.label
                            };
                        }
                    }
                    else {
                        if(typeof this.reportingDictionary[rId] === 'undefined') {
                            
                            if(numReportingCtr === this.defaultPalette.length) {
                                
                                numReportingCtr = 0;
                                
                            }
                            
                            this.reportingDictionary[rId] = {color : this.defaultPalette[numReportingCtr], label: rId}
                            
                            numReportingCtr = numReportingCtr + 1;
                        }
                        
                        // if this is the first time we see this id, create an object property and start the counter
                        dataDictionary[rId] = {
                            'count': 1,
                            'color': this.reportingDictionary[rId].color,
                            'label': this.reportingDictionary[rId].label
                            };
                    }
    
                }
        
            }

            // prep dataset for D3; need a temp dataset to deal with merging of data counts for 'other' category
            tmpDataset = [];
            dataset = [];
            
            // Push properties from object holding the category counts/colors categories into an object array
            for (var j in dataDictionary) {
                tmpDataset.push(dataDictionary[j]);	
            }
            
            // Create an object that will merge the count from all classification catergories that we've deemed as 'other''
            var mergedOther = {
                            'count': 0,
                            'color': this.reportingValueNA.color,
                            'label': this.reportingValueNA.label
                        };
            
            

            // Merge all 'other' objects; we determine which are 'other' by testing to see if its been assigned the 'other' color		
            for (var k = 0, kMax = tmpDataset.length; k < kMax; k++) {
                
                if(tmpDataset[k].label === this.reportingValueNA.label) {
                    mergedOther.count = mergedOther.count + tmpDataset[k].count;
                } else {
                    dataset.push(tmpDataset[k]);
                }
            }
            
            // Add the merge objedt to the dataset we will use in donut chart
            dataset.push(mergedOther);
    
            // Use jQuery to get this cluster markers height and width (set in the CSS)
            wrapper = $('.'+ this.clusterCssClass + '.' + i);
            width = $(wrapper).width();
            height = $(wrapper).height();
            radius =  Math.min(width, height) / 2;
            
            
            // D3 donut chart boilerplate
            
            pie = d3.layout.pie()
                    .sort(null);
            
            arc = d3.svg.arc()
                .innerRadius(radius-radius * this.donutIRFrac)
                .outerRadius(radius);
            
            // Note that we add 'clusterDonut' as a selector
            svg = d3.select('.' + this.clusterCssClass + '.' + i).append("svg")
                .attr("class", "clusterDonut")
                .attr("width", width)
                .attr("height", height)
                //.style('display', 'none')
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
            
                path = svg.selectAll("path")
                        .data(function(){
                                    var dataObjArr,
                                        dataArr,
                                        pieData;
                                        
                                    dataObjArr = dataset;
                                    
                                    dataArr = [];
                                    
                                    for (var i = 0, iMax = dataObjArr.length; i < iMax; i++) {
                                        dataArr.push(dataObjArr[i]['count']);	
                                    }
                                    
                                    pieData = pie(dataArr);
                                    
                                    for (var i = 0, iMax = pieData.length; i < iMax; i++) {
                                        pieData[i].data = dataObjArr[i];	
                                    }
                                    
                                    return pieData;
                                })
                            .enter().append("path")
                            .attr("fill", function(d, j) { 
                                            return d.data.color; 
                                            })
                            .attr("d", arc);
    
    
        }
    
    };
    
    return module;

}(QCluster || {}))