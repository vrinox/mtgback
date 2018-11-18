'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Formato', {
    nombre    : DataTypes.STRING,
    iconclass : DataTypes.STRING
  });

  Model.associate = function(models){
    this.hasMany(models.Mazo);
    this.hasMany(models.Liga);
    this.hasMany(models.Duelo);
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};
