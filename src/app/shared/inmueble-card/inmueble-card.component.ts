import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Inmueble } from '../../models/inmuebles.model';
import { UserService } from '../../services/user.service';
import { FavoritosService } from '../../services/favoritos.service';

@Component({
  selector: 'app-inmueble-card',
  templateUrl: './inmueble-card.component.html',
  styleUrl: './inmueble-card.component.scss'
})
export class InmuebleCardComponent implements OnInit {
  @Output() verDetalle = new EventEmitter<{ nombre: string, precio: number }>();
  @Input() inmueble!: Inmueble;

  public esFavorito: boolean = false;

  constructor(private _favoritoService: FavoritosService) { }

  ngOnInit(): void {
    this._favoritoService.cargarFavoritos();
    this.esFavorito = this._favoritoService.estaEnFavoritos(this.inmueble._id!);

    this._favoritoService.favoritos$.subscribe(favoritos => {
      this.esFavorito = favoritos.some(f => f._id === this.inmueble._id);
    });
  }

  get imagenUrl(): string {
    const img = this.inmueble?.img?.trim();
    return img ? img : '/assets/images/no-image-inmueble.png';
  }

  inmbFavorito(): void {
    if (!this.inmueble?._id) return;

    if (this.esFavorito) {
      this._favoritoService.removeFavorito(this.inmueble._id);
    } else {
      this._favoritoService.addFavorito(this.inmueble);
    }
  }

  emitirSeleccion() {
  this.verDetalle.emit({
    nombre: this.inmueble.nombre,
    precio: this.inmueble.precio
  });
}

}
