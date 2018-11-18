'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('DetallePartida', {
    vidas : DataTypes.SMALLINT
  });

  Model.associate = function(models){
    this.belongsTo(models.Partida);
    this.belongsTo(models.Usuario);
    this.belongsTo(models.Mazo);
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};
