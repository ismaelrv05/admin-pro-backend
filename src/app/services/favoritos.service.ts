import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Inmueble } from '../models/inmuebles.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {

  private favoritosSubject = new BehaviorSubject<Inmueble[]>([]);
  favoritos$ = this.favoritosSubject.asObservable();
  private cargado = false;

  constructor(private _userService: UserService) { }

  cargarFavoritos(): void {
    if (this.cargado) return;

    this._userService.getFavoritos().subscribe({
      next: favoritos => {
        this.favoritosSubject.next(favoritos);
        this.cargado = true;
      }
    });
  }

  estaEnFavoritos(id: string): boolean {
    return this.favoritosSubject.getValue().some(fav => fav._id === id);
  }

  addFavorito(inmueble: Inmueble): void {
    this._userService.addFavorito(inmueble._id!).subscribe(() => {
      const lista = [...this.favoritosSubject.getValue(), inmueble];
      this.favoritosSubject.next(lista);
    });
  }

  removeFavorito(id: string): void {
    this._userService.removeFavorito(id).subscribe(() => {
      const lista = this.favoritosSubject.getValue().filter(f => f._id !== id);
      this.favoritosSubject.next(lista);
    });
  }
}
