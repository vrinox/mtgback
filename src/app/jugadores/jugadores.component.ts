import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
//service
import { MhapiService } from '../services/mhapi.service';
//models
import { Usuario } from '../models/usuario';

@Component({
  selector: 'app-jugadores',
  templateUrl: './jugadores.component.html',
  styleUrls: ['./jugadores.component.sass']
})
export class JugadoresComponent implements OnInit {
  searchTerm$ = new Subject<string>();
  searchForm  : FormGroup;
  usuarios    : Usuario[];
  detalle     : Usuario = new Usuario();
  constructor(
    public magicHub   : MhapiService,
    public formBuilder: FormBuilder,
  ) { 
    this.searchForm = formBuilder.group({
      nombre: ['']
    });
  }

  ngOnInit() {
    this.buscar();
  }
  buscar(){
    this.magicHub.buscarUsuario(this.searchTerm$)
      .subscribe((usuarios:Usuario[])=>{
        this.usuarios = usuarios;
      });
      this.searchTerm$.next("");
      this.searchForm.controls['nombre'].valueChanges.subscribe(value=>{
      this.searchTerm$.next(value);
    })
  }
  detalleUsuario(usuario:Usuario){
    this.magicHub.buscarDetalleUsuario(usuario)
      .subscribe((usuario:Usuario)=>{
        console.log(usuario);
        this.detalle = usuario;
      })
  }
}
