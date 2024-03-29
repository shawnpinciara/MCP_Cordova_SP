
// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
// mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhd25waW5jaWFyYSIsImEiOiJja2hkN2tqYmowaTJkMnBuMXdteW91MTJpIn0.jVToh0NRU1-p-atpdMkloA';
var lon = 0;
var lat = 0;
var watchPositionLon = 51.507351;
var watchPositionLat = -0.127758;

mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhd25waW5jaWFyYSIsImEiOiJja2hkN2tqYmowaTJkMnBuMXdteW91MTJpIn0.jVToh0NRU1-p-atpdMkloA';

function openMapbox(lat,lon) {
   var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lon, lat], // starting position [lng, lat]
      zoom: 9 // starting zoom
   });

   var marker = new mapboxgl.Marker({
            color: "#e60000",
            draggable: false
            }).setLngLat([lon, lat])
            .addTo(map);
}


   var map = new mapboxgl.Map({
      container: 'mapSendPos',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [watchPositionLon, watchPositionLon], // starting position [lng, lat]
      cancelable: false,
      zoom: 6 // starting zoom
   });

   var marker = new mapboxgl.Marker({
            color: "#e60000",
            draggable: false,
            cancelable: false
            }).setLngLat([watchPositionLon, watchPositionLat])
            .addTo(map);



function getPosition() {
    var options = {
       enableHighAccuracy: true,
       maximumAge: 3600000
    }
    var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
 
    function onSuccess(position) {
      marker.setLngLat([watchPositionLon,watchPositionLat]);
      map.setCenter([watchPositionLon,watchPositionLat]);
            
      //  alert('Latitude: '          + position.coords.latitude          + '\n' +
      //     'Longitude: '         + position.coords.longitude         + '\n' +
      //     'Altitude: '          + position.coords.altitude          + '\n' +
      //     'Accuracy: '          + position.coords.accuracy          + '\n' +
      //     'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
      //     'Heading: '           + position.coords.heading           + '\n' +
      //     'Speed: '             + position.coords.speed             + '\n' +
      //     'Timestamp: '         + position.timestamp                + '\n');
    };
 
    function onError(error) {
       alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
    }
 }
 
 function watchPosition() {
    var options = {
       maximumAge: 3600000,
       timeout: 3000,
       enableHighAccuracy: true,
    }
    var watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
 
    function onSuccess(position) {
      watchPositionLon = position.coords.longitude;
      watchPositionLat = position.coords.latitude;
      marker.setLngLat([watchPositionLon,watchPositionLat]);
      map.setCenter([watchPositionLon,watchPositionLat]);
      console.log('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
         //  'Accuracy: '          + position.coords.accuracy          + '\n' +
         //  'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
         //  'Heading: '           + position.coords.heading           + '\n' +
         //  'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
    };
 
    function onError(error) {
       alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
    }
 }

