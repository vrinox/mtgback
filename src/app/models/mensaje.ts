import { Usuario } from './usuario';
export class Mensaje {
   id         : number;
   ChatId     : number;
   emisor     : Usuario;
   receptor   : Usuario;
   contenido  : string;
   createdAt  : Date;
   updatedAt  : Date;
   estado     : string;
   UID        : string;
   idEmisor   : number;
   idReceptor : number;
   msg        : {
     "img"       : string,
     "position"  : string,
     "content"   : string,
     "senderName": string,
     "time"      : string,
     "estado"    : string
   };

   constructor(values: Object = {}) {
     Object.assign(this, values);
     this.inicializar();
   }
   inicializar(){
     if(!this.UID){
       this.UID = this.generateUUID();
     }
     if(!this.estado){
       this.estado = 'P';
     }
     this.emisor = new Usuario(this.emisor);
     this.receptor = new Usuario(this.receptor);
     this.idEmisor = this.emisor.id;
     this.idReceptor = this.receptor.id;
   }
   getValues(){
     if(!this.emisor.getValues){
       this.emisor = new Usuario(this.emisor);
       this.receptor = new Usuario(this.receptor);
     }
     return {
       id         : this.id,
       ChatId     : this.ChatId,
       idReceptor : this.receptor.id,
       idEmisor   : this.emisor.id,
       contenido  : this.contenido,
       estado     : this.estado,
       createdAt  : this.createdAt,
       updatedAt  : this.updatedAt,
       emisor     : this.emisor.getValues(),
       receptor   : this.receptor.getValues()
     }
   }
   generarMsg(oponente:Usuario){
     let time:string = this.timeParse(this.createdAt);
     this.msg = {
       "img"       : "",
       "position"  : "",
       "content"   : this.contenido,
       "senderName": this.emisor.username,
       "time"      : time,
       "estado"    : this.estado
     }
     if(oponente.id == this.receptor.id){
       this.msg.position = "left";
       this.msg.img      = this.emisor.avatarImg;
     }else{
       this.msg.position= "right";
       this.msg.img     = this.emisor.imagesrc;
     }
     return this.msg;
   }
   timeParse(fecha:any):string{
     let now = new Date();
     fecha = new Date(fecha);
     if(now.getDate() == fecha.getDate()){
       fecha = fecha.toTimeString().split(':');
       fecha.pop();
       return fecha.join(':');
     }else{
       return fecha.toLocaleDateString();
     }
   }
   generateUUID() { // Public Domain/MIT
      var d = new Date().getTime();
      if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
          d += performance.now(); //use high-precision timer if available
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
  }
}
