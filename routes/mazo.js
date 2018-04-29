const Controller = require('./../controllers/mazo');
const passport      	  = require('passport');

const rutas = function(router){
  router.get(   '/mazos',     passport.authenticate('jwt', {session:false}), Controller.getAll);
  router.get(   '/mazo/:id', passport.authenticate('jwt', {session:false}), Controller.get);
  router.post(  '/mazo',     passport.authenticate('jwt', {session:false}), Controller.create);
  router.put(   '/mazo/:id', passport.authenticate('jwt', {session:false}), Controller.update);
  router.delete('/mazo/:id', passport.authenticate('jwt', {session:false}), Controller.remove);
}

module.exports = rutas;
