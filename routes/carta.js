const Controller = require('./../controllers/carta');

const rutas = function(router){
  router.post(  '/cartas'         ,  Controller.getAll);
  router.get(   '/carta/:id'      ,  Controller.get);
  router.get(   '/cartas/:nombre' ,  Controller.getPorNombre);
}

module.exports = rutas;
