// mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhd25waW5jaWFyYSIsImEiOiJja2hkN2tqYmowaTJkMnBuMXdteW91MTJpIn0.jVToh0NRU1-p-atpdMkloA';
// var latMapbox;
// var lonMapbox;
// var map = new mapboxgl.Map({
//     container: 'mapSendPos', // container id
//     style: 'mapbox://styles/mapbox/streets-v11',
//     center: [-96, 37.8], // starting position
//     zoom: 3 // starting zoom
// });
 
// // Initialize the geolocate control.
// var geolocate = new mapboxgl.GeolocateControl({
//     positionOptions: {
//     enableHighAccuracy: true
//     },
//     trackUserLocation: true
    
// });
//     // Add the control to the map.
// map.addControl(geolocate);
//     // Set an event listener that fires
//     // when a geolocate event occurs.
// geolocate.on('geolocate', function() {
//         console.log('A geolocate event has occurred.')
//         navigator.geolocation.getCurrentPosition(success, error, options);
// });

// if (navigator.geolocation) { 
//     navigator.geolocation.getCurrentPosition(success, error, options);
// } else { /* geolocation IS NOT available, handle it */ }

// var options = {
//     enableHighAccuracy: true,
//     timeout: 5000,
//     maximumAge: 0
//   };
  
//   function success(pos) {
//     var crd = pos.coords;
//     latMapbox = crd.latitude;
//     lonMapbox = crd.longitude;
  
//     console.log('Your current position is:');
//     console.log(`Latitude : ${crd.latitude}`);
//     console.log(`Longitude: ${crd.longitude}`);
//     console.log(`More or less ${crd.accuracy} meters.`);
//   }
  
//   function error(err) {
//     console.warn(`ERROR(${err.code}): ${err.message}`);
//   }
  