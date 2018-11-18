import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreciosComponent } from './precios/precios.component';
import { JugadoresComponent } from './jugadores/jugadores.component';
import { DecksComponent } from './decks/decks.component';
import { ListasComponent } from './listas/listas.component';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {  
  MatButtonModule, 
  MatToolbarModule, 
  MatGridListModule, 
  MatInputModule, 
  MatIconModule,
  MatListModule,
  MatCardModule,
} from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,
    PreciosComponent,
    JugadoresComponent,
    DecksComponent,
    ListasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    //angular material
    MatToolbarModule,
    MatGridListModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    //angular material
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
