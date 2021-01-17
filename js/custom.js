const APP_PARAMS = {
    mapInitialCoordinates: {
        lat: 41.38736,
        lng: 2.1696958
    },
    defaultMarkerData: {
        title: '',
        data01: '',
        data02: ''
    },
    maxZoom: '18',
    
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
    // var map = L.map(idMap).setView([APP_PARAMS.mapInitialCoordinates.lat, APP_PARAMS.mapInitialCoordinates.lng], 16.5);
    var map = L.map(idMap).setView([APP_PARAMS.mapInitialCoordinates.lat, APP_PARAMS.mapInitialCoordinates.lng], 18);

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
        icon: {}, // { icon:greenIcon }
        data: $.extend({}, APP_PARAMS.defaultMarkerData)
    };
    options = $.extend(defaults, options);
    if (options.clearMarkers == true) {
        clearMapMarkers(map);
    }

    var marker = L.marker([options.latlng.lat, options.latlng.lng], options.icon).addTo(map);
    marker.bindPopup(setMarkerContent(options.data, MARKER_COORDINATES_TEMPLATE))
    if (options.openMarker) {
        marker.openPopup();
    }
}


/* Ejercicio de Nivel 1 */
function setupMapLevel1(idMap) {
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

/* Ejercicio de Nivel 2 */
function setupMapLevel2(idMap) {
    var map = setupMap(idMap);
    
    map.on('click', function(e) {
        var options = {
            clearMarkers: true,
            openMarker: true,
            latlng: e.latlng,
            data: {
                title: 'Coordenadas actuales',
                data01: e.latlng.lat,
                data02: e.latlng.lng
            }
        };
        createMarker(map, options);
        map.setView([e.latlng.lat, e.latlng.lng], APP_PARAMS.maxZoom);
    });
}

/* Ejercicio de Nivel 3 */
function setupMapLevel3(idMap) {
    var greenIcon = L.icon({
        iconUrl: 'images/marker-icon-green.png',
        shadowUrl: 'images/marker-shadow.png',
        iconSize:     [25, 40],
        iconAnchor:   [15, 35],
        popupAnchor:  [-2, -35]
    });
    var map = setupMap(idMap);
    
    map.on('click', function(e) {
        var options = {
            clearMarkers: true,
            openMarker: true,
            latlng: e.latlng,
            icon: {icon: greenIcon},
            data: {
                title: 'Coordenadas actuales',
                data01: e.latlng.lat,
                data02: e.latlng.lng
            }
        };
        createMarker(map, options);
        map.setView([e.latlng.lat, e.latlng.lng], APP_PARAMS.maxZoom);
    });
}

/* jqReady */
$(function() {
    var $map = $('.map');
    var idMap = $map.attr('id');
    var exLevel = $('body').data('exercise-level') || '';
    switch (exLevel.toString()) {
        case '1':
            setupMapLevel1(idMap);
            break;
        case '2':
            setupMapLevel2(idMap);
            break;
        case '3':
            setupMapLevel3(idMap);
            break;
    }
});