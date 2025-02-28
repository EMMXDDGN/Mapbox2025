// AccesToken

mapboxgl.accessToken = 'pk.eyJ1IjoiZW5vcmFhdXNzZWlsIiwiYSI6ImNtNzM2MWx0OTA1aGcya3M5Znc4dzdmNDYifQ.19q-so6ybesRMH3dXkPmpg';

// Configuration de la carte
var map = new maplibregl.Map({
container: 'map',
style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json', // Fond de carte
center: [-1.690129, 48.11], // lat/long
zoom: 11.5, // zoom
pitch: 0, // Inclinaison
bearing: 0 // Rotation
});

// Gestion du changement de style
document.getElementById('style-selector').addEventListener('change', function () {
    map.setStyle(this.value);
    map.once('style.load', addLayers); // Recharge les couches après changement de style
  });

// Boutons de navigation
var nav = new maplibregl.NavigationControl();
map.addControl(nav, 'top-right');

// Ajout Echelle cartographique
map.addControl(new maplibregl.ScaleControl({
maxWidth: 120,
unit: 'metric'}));

// Bouton de géolocalisation
map.addControl(new maplibregl.GeolocateControl
({positionOptions: {enableHighAccuracy: true},
trackUserLocation: true,
showUserHeading: true}));

// Configuration onglets geographiques
// Gare
document.getElementById('Gare').addEventListener('click', function ()
{ map.flyTo({zoom: 16,

center: [-1.6722, 48.1037],
pitch: 30,
bearing: -197.6 }); // définit l'orientation de la carte en degrès

});

// Rennes 1 
document.getElementById('Rennes1').addEventListener('click', function ()
{ map.flyTo({zoom: 16,

center: [-1.6386769529693872, 48.11728016291747],
pitch: 30,
bearing: -197.6 }); // définit l'orientation de la carte en degrès

});

// Rennes 2 
document.getElementById('Rennes2').addEventListener('click', function ()
{ map.flyTo({zoom: 16,

center: [-1.7025491138898543, 48.11933116788042],
pitch: 30,
bearing: -197.6 }); // définit l'orientation de la carte en degrès

});

// AJOUT DE COUCHE

function addLayers() {
  
    // Ajout de la source
    map.addSource('mapbox-streets-v8', {
        type: 'vector',
        url: 'https://openmaptiles.geo.data.gouv.fr/data/france-vector.json'
    });

    // Ajout de la couche
    map.addLayer({
        "id": "Routes",
        "type": "line",
        "source": "mapbox-streets-v8",
        "layout": { "visibility": "visible" },
        "source-layer": "transportation",
        "filter": ["all", ["in", "class", "motorway", "trunk", "primary"]],
        "paint": { "line-color": "#A9A9A9", "line-width": 1 },
        "maxzoom": 15.5,
    });
  
      // Hydrologie
  map.addLayer({
  "id": "hydrologie",
  "type": "fill",
  "source": "mapbox-streets-v8",
  "source-layer": "water",
     'layout': {'visibility': 'visible'},
  "paint": {"fill-color": "#AFEEEE"},
});
 
    // BUS OSM

$.getJSON(`https://overpass-api.de/api/interpreter?data=[out:json];area[name="${ville}"]->.searchArea;(node["highway"="bus_stop"](area.searchArea););out center;`,
function(data) {var geojsonBUS = {
type: 'FeatureCollection',
features: data.elements.map(function(element) {
return {type: 'Feature',
geometry: { type: 'Point',coordinates: [element.lon, element.lat] },
properties: {}};
})
};
map.addSource('customBUS', {
type: 'geojson',
data: geojsonBUS
});
map.addLayer({
'id': 'pubs',
'type': 'circle',
'source': 'customBUS',
'paint': {'circle-color': '#ffa6d1',
'circle-radius': 5},
'layout': {'visibility': 'visible'}
});
});
 

     // AJOUT DU CADASTRE ETALAB
map.addSource('Cadastre', {
type: 'vector',
url: 'https://openmaptiles.geo.data.gouv.fr/data/cadastre.json' });

map.addLayer({

'id': 'Cadastre',
'type': 'line',
'source': 'Cadastre',
'source-layer': 'parcelles',
'layout': {'visibility': 'none'},
'paint': {'line-color': '#000000'},
'minzoom':16, 'maxzoom':19 });

map.setPaintProperty('communeslimites', 'line-width', ["interpolate",["exponential",1],["zoom"],16,0.3,18,1]);
 
  
    // Ajout BDTOPO
map.addSource('BDTOPO', {
type: 'vector',
url: 'https://data.geopf.fr/tms/1.0.0/BDTOPO/metadata.json',
minzoom: 15,
maxzoom: 19
});
map.addLayer({
'id': 'batiments',
'type': 'fill-extrusion',
'source': 'BDTOPO',
'source-layer': 'batiment',
'paint': {'fill-extrusion-color': {'property': 'hauteur',
'stops': 
[[1, '#feebe2'],
[10, '#fcc5c0'],
[20, '#fa9fb5'],
[50, '#f768a1'],
[100, '#dd3497'],
[150, '#ae017e'],
[200, '#7a0177']]},
'fill-extrusion-height':{'type': 'identity','property': 'hauteur'},
'fill-extrusion-opacity': 0.90,
'fill-extrusion-base': 0},
'layout': {'visibility': 'none'},
}); 

      // Ajout contour de Rennes
dataCadastre = 'https://apicarto.ign.fr/api/cadastre/commune?code_insee=35238';
jQuery.when(jQuery.getJSON(dataCadastre)).done(function(json) {
  for (i = 0; i < json.features.length; i++) {
	json.features[i].geometry = json.features[i].geometry;
  }
  map.addLayer({
	'id': 'Contourcommune_35238', // Id unique pour Rennes
	'type': 'line',
	'source': {
  	'type': 'geojson',
  	'data': json
	},
	'paint': {
  	'line-color': 'black',
  	'line-width': 2.5
	},
	'layout': {
  	'visibility': 'visible'
	}
  });
});

    // Ajout contour de Cesson-Sévigné
dataCadastre = 'https://apicarto.ign.fr/api/cadastre/commune?code_insee=35051';
jQuery.when(jQuery.getJSON(dataCadastre)).done(function(json) {
  for (i = 0; i < json.features.length; i++) {
	json.features[i].geometry = json.features[i].geometry;
  }
  map.addLayer({
	'id': 'Contourcommune_35051', // Id unique pour Cesson-Sévigné
	'type': 'line',
	'source': {
  	'type': 'geojson',
  	'data': json
	},
	'paint': {
  	'line-color': 'black',
  	'line-width': 2.5
	},
	'layout': {
  	'visibility': 'none'
	}
  });
});
 

    // Ajout des zones de type N 
dataPLU = 'https://apicarto.ign.fr/api/gpu/zone-urba?partition=DU_243500139';
jQuery.when(jQuery.getJSON(dataPLU)).done(function(json) {
// Filtrer les entités pour ne garder que celles avec typezone = 'N'
var filteredFeatures = json.features.filter(function(feature)
{return feature.properties.typezone === 'N';});
// Créer un objet GeoJSON avec les entités filtrées
var filteredGeoJSON = { type: 'FeatureCollection', features: filteredFeatures};
map.addLayer({
'id': 'PLU',
'type': 'fill',
'source': {'type': 'geojson',
'data': filteredGeoJSON},
'paint': {'fill-color': 'green',
'fill-opacity': 0.2},
'layout': {'visibility': 'none'},
});
}); 

      // Ajout des parking relais 
$.getJSON('https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/tco-parcsrelais-star-etat-tr/records?limit=20',
function(data) {var geojsonData4 = {
type: 'FeatureCollection',
features: data.results.map(function(element) {
return {type: 'Feature',
geometry: {type: 'Point',
coordinates: [element.coordonnees.lon, element.coordonnees.lat]},
properties: { name: element.nom,
capacity: element.jrdinfosoliste}};

})
};
map.addLayer({
  'id': 'Parcs_relais',
  'type': 'circle',
  'source': {
    'type': 'geojson',
    'data': geojsonData4
  },
  'paint': {
'circle-color': 'orange',
'circle-radius': {property: 'capacity',
type: 'exponential',
stops: [[10, 5],[2000, 40]]},
'circle-opacity': 0.8}
});                        
});  

     // Ajout des stations vélos STAR  
$.getJSON('https://data.explore.star.fr/api/explore/v2.1/catalog/datasets/vls-stations-etat-tr/records?limit=60',
function(data) {var geojsonVLS = {
type: 'FeatureCollection',
features: data.results.map(function(element) {
return {type: 'Feature',
geometry: {type: 'Point',
coordinates: [element.coordonnees.lon, element.coordonnees.lat]},
properties: { DISPO: element.nombreemplacementsdisponibles,
VELO: element.nombrevelosdisponibles, NOM: element.nom}};

})
};
map.addLayer({ 'id': 'VLS',
'type':'circle',
'source': {'type': 'geojson',
'data': geojsonVLS},
'paint': {'circle-color': '#FF2E94', 
          'circle-radius': {property: 'VELO',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#eae2b7',
type: 'exponential',
stops: [[1, 1],[100, 40]]},
'circle-opacity': 0.8},
'layout': {'visibility': 'none'},              
});
});  
  
}

      // Ajout des positions de bus en temps réel 
$.getJSON('https://data.explore.star.fr/api/explore/v2.1/catalog/datasets/tco-bus-vehicules-position-tr/records?limit=100',
function(data) {var geojsonBus = {
type: 'FeatureCollection',
features: data.results.map(function(element) {
return {type: 'Feature',
geometry: {type: 'Point',
coordinates: [element.coordonnees.lon, element.coordonnees.lat]},
properties: { name: element.idbus,
capacity: element.numerobus}};

})
};
map.addLayer({ 'id': 'BUS',

'type':'circle',
'source': {'type': 'geojson',
'data': geojsonBus},
'paint': {'circle-color': 'black'},
'layout': {'visibility': 'none'},
});
});

    // BAR OSM
const ville = "Rennes";
$.getJSON(`https://overpass-api.de/api/interpreter?data=[out:json];area[name="${ville}"]->.searchArea;(node["amenity"="bar"](area.searchArea););out center;`,
function(data) {var geojsonData = {
type: 'FeatureCollection',
features: data.elements.map(function(element) {
return {type: 'Feature',
geometry: { type: 'Point',coordinates: [element.lon, element.lat] },
properties: {}};
})
};
map.addSource('customData', {
type: 'geojson',
data: geojsonData
});
map.addLayer({
'id': 'pubs',
'type': 'circle',
'source': 'customData',
'paint': {'circle-color': '#00AB44',
'circle-radius': 5},
'layout': {'visibility': 'none'}
});
});

    // AJOUT LIGNE METRO 
$.getJSON(
    `https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3Bway%5B"railway"%3D"subway"%5D%2848.055480065673166%2C-1.7430496215820315%2C48.16196348345478%2C-1.574993133544922%29%3Bout%20geom%3B`,
    function(data) {
        var geojsonOSM_metro = {
            type: 'FeatureCollection',
            features: data.elements.map(function(element) {
                return {
                    type: 'Feature',
                    geometry: { 
                        type: 'LineString',
                        coordinates: element.geometry.map(coord => [coord.lon, coord.lat]) // Correction ici
                    },
                    properties: {}
                };
            })
        };

        map.addSource('customData_metro', {
            type: 'geojson',
            data: geojsonOSM_metro
        });

        map.addLayer({
            'id': 'metro_lignes', // Vous pouvez le renommer en 'metro_lines' pour plus de clarté
            'type': 'line',
            'source': 'customData_metro',
            'paint': {'line-color': 'red'},
            'layout': {'visibility': 'none'},
          
        });
  switchlayer = function (lname) {
            if (document.getElementById(lname + "CB").checked) {
                map.setLayoutProperty(lname, 'visibility', 'visible');
            } else {
                map.setLayoutProperty(lname, 'visibility', 'none');
           }
        }
      
// fin du MAP ON   
    }
);


// Gestion du changement de style
document.getElementById('style-selector').addEventListener('change', function () {
    map.setStyle(this.value);
    map.once('style.load', addLayers); // Recharge les couches après changement de style
});

// Chargement initial des couches
map.on('load', addLayers);



//// INTERACTIVITE
//Interactivité CLICK

    // Pop-up Arrêts de bus
map.on('click', function (e) {
var features = map.queryRenderedFeatures(e.point, { layers: ['Arrets'] });
if (!features.length) {
return;
}
var feature = features[0];
var popup = new maplibregl.Popup({ offset: [0, -15],className: "MypopupR" })
.setLngLat(feature.geometry.coordinates)
.setHTML('<h2>' + feature.properties.nom + '</h2><hr><h3>' //balise hr pour mettre une ligne dans la pop up

+"Mobilier : " + feature.properties.mobilier + '</h3>')

.addTo(map);

});
map.on('mousemove', function (e) {
var features = map.queryRenderedFeatures(e.point, { layers: ['Arrets'] });
map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
});

    // Pop-up VLS
map.on('click', function (e) {
var features = map.queryRenderedFeatures(e.point, { layers: ['VLS'] });
if (!features.length) {
return;
}
var feature = features[0];
var popup = new maplibregl.Popup({ offset: [0, -15], className: "Mypopup",})
.setLngLat(feature.geometry.coordinates)
.setHTML('<h2>' + feature.properties.NOM+ '</h2><hr><h3>' //balise hr pour mettre une ligne dans la pop up
 + feature.properties.DISPO + " socles libres"+'</h3><h3>'
 + feature.properties.VELO + " vélos libres"+'</h3>')

.addTo(map);

});
map.on('mousemove', function (e) {
var features = map.queryRenderedFeatures(e.point, { layers: ['GG'] });
map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
});


//Interactivité HOVER

    // Hover Parc-relais
var popup = new maplibregl.Popup({
className: "MypopupO",
closeButton: false,
closeOnClick: false });
map.on('mousemove', function(e) {
var features = map.queryRenderedFeatures(e.point, { layers: ['Parcs_relais'] });
// Change the cursor style as a UI indicator.
map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
if (!features.length) {
popup.remove();
return; }
var feature = features[0];
popup.setLngLat(feature.geometry.coordinates)
.setHTML('<h2>' + feature.properties.name+ '</h2><hr><h3>' //balise hr pour mettre une ligne dans la pop up

 + feature.properties.capacity + " places disponibles" +'</h3>')
  
  
.addTo(map);
    
  
});