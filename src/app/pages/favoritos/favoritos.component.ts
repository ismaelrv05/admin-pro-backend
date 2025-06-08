import { Component, OnInit } from '@angular/core';
import { Inmueble } from '../../models/inmuebles.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.scss'
})
export class FavoritosComponent implements OnInit {
  favoritos: Inmueble[] = [];

  constructor(private _userService: UserService) { }

  ngOnInit(): void {
    this._userService.getFavoritos().subscribe(inmb => {
      console.log('Favoritos recibidos:', inmb);
      this.favoritos = inmb;
    });
  }
}
