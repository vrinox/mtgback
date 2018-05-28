'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Duelo', {
    tipo        : DataTypes.STRING,
    imagesrc    : DataTypes.STRING,
    vencimiento : DataTypes.DATE,
    idRetador   : DataTypes.INTEGER,
    idRetado    : DataTypes.INTEGER
  });

  Model.associate = function(models){
    this.belongsTo(models.Usuario,{ foreignKey:"idRetador",sourceKey:"id" });
    this.belongsTo(models.Usuario,{ foreignKey:"idRetado",sourceKey:"id" });
    this.belongsTo(models.Formato);
    //tiene
    this.hasMany(models.Partida);
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};
