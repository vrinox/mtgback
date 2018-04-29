const Usuario 			= require('./../models').Usuario;
const validator     = require('validator');

const getUniqueKeyFromBody = function(body){// this is so they can send in 3 options unique_key, email, or phone and it will work
    let unique_key = body.unique_key;;
    if(typeof unique_key==='undefined'){
        if(typeof body.email != 'undefined'){
            unique_key = body.email
        }else if(typeof body.email != 'undefined'){
          unique_key = body.username;
        }else if(typeof body.username != 'undefined'){
          unique_key = body.telefono;
        }else{
            unique_key = null;
        }
    }
    return unique_key;
}
module.exports.getUniqueKeyFromBody = getUniqueKeyFromBody;

const createUser = async function(userInfo){
    let unique_key, auth_info, err;

    auth_info={}
    auth_info.status='create';
    unique_key = getUniqueKeyFromBody(userInfo);
    if(!unique_key) TE('No se ha ingresado un email o nombre de usuario');
    if(validator.isEmail(unique_key)){
        auth_info.method = 'email';
        userInfo.email = unique_key;

        [err, user] = await to(Usuario.create(userInfo));
        if(err){
          console.log(err);
          TE('ya existe un usuario con este correo');
        }

        return user;

    }else{
        TE('No se ha ingresado un email valido');
    }
}
module.exports.createUser = createUser;

const authUser = async function(userInfo){//returns token
    let unique_key;
    let auth_info = {};
    auth_info.status = 'login';
    unique_key = getUniqueKeyFromBody(userInfo);

    if(!unique_key) TE('Por favor ingrese su nombre de usuario o email para accesar');


    if(!userInfo.clave) TE('Por favor ingrese su clave para accesar');

    let usuario;
    if(validator.isEmail(unique_key)){
        auth_info.method='email';

        [err, usuario] = await to(Usuario.findOne({where:{email:unique_key}}));
        console.log(err, usuario, unique_key);
        if(err) TE(err.message);

    }else if(validator.isMobilePhone(unique_key, 'any')){//checks if only phone number was sent
        auth_info.method='phone';

        [err, usuario] = await to(Usuario.findOne({where:{telefono:unique_key }}));
        if(err) TE(err.message);

    }else{
        auth_info.method='username';
        [err, usuario] = await to(Usuario.findOne({where:{username:unique_key }}));
        if(err) TE(err.message);
    }
    if(!usuario) TE('No existe usuario con ese nombre');

    [err, usuario] = await to(usuario.compararClave(userInfo.clave));

    if(err) TE(err.message);

    return usuario;

}
module.exports.authUser = authUser;

const verificar = async function(userInfo){
  let err, usuario;
  let respuesta = { message:"", success:0 };
  [err,usuario] = await to(Usuario.findOne({where:{"username":userInfo.username}}));
  if(err) TE(err.message);

  if(usuario){
    respuesta.message = "nombre de usuario ya existe";
    respuesta.success = 0;
  }else{
    [err,usuario] = await to(Usuario.findOne({where:{"email":userInfo.email}}));
    if(err) TE(err.message);
    if(usuario){
      respuesta.message = "email ya esta en uso";
      respuesta.success = 0;
    }else{
      [err,usuario] = await to(Usuario.findOne({where:{"telefono":userInfo.telefono}}));
      if(err) TE(err.message);
      if(usuario){
        respuesta.message = "numero de telefono ya esta en uso";
        respuesta.success = 0;
      }else{
          respuesta.success = 1;
      }
    }
  }
  return respuesta;
}
module.exports.verificar = verificar;
