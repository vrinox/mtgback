const DueloController 	= require('./../controllers/duelo');
const userParser        = require('./../middleware/userParser');
const passport      	  = require('passport');

const rutas = function(router){
  router.get(       '/duelo', passport.authenticate('jwt', {session:false}), userParser.retador, DueloController.get);
  router.post(      '/duelo', passport.authenticate('jwt', {session:false}), userParser.retador, DueloController.create);
  router.put(       '/duelo', passport.authenticate('jwt', {session:false}), userParser.retador, DueloController.update);
  router.delete(    '/duelo', passport.authenticate('jwt', {session:false}), userParser.retador, DueloController.remove);
}

module.exports = rutas;
