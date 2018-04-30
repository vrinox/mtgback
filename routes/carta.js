const Controller = require('./../controllers/carta');

const rutas = function(router){
  router.get(   '/mazos',     Controller.getAll);
  router.get(   '/mazo/:id',  Controller.get);
}

module.exports = rutas;
