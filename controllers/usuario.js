//modelos
const Usuario     = require('../models').Usuario;
//servicios
const authService = require('./../services/AuthService');
const decorar     = require('../services/decorador');

const create = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    const body = req.body;
    if(!body.usuario && !body.email){
        return ReE(res, 'Por favor ingrese nombre y mail para registrarse');
    } else if(!body.clave){
        return ReE(res, 'Por favor ingrese una clave para registrarse');
    }else{
        let err, usuario,validado;
        [err, validado] = await to(authService.verificar(body));
        if(err) return ReE(res, err, 422);
        if(validado.success){
          console.log("validacion: validado");
          [err, usuario] = await to(authService.createUser(body));
          if(err) return ReE(res, err, 422);
        }else{
          console.log("validacion: ",validado.message);
          return ReE(res, validado.message, 200);
        }

        return ReS(res, {message:'nuevo usuario creado satisfactoriamente.', usuario:usuario.toWeb(), token:usuario.getJWT()}, 201);
    }
}
module.exports.create = create;

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let idUsuario, err, usuario;
    idUsuario = req.params.id;

    [err, usuario] = await to(Usuario.findOne({where:{"id":idUsuario}}));
    if(err) return ReE(res, "err encontrando usuario");

    if(!usuario) return ReE(res, "usuario no encontrando con id "+idUsuario);

    [err, usuario] = await to(decorar.usuario(usuario));
    if(err) next(err, false);

    return ReS(res, {usuario});
}
module.exports.get = get;

const update = async function(req, res){
    let err, usuario, data
    usuario = req.user;
    data = req.body;
    if(data.hasOwnProperty('cambios')){
      //arreglo cambios
      // {
      //   nombre: nombre del campo a modificar
      //   valor : valor a cambiar
      // }
      usuario = modificarCampos(usuario,data.cambios);
    }else{
      usuario.set(data);
      [err, usuario] = await to(usuario.save());
      if(err){
          if(err.message=='Validation error') err = 'The email address or phone number is already in use';
          return ReE(res, err);
      }
    }

    return ReS(res, {message :'Updated User: '+usuario.email});
}
module.exports.update = update;

const remove = async function(req, res){
    let usuario, err;
    usuario = req.user;

    [err, usuario] = await to(usuario.destroy());
    if(err) return ReE(res, 'error occured trying to delete usuario');

    return ReS(res, {message:'Deleted User'}, 204);
}
module.exports.remove = remove;

const login = async function(req, res){
    const body = req.body;
    let err, usuario;
    [err, usuario] = await to(authService.authUser(req.body));
    if(err) return ReE(res, err, 422);

    [err, usuario] = await to(decorar.usuario(usuario));
    if(err) return ReE(res, err, 422);

    return ReS(res, {token:usuario.getJWT(), usuario:usuario.toWeb()});
}
module.exports.login = login;

const token = async function(req, res){
    const body = req.body;
    let err, usuario;
    [err, usuario] = await to(authService.authUser(req.body));
    if(err) return ReE(res, err, 422);

    [err, usuario] = await to(decorar.usuario(usuario));
    if(err) return ReE(res, err, 422);

    return ReS(res, {token:usuario.getJWT()});
}
module.exports.token = token;

const cambiarEstado = async function(req, res){
    const body = req.body;
    let err, usuario =  req.user;
    // TODO: activar todo lo necesario como las notificaciones entre otros

    usuario = modificarCampos(usuario,{"nombre":"estado","valor":body.estado});
    console.log(usuario);
    return ReS(res, {estado:usuario.toWeb()["estado"]})
}
module.exports.cambiarEstado = cambiarEstado;

const modificarCampos = async function(usuario,fields){
  const campos = field.map((field)=>{
    usuario[field.nombre] = field.valor;
    return field.nombre;
  });
  [err,usuario] = await to(usuario.save({"fields": campos}));
  if(err) ReE(res, err, 422);

  return usuario;
}
