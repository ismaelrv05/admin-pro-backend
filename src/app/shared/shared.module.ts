import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { InmuebleCardComponent } from './inmueble-card/inmueble-card.component';
import { NavbarComponent } from './header/navbar/navbar.component';
import { PortadaComponent } from './header/portada/portada.component';
import { BuscadorInmueblesComponent } from './header/buscador-inmuebles/buscador-inmuebles.component';
import { FormsModule } from '@angular/forms';
import { UltimasOportunidadesComponent } from './ultimas-oportunidades/ultimas-oportunidades.component';
import { MapaComponent } from './mapa/mapa.component';
import { ChatbotComponent } from './chatbot/chatbot.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    InmuebleCardComponent,
    NavbarComponent,
    PortadaComponent,
    BuscadorInmueblesComponent,
    UltimasOportunidadesComponent,
    MapaComponent,
    ChatbotComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    InmuebleCardComponent,
    BuscadorInmueblesComponent,
    UltimasOportunidadesComponent,
    MapaComponent,
    PortadaComponent,
    ChatbotComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ]
})
export class SharedModule { }
