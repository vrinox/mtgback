const Controller = require('./../controllers/carta');

const rutas = function(router){
  router.post(  '/cartas'         ,  Controller.getAll);
  router.get(   '/cartas/:nombre' ,  Controller.getPorNombre);
  router.get(   '/carta/:id'      ,  Controller.get);
}

module.exports = rutas;
