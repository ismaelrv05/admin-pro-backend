import { Component, OnInit } from '@angular/core';
import { Inmueble } from '../../models/inmuebles.model';
import { InmuebleService } from '../../services/inmueble.service';

@Component({
  selector: 'app-ultimas-oportunidades',
  templateUrl: './ultimas-oportunidades.component.html',
  styleUrl: './ultimas-oportunidades.component.scss'
})
export class UltimasOportunidadesComponent implements OnInit {

  inmuebles: Inmueble[] = [];
  currentPage: number = 0;
  pageSize: number = 4;

  constructor(private inmuebleService: InmuebleService) {}

  ngOnInit(): void {
    this.inmuebleService.getInmueblesRecientes().subscribe(inmuebles => {
      this.inmuebles = inmuebles;
    });
  }

  get paginatedInmuebles(): Inmueble[] {
    const start = this.currentPage * this.pageSize;
    return this.inmuebles.slice(start, start + this.pageSize);
  }

  nextPage(): void {
    if ((this.currentPage + 1) * this.pageSize < this.inmuebles.length) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }
}
