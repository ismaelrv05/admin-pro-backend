import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { NoFoundPageComponent } from './no-found-page/no-found-page.component';

const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'home',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule)
  },

  { path: '**', component: NoFoundPageComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
