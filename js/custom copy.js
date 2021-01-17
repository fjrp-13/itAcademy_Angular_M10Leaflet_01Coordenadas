const APP_PARAMS = {
    idMapPreffix: 'map',
    mapInitialCoordinates: {
        lat: 41.38736,
        lng: 2.1696958
    },
    defaultMarkerData: {
        title: '',
        data01: '',
        data02: ''
    }
};

const MARKER_TEMPLATE = [
    '<p class="marker-title">{{MARKER_TITLE}}</p>',
    '<p class="marker-body">{{MARKER_DATA_01}}<br/>{{MARKER_DATA_02}}</p>'
].join('');

const MARKER_COORDINATES_TEMPLATE = [
    '<p class="marker-body">Mis coordenadas son:</p>',
    '<p class="marker-body text-bold">Lat: {{MARKER_DATA_01}}<br/>Lng: {{MARKER_DATA_02}}</p>'
].join('');

const MARKER_CENT_FOCS = {
    lat1: 41.3868976,
    lng1: 2.1638252,
    lat: 41.387995892452146,
    lng: 2.164595754905436,
    title: 'Restaurant Centfocs',
    text: 'Restaurante mediterráneo',
    address: 'Carrer de Balmes, 16, 08007 Barcelona'
};

/* Sustituye los parámetros de las plantillas de Markers por sus valores
    @Params:
        - markerData: objeto con los datos del Marker
        - template: plantilla a utilizar
    @Return:
        - El contenido de la plantilla una vez procesada
*/
function setMarkerContent(markerData, template) {
    var content = template
    .replaceAll('{{MARKER_TITLE}}', markerData.title || '')
    .replaceAll('{{MARKER_DATA_01}}', markerData.data01 || '')
    .replaceAll('{{MARKER_DATA_02}}', markerData.data02 || '');

    return content;
}

/* Inicializa un mapa
    @Params:
        - idMap: id del mapa a inicializar
    @Return:
        - El objeto Mapa
*/
function setupMap(idMap) {
    // Setup map
    var map = L.map(idMap).setView([APP_PARAMS.mapInitialCoordinates.lat, APP_PARAMS.mapInitialCoordinates.lng], 16.5);

    // Setup tilelayer
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    return map;
}

/* Elimina los Markers de un mapa
    @Params:
        - map: Mapa al que eliminar sus Markers
*/
function clearMapMarkers(map) {
    map.eachLayer(function(layer){
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
}

/* Crea un Marker en un mapa
    @Params:
        - map: Mapa al que crear el Marker
        - options: objeto con los datos para el Maker
*/
function createMarker(map, options) {
    var defaults = {
        clearMarkers: false,
        openMarker: false,
        latlng: null,
        data: $.extend({}, APP_PARAMS.defaultMarkerData)
    };
    options = $.extend(defaults, options);
    if (options.clearMarkers == true) {
        clearMapMarkers(map);
    }
    var marker = L.marker([options.latlng.lat, options.latlng.lng]).addTo(map);
    marker.bindPopup(setMarkerContent(options.data, MARKER_COORDINATES_TEMPLATE))
    if (options.openMarker) {
        marker.openPopup();
    }
}


function setupMapLevel1(idMap) {
    // // Setup map
    // var map = L.map(idMap).setView([APP_PARAMS.mapInitialCoordinates.lat, APP_PARAMS.mapInitialCoordinates.lng], 16.5);

    // // Setup tilelayer
    // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    // }).addTo(map);

    var map = setupMap(idMap);

    // Add marker
    var marker = L.marker([MARKER_CENT_FOCS.lat, MARKER_CENT_FOCS.lng]).addTo(map);
    var markerData = {
        title: MARKER_CENT_FOCS.title,
        data01: MARKER_CENT_FOCS.text,
        data02: MARKER_CENT_FOCS.address
    };
    marker.bindPopup(setMarkerContent(markerData, MARKER_TEMPLATE)); //.openPopup();
}


function setupMapLevel2(idMap) {
    var map = setupMap(idMap);

    map.on('click', function(e) {
        var options = {
            clearMarkers: true,
            latlng: e.latlng,
            data: {
                title: 'Coordenadas actuales',
                data01: e.latlng.lat,
                data02: e.latlng.lng
            }
        };
        createMarker(map, options);
    });
    // function onMapClick(e) {
    //     popup
    //         .setLatLng(e.latlng)
    //         .setContent("You clicked the map at " + e.latlng.toString())
    //         .openOn(mymap);
    // }

}


function setupMapV1(idMap) {
    // Setup map
    var map = L.map('map').setView([APP_PARAMS.mapInitialCoordinates.lat, APP_PARAMS.mapInitialCoordinates.lng], 16.5);

    // Setup tilelayer
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var marker = L.marker([MARKER_CENT_FOCS.lat, MARKER_CENT_FOCS.lng]).addTo(map);
    //var marker = L.marker([MARKER.lat, MARKER.lng], {icon: L.AwesomeMarkers.icon({icon: 'utensils', prefix: 'fa', markerColor: 'darkblue'}) }).addTo(map);
    
    marker.bindPopup(setMarkerContent(MARKER_CENT_FOCS, MARKER_TEMPLATE)); //.openPopup();
}

/* jqReady */
$(function() {
    var $body = $('body');
    var exLevel = $body.data('exercise-level').toString() || '';
    switch (exLevel) {
        case '1':
            setupMapLevel1(APP_PARAMS.idMapPreffix + exLevel);
            break;
        case '2':
            setupMapLevel2(APP_PARAMS.idMapPreffix + exLevel);
            break;
        case '3':
            setupMapLevel3(APP_PARAMS.idMapPreffix + exLevel);
            break;
    }
});