const DueloController 	= require('./../controllers/duelo');
const userParser        = require('./../middleware/userParser');
const passport      	  = require('passport');

const rutas = function(router){
  router.get(       '/duelo'            , passport.authenticate('jwt', {session:false}), userParser.retador, DueloController.get);
  router.post(      '/amigo/:id/invitar', passport.authenticate('jwt', {session:false}), DueloController.crearInvitacion);
  router.put(       '/duelo'            , passport.authenticate('jwt', {session:false}), userParser.retador, DueloController.update);
  router.delete(    '/duelo'            , passport.authenticate('jwt', {session:false}), userParser.retador, DueloController.remove);
  //rutas invitacion
  router.get('/invitacion/:id/aceptar'  ,  passport.authenticate('jwt', {session:false}), DueloController.aceptar);
  router.get('/invitacion/:id/rechazar' ,  passport.authenticate('jwt', {session:false}), DueloController.rechazar);
}

module.exports = rutas;
