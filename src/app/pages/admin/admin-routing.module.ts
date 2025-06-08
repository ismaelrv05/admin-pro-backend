import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { AdminGuard } from '../../guards/admin.guard';

const routes: Routes = [
  { path: 'usuarios', component: UserListComponent, canActivate: [AdminGuard] },
  { path: 'usuarios/new', component: UserFormComponent, canActivate: [AdminGuard] },
  { path: 'usuarios/edit/:id', component: UserFormComponent, canActivate: [AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
