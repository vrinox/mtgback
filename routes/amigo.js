const controlador = require('./../controllers/amigo');
const passport    = require('passport');
const rutas = function(router){
  router.get('/amigos'            , passport.authenticate('jwt', {session:false}),controlador.getAll);
  router.post('/amigo/:id/invitar', passport.authenticate('jwt', {session:false}),controlador.crearInvitacion);
}
module.exports = rutas;
