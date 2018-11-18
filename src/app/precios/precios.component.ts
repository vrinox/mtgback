import { Component, OnInit } from '@angular/core';
import { MtgService } from '../services/mtg.service';
import { PriceService } from '../services/price.service';
import { Card } from '../models/card';
@Component({
  selector: 'app-precios',
  templateUrl: './precios.component.html',
  styleUrls: ['./precios.component.sass']
})
export class PreciosComponent implements OnInit {
  public nombre  : string = "hola";
  public cartas  : Card[];
  constructor(
    public mtg      : MtgService,
    public mtgPrice : PriceService
  ){

  }
  ngOnInit() {
  }
  
  buscar(){
    let filtros = {
      name: this.nombre
    }
    this.mtg
      .getAll(filtros)
      .subscribe((cartas:Card[])=>{
        this.cartas = cartas;
        Promise.all(this.cartas.map((carta:Card)=>{
          return this.buscarPrecio(carta);
        }))
        .then((cartas:Card[])=>{
          this.cartas = cartas.filter((carta:Card)=>{
            return carta !== null;
          });
        })
      })
  }
  buscarPrecio(carta:Card){
    return new Promise((resolve,reject)=>{
      console.log();
      if(!carta.multiverseid){
        resolve(null);
      }else{
        this.mtgPrice
        .getByMultiverseId(carta.multiverseid)
        .subscribe((resultado)=>{
          carta.priceGuide = {
            tix         : resultado.tix,
            eu          : resultado.eur,
            usd         : resultado.usd,
          };
          resolve(carta);
        }) 
      }
    })
  }

}
