'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Notificacion', {
    titulo    : DataTypes.STRING,
    contenido : DataTypes.STRING
  });

  Model.associate = function(models){
    this.belongsTo(models.TipoNotificacion);
    this.hasMany(models.DetalleNotificacion);
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};
