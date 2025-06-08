import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InmuebleService } from '../../services/inmueble.service';
import { Inmueble } from '../../models/inmuebles.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  public inmuebles: Inmueble[] = [];
  markers: { lat: number, lng: number, popupText?: string }[] = [];
  filtrosAplicados = false;
  cargando = false;
  public inmuebleSeleccionado: { nombre: string, precio: number } | null = null;


  filtros: any = {
    operacion: '',
    tipo: '',
    texto: '',
    obraNueva: false,
    referencia: ''
  };

  constructor(
    private _userService: UserService,
    private inmuebleService: InmuebleService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length > 0) {
        this.filtros = {
          operacion: params['operacion'] || '',
          tipo: params['tipo'] || '',
          texto: params['texto'] || '',
          obraNueva: params['obraNueva'] === 'true',
          referencia: params['referencia'] || ''
        };
        this.filtrosAplicados = true;
        this.aplicarFiltros(this.filtros, false);
      }

      this.inmuebleService.getInmuebles().subscribe((inmuebles: Inmueble[]) => {
        this.markers = inmuebles
          .filter(inmueble => inmueble.coordenadas?.coordinates?.length === 2)
          .map(inmueble => ({
            lat: inmueble.coordenadas!.coordinates[1],
            lng: inmueble.coordenadas!.coordinates[0],
            popupText: inmueble.nombre
          }));
      });
    });
  }

  aplicarFiltros(filtro: any, actualizarUrl: boolean = true): void {
    this.cargando = true;
    this.filtros = filtro;
    this.filtrosAplicados = true;

    if (actualizarUrl) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          operacion: filtro.operacion || null,
          tipo: filtro.tipo || null,
          texto: filtro.texto || null,
          obraNueva: filtro.obraNueva || null,
          referencia: filtro.referencia || null
        },
        queryParamsHandling: 'merge'
      });
    }

    this.inmuebleService.getInmuebles().subscribe((inmuebles: Inmueble[]) => {
      console.log('Inmuebles desde el backend:', inmuebles);
      this.inmuebles = inmuebles.filter(inmueble => {
        const coincideDisponibilidad = filtro.operacion ? inmueble.disponibilidad === filtro.operacion : true;
        const coincideTipo = filtro.tipo ? inmueble.tipo === filtro.tipo : true;
        const coincideTexto = filtro.texto
          ? inmueble.ubicacion.toLowerCase().includes(filtro.texto.toLowerCase())
          : true;
        const coincideObraNueva = filtro.obraNueva ? inmueble.obraNueva === true : true;
        const coincideReferencia = filtro.referencia
          ? inmueble._id?.includes(filtro.texto)
          : true;

        return (
          coincideDisponibilidad &&
          coincideTipo &&
          coincideTexto &&
          coincideObraNueva &&
          coincideReferencia
        );
      });

      this.markers = this.inmuebles
        .filter(inmueble => inmueble.coordenadas?.coordinates?.length === 2)
        .map(inmueble => ({
          lat: inmueble.coordenadas!.coordinates[1],
          lng: inmueble.coordenadas!.coordinates[0],
          popupText: inmueble.nombre
        }));
      this.cargando = false;
    });

  }

  infoInmueble(inmueble: { nombre: string, precio: number }) {
  this.inmuebleSeleccionado = inmueble;
}

}
