'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Partida', {
    inicio  : DataTypes.DATE,
    fin     : DataTypes.DATE,
  });

  Model.associate = function(models){
    this.belongsTo(models.Duelo,{through:"duelo"});
    this.belongsTo(models.Usuario,{through:"ganador"});
    //tiene
    this.hasMany(models.DetallePartida);
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};