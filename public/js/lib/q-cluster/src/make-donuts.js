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