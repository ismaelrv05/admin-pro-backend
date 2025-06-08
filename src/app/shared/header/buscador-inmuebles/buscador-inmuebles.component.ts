import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { TipoInmueble } from '../../../enums/type-inmueble.enum';

@Component({
  selector: 'app-buscador-inmuebles',
  templateUrl: './buscador-inmuebles.component.html',
  styleUrls: ['./buscador-inmuebles.component.scss']
})
export class BuscadorInmueblesComponent implements OnInit {

  @Input() filtro: any = {
    operacion: '',
    tipo: '',
    texto: '',
    obraNueva: false,
    referencia: ''
  };

  @Output() buscar = new EventEmitter<any>();

  tipos = Object.values(TipoInmueble);
  operaciones = ['compra', 'alquiler'];

  ngOnInit(): void {}

  onBuscar() {
    this.buscar.emit(this.filtro);
  }
}
