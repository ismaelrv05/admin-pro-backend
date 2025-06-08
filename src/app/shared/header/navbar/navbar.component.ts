import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  public imgUrl = ''
  userName: string = '';
  userRole: string = '';

  constructor(
    private _userService: UserService,
    private _router: Router
  ) {
    const user = this._userService.user;
    this.imgUrl = _userService.user.imageUrl;
    this.userName = user.nombre;
    this.userRole = user.role || '';
  }

  gestionarUsuarios(): void {
    this._router.navigate(['/admin/usuarios']);
  }

  logout(): void {
    this._userService.logout();
  }

}
