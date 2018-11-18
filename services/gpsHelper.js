const gpsHelper = {};
  gpsHelper.rad = function(x) {
    return x * Math.PI / 180;
  }

  gpsHelper.obtenerDistancia = function(cliente1, cliente2) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(cliente2.ubicacion.lat - cliente1.ubicacion.lat);
    var dLong = rad(cliente2.ubicacion.lng - cliente1.ubicacion.lng);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(cliente1.ubicacion.lat)) * Math.cos(rad(cliente2.ubicacion.lat)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
  }

module.exports.gpsHelper = gpsHelper;