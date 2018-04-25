const DueloController 	= require('./../controllers/duelo');
const userParser        = require('./../middleware/userParser');

const rutas = function(router){
  router.get(       '/duelo', userParser.usuario, userParser.retador, DueloController.get);
  router.post(      '/duelo', userParser.usuario, userParser.retador, DueloController.create);
  router.put(       '/duelo', userParser.usuario, userParser.retador, DueloController.update);
  router.delete(    '/duelo', userParser.usuario, userParser.retador, DueloController.remove);
}

module.exports = rutas;
