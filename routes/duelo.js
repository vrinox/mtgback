const DueloController 	= require('./../controllers/duelo');
const userParser        = require('./../middleware/userParser');
const passport      	  = require('passport');

const rutas = function(router){
  router.post(       '/duelo'            , passport.authenticate('jwt', {session:false}), userParser.retador, DueloController.get);
  router.get(       '/duelos'            , passport.authenticate('jwt', {session:false}), DueloController.getAll);
  router.post(      '/duelo/:id/invitar', passport.authenticate('jwt', {session:false}), DueloController.crearInvitacion);
  router.put(       '/duelo'            , passport.authenticate('jwt', {session:false}), userParser.retador, DueloController.update);
  router.delete(    '/duelo'            , passport.authenticate('jwt', {session:false}), userParser.retador, DueloController.remove);
  //rutas invitacion
  router.get('/duelo/:id/aceptar'  ,  passport.authenticate('jwt', {session:false}), DueloController.aceptar);
  router.get('/duelo/:id/rechazar' ,  passport.authenticate('jwt', {session:false}), DueloController.rechazar);
}

module.exports = rutas;
