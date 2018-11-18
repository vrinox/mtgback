import { Mensaje } from './mensaje';
import { Usuario } from './usuario';
export class Chat {
   id       : number;
   tipo     : string;
   usuario1 : Usuario;
   usuario2 : Usuario;
   oponente : Usuario;
   mensajes : Mensaje[];
   createdAt: Date;
   updatedAt: Date;
   sinLeer  : number;

   constructor(values: Object = {}) {
      Object.assign(this, values);
      this.usuario1 = new Usuario(this.usuario1);
      this.usuario2 = new Usuario(this.usuario2);
      this.sinLeer  = this.sinLeer || null;
      if(!this.mensajes){
        this.mensajes = [];
      }else{
        this.mensajes = this.mensajes.map((mensaje)=>{return new Mensaje(mensaje)});
      }
   }

   incrementarSinLeer(){
     if(this.sinLeer == null){
       this.sinLeer = 1;
     }else{
       this.sinLeer++;
     }
   }
   reducirSinLeer(){
     this.sinLeer = null;
   }
   detectarOponente(usuario:Usuario){
     if(this.usuario1.id == usuario.id){
       this.oponente = this.usuario2;
     }else if(this.usuario2.id == usuario.id){
       this.oponente = this.usuario1;
     }else{
       console.log('CHAT: '+this.id+'ninguno de ambos');
       return
     }
     this.mensajes= this.mensajes.map((mensaje)=>{
       if(mensaje.emisor.id == this.oponente.id){
         mensaje.receptor = usuario;
       }else{
         mensaje.emisor = usuario;
       }
       mensaje.generarMsg(this.oponente);
       return mensaje;
     });
   }
   getValues(){
     let self = {
       id         : this.id,
       createdAt  : this.createdAt,
       updatedAt  : this.updatedAt,
       tipo       : this.tipo,
       idUsuario1 : this.usuario1.id,
       idUsuario2 : this.usuario2.id,
       usuario1   : this.usuario1.getValues(),
       usuario2   : this.usuario2.getValues(),
       sinLeer    : this.sinLeer
     }
    Object.keys(self).forEach((propiedad)=>{
      if(!self[propiedad]){
        delete self[propiedad];
      }
    });
    return self;
   }
   addMsg(mensaje:Mensaje){
    mensaje.generarMsg(this.oponente);
    if(!this.find(mensaje)){
      this.mensajes.push(mensaje);
    }
   }
   actualizarMensaje(newMsg:Mensaje){
     this.mensajes = this.mensajes.map((oldMsg:Mensaje)=>{
       let validado = false;
       if(!oldMsg.id){
         if(newMsg.UID == oldMsg.UID){validado = true;}
       }else if(newMsg.id == oldMsg.id){validado = true;}
       if(validado){
         newMsg.generarMsg(this.oponente);
         return newMsg;
       }else{
         return oldMsg;
       }
     })
   }
   find(oldMsg){
     return this.mensajes.find((newMsg)=>{
       if(!oldMsg.id){
         return (newMsg.UID == oldMsg.UID)
       }else{
         return (newMsg.id == oldMsg.id)
       }
     })
   }
}
