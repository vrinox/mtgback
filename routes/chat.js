const Controller = require('./../controllers/chat');
const passport    = require('passport');

const rutas = function(router){
  router.get(   '/chats'   , passport.authenticate('jwt', {session:false}), Controller.getAll);
  router.get(   '/chat/:id', passport.authenticate('jwt', {session:false}), Controller.get);
  router.get(   '/chat/:id/mensajes', passport.authenticate('jwt', {session:false}), Controller.getMsg);
  router.post(  '/chat'    , passport.authenticate('jwt', {session:false}), Controller.create);
}

module.exports = rutas;
