import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    component: PagesComponent,
    canActivate: [ AuthGuard],
    children: [
      { path: '', component: HomePageComponent },

    ]

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
