var width = document.getElementById('svg').clientWidth;
var height = document.getElementById('svg').clientHeight;

var marginLeft = 0;
var marginTop = 0;

var svg = d3.select('svg')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

//set up the projection for the map
var albersProjection = d3.geoAlbersUsa()  //tell it which projection to use
    .scale(700)                           //tell it how big the map should be
    .translate([(width/2), (height/2)]);  //set the center of the map to show up in the center of the screen

//set up the path generator function to draw the map outlines
path = d3.geoPath()
    .projection(albersProjection);        //tell it to use the projection that we just made to convert lat/long to pixels


//import the data from the .csv file
d3.json('./cb_2016_us_state_20m.json', function(dataIn){

    svg.selectAll("path")               //make empty selection
        .data(dataIn.features)          //bind to the features array in the map data
        .enter()
        .append("path")                 //add the paths to the DOM
        .attr("d", path)                //actually draw them
        .attr("class", "feature")
        .attr('fill','gainsboro')
        .attr('stroke','white')
        .attr('stroke-width',1)
    /* .on('mouseover',function(d){console.log(d.properties.NAME)})*/
    ;


    svg.selectAll('circle1')
        .data([{long:-122.143, lat:37.4419},{long:-74.4518, lat:40.4862},{long:-74, lat:40.7128},
            {long:-118.2864, lat:34.1605}, {long:-122.0322, lat:37.323},{long:-122.1215, lat:47.674},
            {long:-121.9552, lat:37.3541},{long:-74, lat:40.7128},{long:-84.388, lat:33.749},
            {long:-89.3985, lat:40.6331}])

        //note that long is negative because it is a W long point!
        .enter()
        .append('circle')
        .attr('cx', function (d){
            return albersProjection([d.long, d.lat])[0]
        })
        .attr('cy', function (d){
            return albersProjection([d.long, d.lat])[1]
        })
        .attr('r', 3)
        .attr('fill','blue');

});

//////////////////////////////////////////////////////////////////////////////////////////////////////
var width_1 = document.getElementById('svg1').clientWidth;
var height_1 = document.getElementById('svg1').clientHeight;

//bar charts //

var svg1= d3.select('#svg1')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var svg2 = d3.select('#svg2')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');


var scaleX = d3.scaleBand().rangeRound([0, width_1-2*marginLeft]).padding(0.1);
var scaleY = d3.scaleLinear().range([height_1-2*marginTop, 0]);
var scaleY2 = d3.scaleLinear().range([height_1-2*marginTop, 0]);

d3.csv('./xundata2.csv', function(dataIn){

    nestedData = d3.nest()
        .key(function(d){return d.year})
        .entries(dataIn);

    var loadData = nestedData.filter(function(d){return d.key ==='1'})[0].values;


    svg1.append("g")
        .attr('class','xaxis')
        .attr('transform','translate(0,' + (height-2*marginTop) + ')')  //move the x axis from the top of the y axis to the bottom
        .call(d3.axisBottom(scaleX));

    svg1.append("g")
        .attr('class', 'yaxis')
        .call(d3.axisLeft(scaleY));

    svg2.append("g")
        .attr('class','xaxis')
        .attr('transform','translate(0,' + (height-2*marginTop) + ')')  //move the x axis from the top of the y axis to the bottom
        .call(d3.axisBottom(scaleX));

    svg2.append("g")
        .attr('class', 'yaxis2')
        .call(d3.axisLeft(scaleY2));


    drawPoints(loadData);
});

    function drawPoints(pointData){

        scaleX.domain(pointData.map(function(d){return d.Stock;}));
        scaleY.domain([0, d3.max(pointData.map(function(d){return +d.Close}))]);
        scaleY2.domain([0, d3.max(pointData.map(function(d){return +d.Volume}))]);

        d3.selectAll('.xaxis')
            .call(d3.axisBottom(scaleX));

        d3.selectAll('.yaxis')
            .call(d3.axisLeft(scaleY));

        d3.selectAll('.yaxis2')
            .call(d3.axisLeft(scaleY2));


        var rects = svg1.selectAll('.bars')
            .data(pointData, function(d){return d.Stock;});


        rects.exit()
            .remove();


        rects
            .transition()
            .duration(10)
            .attr('x',function(d){
                return scaleX(d.Stock);
            })
            .attr('y',function(d){
                return scaleY(d.Close);
            })
            .attr('width',function(d){
                return scaleX.bandwidth();
            })
            .attr('height',function(d){
                return height-2*marginTop - scaleY(d.Close);
            });


        rects
            .enter()
            .append('rect')
            .attr('class','bars')
            .attr('id', function(d){return d.Stock;})
            .attr('fill', "lightblue")
            .attr('x',function(d){
                return scaleX(d.Stock);
            })
            .attr('y',function(d){
                return scaleY(d.Close);
            })
            .attr('width',function(d){
                return scaleX.bandwidth();
            })
            .attr('height',function(d){
                return height-2*marginTop - scaleY(d.Close);
            })
            .on('mouseover', function(d){
                d3.select(this).attr('fill','lightblue');

                currentID = d3.select(this).attr('id');
                svg2.selectAll('#' + currentID).attr('fill','lightblue')
            })
            .on('mouseout', function(d){
                d3.select(this).attr('fill','#00264d');

                currentID = d3.select(this).attr('id');
                svg2.selectAll('#' + currentID).attr('fill','#00264d')
            });

        var rects2 = svg2.selectAll('.bars')
            .data(pointData, function(d){return d.Stock;});


        rects2.exit()
            .remove();

        rects2
            .transition()
            .duration(10)
            .attr('x',function(d){
                return scaleX(d.Stock);
            })
            .attr('y',function(d){
                return scaleY2(d.Volume);
            })
            .attr('width',function(d){
                return scaleX.bandwidth();
            })
            .attr('height',function(d){
                return height-2*marginTop - scaleY2(d.Volume);
            });


        rects2
            .enter()
            .append('rect')
            .attr('class','bars')
            .attr('id', function(d){return d.Stock;})
            .attr('fill', "lightblue")
            .attr('x',function(d){
                return scaleX(d.Stock);
            })
            .attr('y',function(d){
                return scaleY2(d.Volume);
            })
            .attr('width',function(d){
                return scaleX.bandwidth();
            })
            .attr('height',function(d){
                return height-2*marginTop - scaleY2(d.Volume);
            })
            .on('mouseover', function(d){
                d3.select(this).attr('fill','lightblue');

                currentID = d3.select(this).attr('id');
                svg1.selectAll('#' + currentID).attr('fill','lightblue')
            })
            .on('mouseout', function(d){
                d3.select(this).attr('fill','#00264d');

                currentID = d3.select(this).attr('id');
                svg1.selectAll('#' + currentID).attr('fill','#00264d')
            });
    }

///////////////////////////////////////////////////////////////////////////////////////////
function updateData(selectedYear){
    return nestedData.filter(function(d){return d.key == selectedYear})[0].values;
}
///////////////////////////////////////////////////////////////////////////////////////////
function sliderMoved(value){
    newData = updateData(value);
    drawPoints(newData);
}
///////////////////////////////////////////////////////////////////////////////////////////


