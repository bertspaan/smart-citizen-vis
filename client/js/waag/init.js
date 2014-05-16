var WAAG = WAAG || {};

var map, tiles, heat;
var dataSet=[];
draw=false;

function onWindowResize(event) {
	console.log('resize');

	w = window.innerWidth;
	h = window.innerHeight;
	

};

function init(){
	
	onWindowResize(null);
	map = L.map('map').setView([52.367,4.915], 12);
	tiles = L.tileLayer('http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
	    attribution: '<a href="https://www.mapbox.com/about/maps/">Terms and Feedback</a>',
	    id: 'examples.map-20v6611k'
	}).addTo(map);
	
	d3.json("data/sck.json", function(data){
		data.results.forEach(function(d){
			//console.log(d.geom);
			var value=parseInt(100+(Math.random()*100));
			for(var i=0; i<value; i++){
				var entry=[];
				entry.push(d.geom.coordinates[1]);
				entry.push(d.geom.coordinates[0]);
				dataSet.push(entry);
				
			}
			
			
		});

		console.log(dataSet.length);
		heat = L.heatLayer(dataSet).addTo(map);
		
		var options = {
				maxZoom: 18,
		        radius: 50,
		        blur: 16,
		        max: 5.0
		    }
		
		heat.setOptions(options);
		
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



