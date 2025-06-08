import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Inmueble } from '../models/inmuebles.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class InmuebleService {

  constructor(private http: HttpClient) {}

getInmuebleById(id: string): Observable<Inmueble> {
  return this.http
    .get<{ ok: boolean, inmueble: Inmueble }>(`${base_url}/inmuebles/${id}`)
    .pipe(
      map(resp => resp.inmueble)
    );
}

  getInmuebles(): Observable<any> {
    return this.http.get<{ ok: boolean, inmuebles: Inmueble[] }>(`${base_url}/inmuebles`).pipe(
      map(resp => resp.inmuebles)
    );
  }

  getInmueblesRecientes(): Observable<Inmueble[]> {
    return this.http.get<{ ok: boolean, inmuebles: Inmueble[] }>(`${base_url}/inmuebles/recientes`)
      .pipe(map(resp => resp.inmuebles));
  }

  crearInmueble(data: any): Observable<any> {
    return this.http.post(`${base_url}/inmuebles`, data);
  }

  actualizarInmueble(id: string, data: any): Observable<any> {
    return this.http.put(`${base_url}/inmuebles/${id}`, data);
  }

  eliminarInmueble(id: string): Observable<any> {
    return this.http.delete(`${base_url}/inmuebles/${id}`);
  }
}
