const Controller = require('./../controllers/mazo');

const rutas = function(router){
  router.get(   '/mazo', Controller.getAll);
  router.get(   '/mazo/:id', Controller.get);
  router.post(  '/mazo', Controller.create);
  router.put(   '/mazo/:id', Controller.update);
  router.delete('/mazo/:id', Controller.remove);
}

module.exports = rutas;
