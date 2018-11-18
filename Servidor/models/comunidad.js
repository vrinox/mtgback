'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Comunidad', {
    nombre   : DataTypes.STRING,
    imagesrc : DataTypes.STRING
  });

  Model.associate = function(models){
    this.hasMany(models.Usuario);
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};
