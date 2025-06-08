import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, Router, RouterModule } from '@angular/router';

import { HomePageComponent } from './home-page/home-page.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { PagesRoutingModule } from './pages.routing';
import { UserListComponent } from './admin/user-list/user-list.component';
import { UserFormComponent } from './admin/user-form/user-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InmuebleComponent } from './inmuebles/inmuebles.component';
import { DetailsComponent } from './inmuebles/details/details.component';
import { FavoritosComponent } from './favoritos/favoritos.component';


@NgModule({
  declarations: [
    HomePageComponent,
    PagesComponent,
    UserListComponent,
    UserFormComponent,
    InmuebleComponent,
    DetailsComponent,
    FavoritosComponent,
  ],
  exports: [
    HomePageComponent,
    PagesComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    PagesRoutingModule,
    ReactiveFormsModule,
  ]
})
export class PagesModule { }
