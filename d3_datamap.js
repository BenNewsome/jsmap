 <!-- map creation --> 
  // canvas resolution
  var width = 1000,
      height = 600;
 
  // projection-settings for mercator    
//  var projection = d3.geo.mercator()
  var projection = d3.geo.equirectangular()
      // where to center the map in degrees
      .center([0, 50 ])
      // zoomlevel
      .scale(100)
      // map-rotation
      .rotate([0,0]);
 
  // defines "svg" as data type and "make canvas" command
  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("id", "map");
      ;

        var tooltip = d3.select('body').append('div')
            .attr('class', 'hidden tooltip');
 
  // defines "path" as return of geographic features
  var path = d3.geo.path()
      .projection(projection);
 
  // group the svg layers 
  // This is the order the layers appear. top is rendered first and subsequent are redered ontop.
  var dataMap = svg.append("g");
  var testMap = svg.append("g");
  var worldMap = svg.append("g");
 
    // Colorbar scale
    cbScale = d3.scale.linear()
            .range(["white","purple"])
            .domain([0,110])

   console.log( "color 25 = " + cbScale(25));

  var mySquare = {
      "type": "FeatureCollection",
      "features": 
          [
          {
              "type": "Feature",
              "geometry": {
                  "type": "Polygon",
                  "coordinates": [
                      [
                      [0,0],
                      [0,-40],
                      [-40,-40],
                      [-40,0],
                      [0,0],
                      ],
                ]
              },
              "properties": {
                  "name": "[1,1]",
                  "conc": 25,
              }
          }
      ]
  };

 var getColor = function(d) {
      var outColor;
      outColor = cbScale(d.properties.conc);
      return outColor};

 var test_getColor = function(d) { return "blue" };

 var mySquare2 = testMap.selectAll("path")
   .data(mySquare.features)
   .enter()
    .append("path")
    .attr("d", path)
    .style("fill-opacity", 0.5)
//    .style("fill", function(d) {return getColor(d)})
//    .attr("fill", function(d) {return test_getColor(d)})
    .style("fill", "blue")
//    .attr("fill", function(d) {return cbScale(d.properties.conc)});
    ;
    
   function addDataPoints(jsonFileName) {
      d3.json(jsonFileName, function(error, jsonData) {
         console.log("The json error is:");
         console.log(error);
         console.log("The json data is:");
         console.log(jsonData);
         console.log("The first point is: " + jsonData.features[0].geometry.coordinates)
         console.log("The first color is: " + jsonData.features[0].properties.conc)


         var dataPoints = dataMap.selectAll("path").data(jsonData.features)

         dataPoints.enter()
         .append("path")
         .attr("d", path)
               .style("fill", function(d) {return getColor(d)})
               .style("fill-opacity", 1.0)
                .on('mousemove', function(d) {
                    var mouse = d3.mouse(svg.node()).map(function(d) {
                        return parseInt(d);
                    });
                    tooltip.classed('hidden', false)
                        .attr('style', 'left:' + (mouse[0] + 15) +
                                'px; top:' + (mouse[1] - 35) + 'px')
                        .html(d.properties.name);
                })
                .on('mouseout', function() {
                    tooltip.classed('hidden', true);
                });

});
};

var spinTarget = document.getElementById('map');
var opts = {
  lines: 9, // The number of lines to draw
  length: 9, // The length of each line
  width: 5, // The line thickness
  radius: 14, // The radius of the inner circle
  color: '#EE3124', // #rgb or #rrggbb or array of colors
  speed: 1.9, // Rounds per second
  trail: 40, // Afterglow percentage
  className: 'spinner', // The CSS class to assign to the spinner
};
var spinner = new Spinner(opts).spin(spinTarget);


function removeDataPoints() {
   spinner.spin();
   dataMap.selectAll("path").remove();
   spinner.stop();
};

  var addMap = d3.json("world-110m.json", function(error, topology) {
      spinner.spin();
      worldMap.selectAll("path")
        .data(topojson.object(topology, topology.objects.countries)
            .geometries)
      .enter()
        .append("path")
        .attr("d", path);
      spinner.stop();
  });
 
  // zoom and pan functionality
  /*var zoom = d3.behavior.zoom()
      .on("zoom",function() {
          g.attr("transform","translate("+ 
              d3.event.translate.join(",")+")scale("+d3.event.scale+")");
          g.selectAll("path")  
              .attr("d", path.projection(projection)); 
    });
 
  svg.call(zoom)*/
 
    var colorbar = Colorbar()
            .origin([25,50])
            .scale(cbScale)
            .orient("vertical")
            .barlength(300)
            .thickness(30)

    placeholder = "#colorbar-here"

    colorbarObject = d3.select(placeholder)
    .call(colorbar)

    bar =  d3.selectAll("svg").append("g").attr("id","colorbar")

    pointer = d3.selectAll("#colorbar").call(colorbar)


//    circles
//        .on("mouseover",function(d) {pointer.pointTo(d[whichValue])})a

