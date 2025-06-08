import { Component, OnInit } from '@angular/core';
import { Inmueble } from '../../../models/inmuebles.model';
import { ActivatedRoute } from '@angular/router';
import { InmuebleService } from '../../../services/inmueble.service';
import { Location } from '@angular/common';
import { ChatbotService } from '../../../services/chatbot.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  public inmueble?: Inmueble;
  public cargando: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private _inmuebleService: InmuebleService,
    private location: Location,
    private _chatbotService: ChatbotService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this._inmuebleService.getInmuebleById(id).subscribe({
        next: inmueble => {
          this.inmueble = inmueble;
          this.cargando = false;
        },
        error: err => {
          console.error('Error al cargar el inmueble:', err);
          this.cargando = false;
        }
      });
    }
  }

  volver(): void {
    this.location.back();
  }
}
