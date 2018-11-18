
'use strict';
const bcrypt 			= require('bcrypt');
const bcrypt_p 		= require('bcrypt-promise');
const jwt         = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Usuario', {
        telefono  : {type: DataTypes.STRING, allowNull: true, unique: true, validate: { len: {args: [7, 20], msg: "Phone number invalid, too short."}, isNumeric: { msg: "not a valid phone number."} }},
        username  : {type: DataTypes.STRING, allowNull: false, unique: true, validate: { len: {args: [3, 20], msg: "Nombre de usuario invalido."}}},
        nombre    : DataTypes.STRING,
        apellido  : DataTypes.STRING,
        email     : {type: DataTypes.STRING, allowNull: true, unique: true, validate: { isEmail: {msg: "Email Invalido."} }},
        clave     : DataTypes.STRING,
        win       : DataTypes.SMALLINT,
        lose      : DataTypes.SMALLINT,
        draw      : DataTypes.SMALLINT,
        imagesrc  : DataTypes.STRING,
        estado    : DataTypes.BOOLEAN,
        deviceId  : DataTypes.STRING
    });

    Model.associate = function(models){
        //tiene
        this.hasMany(models.Noticia);
        this.hasMany(models.Lista);
        this.hasMany(models.Amigo);
        this.hasMany(models.Mazo);
        this.hasMany(models.Notificacion)
        //pertenece
        this.belongsTo(models.Comunidad);
    };

    Model.beforeSave(async (user, options) => {
        let err;
        if (user.changed('clave')){
            let salt, hash
            [err, salt] = await to(bcrypt.genSalt(10));
            if(err) TE(err.message, true);

            [err, hash] = await to(bcrypt.hash(user.clave, salt));
            if(err) TE(err.message, true);

            user.clave = hash;
        }
    });

    Model.prototype.compararClave = async function (pw) {
        let err, pass
        if(!this.clave) TE('clave not set');

        [err, pass] = await to(bcrypt_p.compare(pw, this.clave));
        if(err) TE(err);

        if(!pass) TE('clave/usuario no coinsiden');

        return this;
    }

    Model.prototype.getJWT = function () {
        let expiration_time = parseInt(CONFIG.jwt_expiration);
        return "Bearer "+jwt.sign({user_id:this.id}, CONFIG.jwt_encryption, {expiresIn: expiration_time});
    };

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};
