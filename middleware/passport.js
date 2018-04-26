const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Usuario = require('../models').Usuario;

module.exports = function(passport){
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = CONFIG.jwt_encryption;

    passport.use(new JwtStrategy(opts, async function(jwt_payload, done){
        let err, usuario;
        [err, usuario] = await to(Usuario.findById(jwt_payload.user_id));

        if(err) return done(err, false);
        if(usuario) {
            return done(null, usuario);
        }else{
            return done(null, false);
        }
    }));
}
