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
      .attr("height", height);
 
  // defines "path" as return of geographic features
  var path = d3.geo.path()
      .projection(projection);
 
  // group the svg layers 
  var testMap = svg.append("g");
  var dataMap = svg.append("g");
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
      console.log("d input: " + d);
      var outColor;
      if(typeof d !== "undefined") {
              outColor = cbScale(d.properties.conc)
              console.log("Color for d: " + outColor);
      } else {
              console.log("d is undefined");
              outColor = 1;
      }
      return outColor};

 var test_getColor = function(d) { return "blue" };

 var mySquare2 = testMap.selectAll("path")
   .data(mySquare.features)
   .enter()
    .append("path")
    .attr("d", path)
    .style("fill-opacity", 0.5)
    .style("fill", function(d) {return getColor(d)})
//    .attr("fill", function(d) {return test_getColor(d)})
//    .style("fill", "pink")
//    .attr("fill", function(d) {return cbScale(d.properties.conc)});
    ;

    
   var addDataPoints = d3.json("data.json", function(error, jsonData) {
         console.log("The json error is:");
         console.log(error);
         console.log("The json data is:");
         console.log(jsonData);
         console.log("The first point is: " + jsonData.features[0].geometry.coordinates)
         console.log("The first color is: " + jsonData.features[0].properties.conc)
      
//         var dataPoints = jsonData.features;
//         for (var i = 0; i < dataPoints.length; i++) {
            dataMap.append("path")
               .attr("d", path(jsonData))
//               .style("fill", function(d) {return cbScale(d.properties.conc);})
               .style("fill-opacity", 0.5)
               //.style("fill", "pink");
//         }
});


//    .style("fill", function(d) {return cbScale(mySquare.features[0].properties.conc)});

         
  // Make sure to put the map on top of the data
  // load data and display the map on the canvas with country geometries
  var addMap = d3.json("world-110m.json", function(error, topology) {
      worldMap.selectAll("path")
        .data(topojson.object(topology, topology.objects.countries)
            .geometries)
      .enter()
        .append("path")
        .attr("d", path)
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
 
/*
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

*/

//    circles
//        .on("mouseover",function(d) {pointer.pointTo(d[whichValue])})a

