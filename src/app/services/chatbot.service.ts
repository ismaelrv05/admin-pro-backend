import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  constructor(private http: HttpClient) { }

  enviarPregunta(
    pregunta: string,
    contextoInmueble?: { nombre: string; precio: number } | null,
    historial: { texto: string, esUsuario: boolean }[] = []
  ): Observable<{ respuesta: string }> {

    return this.http.post<{ respuesta: string }>(`${base_url}/chatbot`, { pregunta, contextoInmueble, historial });

  }

  private contextoInmueble?: { nombre: string; precio: number };

  setContextoInmueble(inmueble: { nombre: string; precio: number }) {
    this.contextoInmueble = inmueble;
  }

  getContextoInmueble(): { nombre: string; precio: number } | undefined {
    return this.contextoInmueble;
  }
}
