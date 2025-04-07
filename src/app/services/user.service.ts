import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { tap } from 'rxjs';

import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Router } from '@angular/router';

const base_url = environment.base_url;
declare const google: any;


@Injectable({
  providedIn: 'root'
})
export class UserService {

  public userEmail: string = '';

  constructor(private http: HttpClient,
    private router: Router,
    ) {}

  logout() {
    localStorage.removeItem('authToken');
    google.accounts.id.revoke(this.userEmail, (response: any) => {
      this.router.navigateByUrl('/login');
    });
  }

  validateToken(): Observable<boolean> {
    const token = localStorage.getItem('authToken') || '';

    return this.http.get(`${base_url}/login/refresh`, {
      headers: { 'x-token': token }
    }).pipe(
      tap((resp: any) => {
        if (resp && resp.token) {
          localStorage.setItem('authToken', resp.token);
        } else {
          console.error('Token not found in response');
        }
      }),
      map(resp => true),
      catchError(error => of(false))
    );
  }

  createUser(formaData: RegisterForm) {

    return this.http.post(`${base_url}/usuarios`, formaData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('authToken', resp.token)
        })
      )
  }

  login(formaData: LoginForm) {

    return this.http.post(`${base_url}/login`, formaData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('authToken', resp.token)
        })
      )

  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token })
      .pipe(
        tap((resp: any) => {
          console.log(resp)
          localStorage.setItem('authToken', resp.token)
        })
      )
  }
}
