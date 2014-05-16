var WAAG = WAAG || {};

var map, tiles, heat;
var max, min;

var draw=false;
var dataSCK=[];

//wg30.waag.org:8080

var descriptionsSCK = [
    "noise",
	"nets",
	"temperature",
    "co",
    "no2",
    "light",
	"humidity"
	];
var activeValue=descriptionsSCK [0];	

function onWindowResize(event) {
	console.log('resize');

	w = window.innerWidth;
	h = window.innerHeight;
	

};

function init(){
	
	onWindowResize(null);
	map = L.map('map').setView([52.367,4.915], 12);
	tiles = L.tileLayer('http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
		maxZoom: 13,
		minZoom: 10,
	    attribution: '<a href="https://www.mapbox.com/about/maps/">Terms and Feedback</a>',
	    id: 'examples.map-20v6611k'
	}).addTo(map);
	
	d3.json("http://wg30.waag.org:8080", function(data){
		

		heat = L.heatLayer([]).addTo(map);
		createSelectList();
		dataSCK=data;
		
		updateDataSet(dataSCK);
		
		// draw = true;
		// map.on({
		//     movestart: function () { draw = false; },
		//     moveend:   function () { draw = true; },
		//     mousemove: function (e) {
		//         if (draw) {
		//             heat.addLatLng(e.latlng);
		//         }
		//     }
		// });
		
		
		
	});
};

function updateDataSet(dataSCK){

    max =  d3.max(dataSCK.features, function(d) { return d.properties[activeValue]; });
    min =  d3.min(dataSCK.features, function(d) { 
		if(d.properties[activeValue]<1){
			console.log(d);
		}
		
		if(d.properties[activeValue]!=0){
			return d.properties[activeValue]; 
		}
		
	});
	
	console.log("max ="+max+" --> min="+min);
	var data=[];
	dataSCK.features.forEach(function(d){		
		var value=d.properties[activeValue]/max;
		
		value=parseInt(1000*value);
		//console.log(value);
		for(var i=0; i<value; i++){
			var entry=[];
			entry.push(d.geometry.coordinates[1]);
			entry.push(d.geometry.coordinates[0]);
			entry.push(d.properties);
			
			data.push(entry);
		}
	});
	console.log(data.length)
	updateHeatLayers(data);
	
}

function updateHeatLayers(data){

	var options = {
			maxZoom: 18,
	        radius: 50,
	        blur: 16,
	        max: 5.0
	    }

	var mySquare=d3.select("#tweenRefObject");		  
	  mySquare.transition()
	    .duration(2000)
	    .styleTween("opacity", myTweenFunction ); 

	heat.setOptions(options);
	
	heat.setLatLngs(data);

}

function myTweenFunction(d, i, a) {
  console.log( a ); // returns 60, the current value (value at start)
  
  //var year = d3.interpolateNumber(thisyear, 2009);
  //return function(t) { displayYear(year(t)); };
  
  return d3.interpolate(a, 0);
}	

function createSelectList(data) {
	console.log("adding select list");

	d3.select("body").append("div")
		.attr("id", "footer");

	var footer = d3.select("#footer");
	footer.append("h2").html("Choose your Smart Citizen Sensor values")
		
	var select=footer.append("select")
		.attr("class", "select")
		.on("change", function() {
			console.log(this.value);
			activeValue=this.value;
			updateDataSet(dataSCK)
			
		})
		.on("mouseover", function(d) {
			d3.select("body").style("cursor", "pointer");
		})
		.on("mouseout", function(d) {
			d3.select("body").style("cursor", "default");
		});


	select.selectAll("option")
		.data(descriptionsSCK)
		.enter()
		.append("option")
		.attr("value", function(d) {
			return d
		})
		.text(function(d) {
			return d
		})
		
		d3.select("body").append("div")
			.attr("id", "tweenRefObject");	
		



};

 



