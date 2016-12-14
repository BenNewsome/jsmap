 <!-- map creation --> 
  // canvas resolution
  var width = 800;
  var height = 600;

var width = document.body.clientWidth;
var height = 0.5*width

var scale = 100*(width/700)
 
  // projection-settings for mercator    
//  var projection = d3.geo.mercator()
  var projection = d3.geo.equirectangular()
      // where to center the map in degrees
      .center([0, 0 ])
      // zoomlevel
      .scale(scale)
      // map-rotation
      .rotate([0,0]);
 
  // defines "svg" as data type and "make canvas" command
  
  var title = d3.select("body")
         .append("div")
         .attr("id","title")
         .attr("display", "block")
         .attr("margin", "auto")
         .append("p")
         .attr("width",width)
         .attr("height",height/5)
         .style("text-align", "center")
         .text("Title of Grapg")




  var map = d3.select("body").append("div")
         .attr("id", "mapArea")
         .style("text-align","center")
         .style("display","block")
         .style("margin","auto")


  var bar =  d3.select("body").append("div")
//         .append("g")
         .attr("id","colorbar")
         .style("text-align","center")
         ;


  var svg = map.append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("id", "map")
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


    var colorbar = Colorbar()
//            .origin([width/2,50])
            .scale(cbScale)
//            .orient("vertical")
            .orient("horizontal")
            .barlength(0.7*width)
            .thickness(30)
            ;

    placeholder = "#colorbar-here";

    colorbarObject = d3.select(placeholder)
    .call(colorbar)
    ;
    

  pointer = d3.selectAll("#colorbar").call(colorbar);



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


function showLoader() {
   document.getElementById('loader').style.visibility='visible';
}

function hideLoader() {
   document.getElementById('loader').style.visibility='hidden';
}


function removeDataPoints() {
   showLoader();
   dataMap.selectAll("path").remove();
   hideLoader();
};
    
   function addDataPoints(jsonFileName) {
   showLoader();
      d3.json(jsonFileName, function(error, jsonData) {
           hideLoader();
         console.log("The json error is:");
         console.log(error);
         console.log("The json data is:");
         console.log(jsonData);
         console.log("The first point is: " + jsonData.features[0].geometry.coordinates)
         console.log("The first color is: " + jsonData.features[0].properties.conc)


         // Set the title
//         title.append("text").attr("x",width/2).attr("y", 0-(margin.top / 2)).text("My Ttitle")



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
  /*                  tooltip.classed('hidden', false)
                        .attr('style', 'left:' + (mouse[0] + 15) +
                                'px; top:' + (mouse[1] - 35) + 'px')
                        .html(d.properties.name);
 */                   pointer.pointTo(d.properties.conc);
                })
                .on('mouseout', function() {
                    tooltip.classed('hidden', true);
                });

});
};




  var addMap = d3.json("world-110m.json", function(error, topology) {
      worldMap.selectAll("path")
        .data(topojson.object(topology, topology.objects.countries)
            .geometries)
      .enter()
        .append("path")
        .attr("d", path);
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
 



//    bar =  d3.selectAll("svg").append("g").attr("id","colorbar");


/*
   // Dropdown options
   d3.select(".demoSelection")
      .append("option")
      .attr("value",1)
      .text("Hello");
   d3.select(".demoSelection")
      .append("option")
      .attr("value",2)
      .text("Hello there");
*/

//    circles
//        .on("mouseover",function(d) {pointer.pointTo(d[whichValue])})a

