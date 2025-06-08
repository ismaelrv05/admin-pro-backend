import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InmuebleService } from '../../services/inmueble.service';
import { Inmueble } from '../../models/inmuebles.model';



@Component({
  selector: 'app-inmueble',
  templateUrl: './inmuebles.component.html',
  styleUrls: ['./inmuebles.component.scss']
})
export class InmuebleComponent implements OnInit {

  public inmuebles: Inmueble[] = [];
  public cargando: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private _inmuebleService: InmuebleService
  ) { }

  ngOnInit(): void {
    this.cargarInmuebles();
  }

  cargarInmuebles() {
    this.cargando = true;

    this._inmuebleService.getInmuebles()
      .subscribe(inmuebles => {
        this.cargando = false;
        this.inmuebles = inmuebles;
      })
  }
}
