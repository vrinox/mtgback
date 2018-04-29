const FormatoController = require('./../controllers/formato');

const rutas = function(router){
  router.get(   '/formatos', FormatoController.getAll);
  router.get(   '/formato/:id', FormatoController.get);
  router.post(  '/formato', FormatoController.create);
  router.put(   '/formato/:id', FormatoController.update);
  router.delete('/formato/:id', FormatoController.remove);
}

module.exports = rutas;
