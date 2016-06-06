// --------------------
// Map Utils
// --------------------

function googlemaps() {
  var google = window.google;
  if (!google) throw new Error('google is not defined');
  var maps = google.maps;
  if (!maps) throw new Error('google.maps is not defined');
  return maps;
}

function getBounds(markers) {
  var maps = googlemaps();
  var bounds = new maps.LatLngBounds();
  for (var i = 0; i < markers.length; i++) {
    var lat = markers[i].lat;
    var lng = markers[i].lng;
    bounds.extend(new maps.LatLng({ lat: lat, lng: lng }));
  }
  return bounds;
}

function getMarkersCenter(markers) {
  return getBounds(markers)
    .getCenter()
    .toJSON();
}

function makeMapOptions(center) {
  return {
    center: center,
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
    dtaggable: true,
    fullscreenControl: false,
    keyboardShortcuts: false,
    mapMarker: true,
    mapTypeControl: false,
    mapTypeId: googlemaps().MapTypeId.ROADMAP,
    overviewMapControl: false,
    panControl: false,
    rotateControl: false,
    scaleControl: false,
    scrollwheel: false,
    signInControl: false,
    streetViewControl: false,
    zoom: 15,
    zoomControl: false
  };
}

function instantiateOriginalMarker(map, marker) {
  var lat = marker.lat;
  var lng = marker.lng;
  var label = marker.label;
  var position = { lat: lat, lng: lng };
  var marker = new OriginalMarker(position, label, map);
}

function createMap(element, markers) {
  var center = getMarkersCenter(markers);
  var mapOptions = makeMapOptions(center);
  var maps = googlemaps();
  var map = new maps.Map(element, mapOptions);
  return map;
}

function addOriginalMarkers(map, markers) {
  for (var i = 0; i < markers.length; i++) {
    instantiateOriginalMarker(map, markers[i]);
  }
}

// --------------------
// OriginalMarker
// --------------------

var maps = googlemaps();
OriginalMarker.prototype = new maps.OverlayView();

function OriginalMarker(position, text, map) {
  var maps = googlemaps();
  var bounds = new maps.LatLngBounds();
  bounds.extend(new maps.LatLng(position.lat, position.lng));
  this.bounds_ = bounds;
  this.text_ = text;

  this.div_ = null;
  this.setMap(map);
}

OriginalMarker.prototype.onAdd = function() {
  var div = document.createElement('div');
  div.setAttribute('class', 'original-marker');
  div.style.position = 'abolute';
  this.div_ = div;

  var toolTip = document.createElement('div');
  toolTip.setAttribute('class', 'tooltip');
  div.appendChild(toolTip);

  var pointMarker = document.createElement('div');
  pointMarker.setAttribute('class', 'point-marker');
  toolTip.appendChild(pointMarker);

  var pointLabel = document.createElement('div');
  pointLabel.setAttribute('class', 'point-label');
  pointMarker.appendChild(pointLabel);

  var label = document.createElement('span');
  label.setAttribute('class', 'label');
  label.textContent = this.text_;
  pointLabel.appendChild(label);

  var panes = this.getPanes();
  panes.overlayLayer.appendChild(div);
};

OriginalMarker.prototype.draw = function() {
  var overlayProjection = this.getProjection();
  var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
  var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

  var div = this.div_;
  div.style.left = sw.x + 'px';
  div.style.top = ne.y - 30 + 'px';
  div.style.position = 'absolute';
};

OriginalMarker.prototype.onRemove = function() {
  this.div_.parentNode.removeChild(this.div_);
  this.div_ = null;
};

// --------------------
// Init
// --------------------

var element = document.getElementById('google-maps');
var markers = [
  {
    lat: 34.6335514,
    lng: 135.08238319999998,
    label: '01'
  },
  {
    lat: 34.6349264,
    lng: 135.0824887,
    label: '02'
  },
  {
    lat: 34.6343237,
    lng: 135.08472459999996,
    label: '03'
  }
];

var map = createMap(element, markers);
addOriginalMarkers(map, markers);
