import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { tap } from 'rxjs';

import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { LoadUser } from '../interfaces/load-user.interface';

import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { Inmueble } from '../models/inmuebles.model';


const base_url = environment.base_url;
declare const google: any;


@Injectable({
  providedIn: 'root'
})
export class UserService {

  public userEmail: string = '';
  public user!: Usuario;

  constructor(private http: HttpClient,
    private router: Router,
  ) { }

  logout(): void {
    localStorage.removeItem('authToken');

    const email = this.userEmail || JSON.parse(localStorage.getItem('user') || '{}')?.email;

    if (typeof google !== 'undefined') {

      if (!google.accounts?.id?.revoke) {
        google.accounts.id.initialize({
          client_id: '66577584602-s4map35f623bth9niu50darprs8uulp4.apps.googleusercontent.com',
          callback: () => { }
        });
      }

      google.accounts.id.disableAutoSelect();
      google.accounts.id.revoke(email, (response: any) => {
        this.router.navigateByUrl('/login');
      });

    } else {
      this.router.navigateByUrl('/login');
    }
  }


  validateToken(): Observable<boolean> {
    const token = localStorage.getItem('authToken') || '';

    return this.http.get(`${base_url}/login/refresh`, {
      headers: { 'x-token': token }
    }).pipe(
      map((resp: any) => {
        if (!resp || !resp.usuario || !resp.token) {
          console.error('validateToken: respuesta inválida', resp);
          return false;
        }

        const { email, google, nombre, role, img, uid } = resp.usuario;
        this.user = new Usuario(nombre, email, uid, undefined, img, google, role);

        localStorage.setItem('authToken', resp.token);
        return true;
      }),
      catchError(error => {
        console.error('validateToken: error en petición', error);
        return of(false);
      })
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

  getUsers(desde: number = 0): Observable<any> {
    const token = localStorage.getItem('authToken') || '';
    return this.http.get<LoadUser>(`${base_url}/usuarios?desde=${desde}`, {
      headers: { 'x-token': token }
    });
  }

  getUserById(id: string): Observable<any> {
    const token = localStorage.getItem('authToken') || '';
    return this.http.get(`${base_url}/usuarios/${id}`, {
      headers: { 'x-token': token }
    });
  }

  updateUser(id: string, data: Partial<Usuario>): Observable<any> {
    const token = localStorage.getItem('authToken') || '';
    return this.http.put(`${base_url}/usuarios/${id}`, data, {
      headers: { 'x-token': token }
    });
  }

  deleteUser(id: string): Observable<any> {
    const token = localStorage.getItem('authToken') || '';
    return this.http.delete(`${base_url}/usuarios/${id}`, {
      headers: { 'x-token': token }
    });
  }

  /* FAVORITOS */

  getFavoritos(): Observable<Inmueble[]> {
    const token = localStorage.getItem('authToken') || '';

    return this.http.get<{ ok: boolean; favoritos: Inmueble[] }>(
      `${base_url}/usuarios/favoritos`,
      {
        headers: { 'x-token': token }
      }
    ).pipe(map(res => res.favoritos));
  }


  addFavorito(inmuebleId: string): Observable<any> {
    const token = localStorage.getItem('authToken') || '';

    return this.http.post(`${base_url}/usuarios/favoritos/${inmuebleId}`, {}, {
      headers: { 'x-token': token }
    });
  }

  removeFavorito(inmuebleId: string): Observable<any> {
    const token = localStorage.getItem('authToken') || '';

    return this.http.delete(
      `${base_url}/usuarios/favoritos/${inmuebleId}`,
      {
        headers: { 'x-token': token }
      }
    );
  }

}
