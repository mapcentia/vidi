
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

