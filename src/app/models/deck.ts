import { Card } from './card';
import { Formato } from './formato';
export class Deck  {
     id         : number;
     nombre     : string;
     manaCost   : string;
     FormatoId  : number;
     colores    : string[];
     Formato    : Formato;
     main       :Card[];
     side       :Card[];
     superTypes :{}[];
     sideLength :number;
     mainLength :number;
   constructor(values: Object = {}) {
        Object.assign(this, values);
        this.inicializar();
   }
   inicializar(){
     this.Formato = new Formato(this.Formato);
     this.colores = (this.manaCost)?this.manaCost.toLowerCase().split(""):[];
     this.superTypes=[];
     if(!this.main){
       this.main=[];
     }else{
       this.main = this.main.map((carta:any)=>{
         return new Card(carta);
       });
     }
     if(!this.side){
       this.side=[];
     }else{
       this.side = this.side.map((carta:any)=>{
         return new Card(carta);
       });

     }
     this.sideLength = this.mainLength = 0;
     this.organizar();
     this.buscarColores();
   }
   getValues(){
     return {
       id       : this.id,
       nombre   : this.nombre,
       manaCost : this.manaCost,
       FormatoId: this.FormatoId
     }
   }
   getDetalle(){
     let detalle:any = this.getValues();
     detalle.Formato = this.Formato.getValues();
     detalle.main = this.main.map((carta:Card)=>{
       return carta.getValues();
     });
     detalle.side = this.side.map((carta:Card)=>{
       return carta.getValues();
     });
     return detalle;
   }
   buscarColores(){
     let seen = {};
     let colores = [];
     this.main.concat(this.side).map(carta=>{
       if(!carta.colorIdentity) carta.colorIdentity=[];
       carta.colorIdentity.map(color=>{
         colores.push(color)
       })
     });
     colores = colores.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
    this.manaCost = colores.join("").toLowerCase();
   }
   agregar(carta:Card){
     if(carta.userMetadata.tipo=="main"){
       this.main.push(carta);
       this.organizar();
     }else if(carta.userMetadata.tipo=="side"){
       this.side.push(carta);
       this.side.forEach(carta => this.sideLength += carta.userMetadata.cantidad );
     }
   }
   actualizarCarta(carta:Card){
     this[carta.userMetadata.tipo] = this[carta.userMetadata.tipo].map((oldCard)=>{
       if(oldCard.id == carta.id){
         return carta;
       }else{
         return oldCard;
       }
     });
     this.organizar();
   }
   removerCarta(carta:Card){
     this[carta.userMetadata.tipo] = this[carta.userMetadata.tipo].filter((oldCard)=>{
       return oldCard.userMetadata.id != carta.userMetadata.id;
     });
     this.organizar();
   }
   organizar(){
     this.sideLength = this.mainLength = 0;
     let main =this.main;
     this.superTypes=main.map(carta => {
       let type;
       if(carta.types.length>1){
         type = carta.types.find(type =>{ return type.toLowerCase() == "creature" });
         if(type){
           return "Creature";
         }
       }
       return carta.types[0];
     }).filter((item, pos, self) => {
       return self.indexOf(item) == pos;
     }).map(superType =>{
       let element={
         nombre   : superType.toLowerCase(),
         cantidad : 0,
         cartas   : []
       };
       element.cartas = main.filter(carta =>{
         let type;
         if(carta.types.length >1){
           type = carta.types.find(type =>{ return type.toLowerCase() == "creature" });
         }
         if(!type) type=carta.types[0];
         if(type.toLowerCase() === element.nombre.toLowerCase()){
           element.cantidad += carta.userMetadata.cantidad;
           this.mainLength += carta.userMetadata.cantidad;
           return carta;
         }
       });
       return element;
     }).sort();
     this.side.forEach(carta => this.sideLength += carta.userMetadata.cantidad );
   }
   validar(tipo:string,newCard:Card){
     let validado = true;
     if(this.hasOwnProperty(tipo)){
       if(this[tipo].find(oldCard=>{ return oldCard.id == newCard.id})){
         validado = false;
       }
       return validado;
     }else{
       console.error("el tipo "+tipo+" no esta permitido")
       return false;
     }
   }
}
