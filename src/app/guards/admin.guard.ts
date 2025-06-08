import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(): boolean {
    if (this.userService.user.role === 'ADMIN_ROLE') {
      return true;
    }

    // Opcional: redirige a otra página
    this.router.navigateByUrl('/');
    return false;
  }
}
