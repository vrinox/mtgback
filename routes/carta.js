const Controller = require('./../controllers/carta');

const rutas = function(router){
  router.post(  '/cartas'         ,  Controller.getAll);
  router.post(  '/cartasAll'      ,  Controller.getAllCards);
  router.get(   '/carta/:id'      ,  Controller.get);
}

module.exports = rutas;
