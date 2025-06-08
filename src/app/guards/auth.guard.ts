import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserService } from '../services/user.service';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private userService: UserService,
    private router: Router) { }

    canActivate(): Observable<boolean> {
      return this.userService.validateToken().pipe(
        tap(isAuthenticated => {
          console.log('isAuthenticated:', isAuthenticated);
          if (!isAuthenticated) {
            this.router.navigateByUrl('/login');
          }
        })
      );
    }

}
