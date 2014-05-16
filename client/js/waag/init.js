var WAAG = WAAG || {};

var map, tiles, heat;
var dataSCK=[];
draw=false;

var descriptionsSCK = [
    "humidity",
    "temperature",
    "co",
    "no2",
    "light",
    "noise",
    "nets"
	]

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
	
	d3.json("data/sck.json", function(data){
		data.results.forEach(function(d){
		
			var valuesSCK = {
	            humidity: 52.9,
	            temperature: 21.4,
	            co: 202.2,
	            no2: 15.9,
	            light: 5.4,
	            noise: 50,
	            nets: 12
			}
			
			var value=parseInt(100+(Math.random()*100));
			for(var i=0; i<value; i++){
				var entry=[];
				entry.push(d.geom.coordinates[1]);
				entry.push(d.geom.coordinates[0]);
				entry.push(valuesSCK);
				
				dataSCK.push(entry);
			}
		});

		heat = L.heatLayer([]).addTo(map);
		updateHeatLayers(dataSCK);
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
		
		createSelectList();
		
	});
};

function updateHeatLayers(data){

	var options = {
			maxZoom: 18,
	        radius: 50,
	        blur: 16,
	        max: 2+(Math.random()*5.0)
	    }

	heat.setOptions(options);
	heat.setLatLngs(data);
	
}

function createSelectList() {
	console.log("adding select list");

	d3.select("body").append("div")
		.attr("id", "footer");

	var footer = d3.select("#footer");
	footer.append("h2").html("Choose your Smart Citizen Sensor values")
		
	var select=footer.append("select")
		.attr("class", "select")
		.on("change", function() {
			console.log(this.value);
			updateHeatLayers(dataSCK)
			
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



};

 



