'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('DetalleNotificacion', {
    vencimiento : DataTypes.DATE,
  });

  Model.associate = function(models){
    this.belongsTo(models.Notificacion);
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};
