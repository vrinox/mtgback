'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('DetalleMazo', {
    cantidad  : DataTypes.SMALLINT,
    idCarta   : DataTypes.STRING,
    tipo      : DataTypes.STRING //si esta esta en el side o en el main
  });

  Model.associate = function(models){
      this.belongsTo(models.Mazo);
      this.belongsTo(models.Carta,{foreignKey:"idCarta",sourceKey:"id"})
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};
