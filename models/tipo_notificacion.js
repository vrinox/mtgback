'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('TipoNotificacion', {
    nombre : DataTypes.STRING,
  });

  Model.associate = function(models){
    this.hasMany(models.Notificacion);
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};
