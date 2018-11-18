export class Card {
  id            : string;
  name          : string;
  manaCost      : string;
  cmc           : number;
  colors        : string[];
  colorIdentity : string[];
  type          : string;
  types         : string[];
  subtypes      : string[];
  rarity        : string;
  set           : string;
  setName       : string;
  text          : string;
  flavor        : string;
  artist        : string;
  number        : string;
  power         : string;
  toughness     : string;
  layout        : string;
  releaseDate   : string;
  rulings       : string[];
  imageUrl      : string;
  multiverseid  : number;
  foreignNames  : {name:string,language:string}[];
  printings     : string[];
  legalities    : {format:string,legality:string}[];
  source        : string;
  userMetadata  : {id:number,cantidad:number,costos:string[],rareza:string,idCarta:string,tipo:string};
  priceGuide    : {tix : number,eu  : number,usd  : number}
  constructor(values: Object = {}) {
    Object.assign(this, values);
    if(!this.userMetadata){
      this.userMetadata = {
        id:null,
        cantidad:1,
        idCarta:null,
        rareza:null,
        costos:[],
        //en caso de pertenecer a un mazo
        tipo:null
      };
    }
    if(!this.priceGuide){
      this.priceGuide = {
        eu:0,
        usd:0,
        tix:0
      }
    }
    this.convertir();
  }
  getValues(){
    return {
      id            : this.id            ,
      name          : this.name          ,
      manaCost      : this.manaCost      ,
      imageUrl      : this.imageUrl      ,
      cmc           : this.cmc           ,
      colors        : this.colors        ,
      colorIdentity : this.colorIdentity ,
      type          : this.type          ,
      types         : this.types         ,
      subtypes      : this.subtypes      ,
      rarity        : this.rarity        ,
      set           : this.set           ,
      setName       : this.setName       ,
      text          : this.text          ,
      flavor        : this.flavor        ,
      artist        : this.artist        ,
      number        : this.number        ,
      power         : this.power         ,
      toughness     : this.toughness     ,
      layout        : this.layout        ,
      releaseDate   : this.releaseDate   ,
      rulings       : this.rulings       ,
      foreignNames  : this.foreignNames  ,
      printings     : this.printings     ,
      legalities    : this.legalities    ,
      source        : this.source        ,
      userMetadata  : this.userMetadata  ,
    }
  }
  convertir(){
    if(this.manaCost){
      let length = this.manaCost.length;
      let indice = 0;
      this.userMetadata.costos = this.manaCost
        .toLowerCase()
        .split("")
        .map(caracter=>{
          indice++;
          let newChar;
          if(caracter=="}"){newChar ="-"}
          else if(caracter=="{"){newChar = "*"}
          else{newChar = caracter;}
          if(indice == length){newChar = "*";}
          return newChar;
        })
        .filter(caracter=>{return caracter != "*"})
        .join("")
        .split('-')
        .map(costo=>{
          if(costo.length==3){
            costo = costo.replace('/','')
            costo+=(!costo.toLowerCase().includes("p"))?" ms-split":"";
          }
          return costo;
        })

    }
    this.userMetadata.rareza = this.rarity.split(" ")[0].toLowerCase();
    this.userMetadata.idCarta = this.id;
  }
}
