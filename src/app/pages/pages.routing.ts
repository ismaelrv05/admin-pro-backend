import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AuthGuard } from '../guards/auth.guard';
import { DetailsComponent } from './inmuebles/details/details.component';
import { FavoritosComponent } from './favoritos/favoritos.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomePageComponent },
      { path: 'inmueble/:id', component: DetailsComponent },
      { path: 'favoritos', component: FavoritosComponent },
    ]
  },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
