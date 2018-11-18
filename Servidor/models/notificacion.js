'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Notificacion', {
    titulo    : DataTypes.STRING,
    contenido : DataTypes.STRING,
    estado    : DataTypes.STRING //pendiente, leido
  });

  Model.associate = function(models){
    this.belongsTo(models.Usuario);
    this.hasMany(models.Invitacion);
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};
