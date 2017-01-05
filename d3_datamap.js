 <!-- map creation --> 
  // canvas resolution

jsonList = ["random.json", "data.json", "json/O3.json", "json/O3_difference.json", "json/O3_fractional.json"];
<<<<<<< HEAD
cb_color_list = [["white", "purple"], ["red", "blue"], ["red", "white", "blue"]];
=======
cb_color_list = [["white", "purple"], ["red", "blue"]];
>>>>>>> 278e7ee96fa62165080094029b33284fe4b5c1b9
cbScheme = cb_color_list[0]

function showLoader() {
   document.getElementById('loader').style.visibility='visible';
}

function hideLoader() {
   document.getElementById('loader').style.visibility='hidden';
}

function createMapContainer() {
  var projection = d3.geo.equirectangular()
      // where to center the map in degrees
      .center([0, 0 ])
      // zoomlevel
      .scale(150*scale)
      // Translate to the center of the div
      .translate([480*scale, 250*scale])
      // map-rotation
      .rotate([0,0])
      ;

  map = d3.select("body").append("div")
         .attr("id", "mapArea")
         .attr("align","center")
         .style("display","block")
         .style("margin","auto")

  svg = map.append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("id", "map")
      .attr("align","center")
      .style("display","block")
      .style("margin","auto")
      ;
  // defines "path" as return of geographic features
  path = d3.geo.path()
      .projection(projection);
 
  // group the svg layers 
  // This is the order the layers appear. top is rendered first and subsequent are redered ontop.
  //var dataMap = svg.append("g").attr("transform", "translate(" + width/5 + "," + height/5 + ")");
  dataMap = svg.append("g");
  testMap = svg.append("g");
  worldMap = svg.append("g");

  // Add the world map
  addWorldMap();
}

function addTitle() {
  var title = d3.select("body")
         .append("div")
         .attr("id","title")
         .attr("display", "block")
         .attr("margin", "auto")
         .append("p")
         .attr("id", "title_text")
         .attr("width",width)
         .attr("height",height/5)
         .style("text-align", "center")
         .style("font-size","2pc")
         .text("Title of Grapg")

  title_text = document.getElementById("title_text")
}
   
function loadpage() {
  // Get the size of the page so the map fills 80% of it, and dont make it too big
  scale = 0.8*Math.min(document.body.clientWidth/960, 2);
  width = 960*scale;
  height = 500*scale;

   // Create the page in the following order

   showLoader();

   addDropDown();
   addCbDropDown();
   addTitle();
   createMapContainer();
   createColorbar();
   //addTestData();
   addDataPoints("random.json");

   hideLoader();
   };



function refreshColorbar() {
   colorbar = Colorbar()
            .origin([15,5])
            .scale(cbScale)
            .orient("horizontal")
            .barlength(0.7*width)
            .thickness(30)
            ;
    pointer = d3.select(placeholder).call(colorbar);
}
function updateColorbarColors(cbScheme) {
   cbScale = d3.scale.linear()
               .range(cbScheme)
               .domain([cbMin, cbMax])
                ;
    refreshColorbar();
    // Reload the data
    addDataPoints(d3.select('select').property('value'))
}

function updateColorbar(minmax) {
   cbMin = minmax[0];
   cbMax = minmax[1];
//   if cbScheme legnth is 3 then add a midpoint, else only have two points in the domain.
   if (cbScheme.length==3) {
	   cbMid = ( cbMin + cbMax ) / 2.0
	   cbDomain = [cbMin, cbMid, cbMax]
   } else {
	   cbDomain = [cbMin, cbMax]
   }
   cbScale = d3.scale.linear()
               .range(cbScheme)
               .domain(cbDomain)
                ;
    refreshColorbar();
}

function createColorbar() {
  var bar =  d3.select("body").append("div")
         .attr("id","colorbar")
         .style("text-align","center")
         ;

   cbScale = d3.scale.linear()
            .range(cbScheme)
            .domain([0,110])

   getColor = function(d) {
      var outColor;
      outColor = cbScale(d.properties.conc);
      return outColor};

   console.log( "color 25 = " + cbScale(25));
   placeholder = "#colorbar";

    refreshColorbar();
/*
   colorbar = Colorbar()
            .origin([15,5])
            .scale(cbScale)
            .orient("horizontal")
            .barlength(0.7*width)
            .thickness(30)
            ;


    pointer = d3.select(placeholder).call(colorbar);
    */
}

function addDropDown() {
        var select = d3.select('body')
                       .append('select')
                       .attr('class','select')
                       .on('change', onchange)

        var options = select.selectAll('option')
                      .data(jsonList).enter()
                      .append('option')
                      .text(function (d) {return d;});

        function onchange() {
              selectValue = d3.select('select').property('value');
              console.log("changed to: " + selectValue);
              addDataPoints( selectValue );
              }
}

function addCbDropDown() {
        var select = d3.select('body')
                       .append('select')
                       .attr('class','select')
                       .attr('id', 'colorscheme')
                       .on('change', onchange)

        var options = select.selectAll('option')
                      .data(cb_color_list).enter()
                      .append('option')
                      .text(function (d) {return d;});

        function onchange() {
              cbScheme = d3.select('#colorscheme').property('value').split(',');
              console.log("changed to: " + cbScheme);
//              cbScheme = "['"+selectValue[0]+"','"+selectValue[1]+"']"
              updateColorbarColors(cbScheme)
              }
}

    
function addDataPoints(jsonFileName) {


   showLoader();
   // Remove any old data points
   dataMap.selectAll("path").remove();
   // Open the json file and do things with it
   d3.json(jsonFileName, function(error, jsonData) {
         hideLoader();
         console.log("The json error is:");
         console.log(error);
         console.log("The json data is:");
         console.log(jsonData);
         console.log("The first point is: " + jsonData.features[0].geometry.coordinates)
         console.log("The first color is: " + jsonData.features[0].properties.conc)

         // Update the title
         title_text.innerHTML=jsonData.title;

         // Update the colorbar
         updateColorbar([jsonData.minData,jsonData.maxData]);

         var dataPoints = dataMap.selectAll("path").data(jsonData.features)

         dataPoints.enter()
         .append("path")
         .attr("d", path)
               .style("fill", function(d) {return getColor(d)})
               .style("fill-opacity", 1.0)
               .style("stroke-width",0)
                .on('mousemove', function(d) {
                    var mouse = d3.mouse(svg.node()).map(function(d) {
                        return parseInt(d);
                    });
                    pointer.pointTo(d.properties.conc);
                })
//                .on('mouseout', function() {
//                    tooltip.classed('hidden', true);
//                });

});
};

function addTestData() { 

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

 var mySquare2 = testMap.selectAll("path")
   .data(mySquare.features)
   .enter()
    .append("path")
    .attr("d", path)
    .style("fill-opacity", 0.5)
    .style("fill", "blue")
    ;
}

function addWorldMap() {
  var addMap = d3.json("world-110m.json", function(error, topology) {
      worldMap.selectAll("path")
        .data(topojson.object(topology, topology.objects.countries)
            .geometries)
      .enter()
        .append("path")
        .attr("d", path);
  });
}
