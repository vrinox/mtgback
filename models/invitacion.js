'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Invitacion', {
    tipo        : DataTypes.STRING, //A: amigo, D: duelo
    vencimiento : DataTypes.DATE,
    idInvitado  : DataTypes.INTEGER,
    estado      : DataTypes.STRING//Pendiente, Aceptada, Rechazda
  });

  Model.associate = function(models){
    this.belongsTo(models.Usuario,{ foreignKey:"idInvitado",sourceKey:"id" });
    this.belongsTo(models.Notificacion);
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};
