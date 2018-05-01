'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('DetalleLista', {
    cantidad  : DataTypes.SMALLINT,
    idCarta   : DataTypes.STRING
  });

  Model.associate = function(models){
      this.belongsTo(models.Lista);
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};
