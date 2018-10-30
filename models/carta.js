'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Carta', {
    id            : {type:DataTypes.STRING,primaryKey:true},
    name          : DataTypes.STRING,
    cmc           : DataTypes.SMALLINT,
    rarity        : DataTypes.STRING,
    colorIdentity : DataTypes.STRING,
    type          : DataTypes.STRING,
    types         : DataTypes.STRING,
    subtypes      : DataTypes.STRING,
    set           : DataTypes.STRING,
    setName       : DataTypes.STRING,
    text          : DataTypes.STRING(512),
    flavor        : DataTypes.STRING(512),
    power         : DataTypes.STRING,
    toughness     : DataTypes.STRING,
    manaCost      : DataTypes.STRING,
    imageUrl      : DataTypes.STRING,
    multiverseid  : DataTypes.INTEGER
  });

  Model.associate = function(models){
    this.hasMany(models.DetalleMazo);
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};
