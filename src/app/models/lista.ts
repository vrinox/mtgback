import { Card } from './card';
export class Lista  {
     id     :number;
     tipo   :string;
     length :number;
     cartas :Card[];
   constructor(values: Object = {}) {
        Object.assign(this, values);
        this.inicializar();        
   }
   inicializar(){
     if(this.cartas){
      this.cartas = this.cartas.map((carta:any)=>{
        return new Card(carta);
      }); 
     }else{
       this.cartas = [];
     }
     this.length = 0;
     this.organizar();
   }
   getValues(){
     return {
       id   : this.id,
       tipo : this.tipo
     }
   }
   getDetalle(){
     let detalle:any = this.getValues();
     detalle.cartas = this.cartas.map((carta:Card)=>{
       return carta.getValues();
     });
     return detalle;
   }
   agregar(carta:Card){
      this.cartas.push(new Card(carta));
      this.organizar();
   }
   validar(carta:Card){
     let validado = true;
     if(this.cartas.find(oldCard=>{ return oldCard.id == carta.id})){
       validado = false;
     }
     return validado;
   }
   actualizarCarta(carta:Card){
     this.cartas = this.cartas.map((oldCard)=>{
       if(oldCard.id == carta.id){
         return carta;
       }else{
         return oldCard;
       }
     });
     this.organizar();
   }
   removerCarta(carta:Card){
     this.cartas = this.cartas.filter((oldCard)=>{
       return oldCard.userMetadata.id != carta.userMetadata.id;
     });
     this.organizar();
   }
   organizar(){
     this.cartas.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
    })
   }
}
