'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Mazo', {
    nombre  : DataTypes.STRING,
    manaCost: DataTypes.STRING
  });

  Model.associate = function(models){
      this.belongsTo(models.Formato);
      this.belongsTo(models.Usuario);
      this.hasMany(models.DetalleMazo);
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};
