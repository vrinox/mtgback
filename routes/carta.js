const Controller = require('./../controllers/carta');

const rutas = function(router){
  router.get(   '/cartas',     Controller.getAll);
  router.get(   '/carta/:id',  Controller.get);
}

module.exports = rutas;
