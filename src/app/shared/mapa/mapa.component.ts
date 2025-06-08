import { AfterViewInit, Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.scss'
})
export class MapaComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() zoom: number = 14;
  @Input() markers: { lat: number, lng: number, popupText?: string }[] = [];


  map!: mapboxgl.Map;
  private currentMarkers: mapboxgl.Marker[] = [];


  ngOnInit(): void { }


  ngAfterViewInit(): void {
    const center: [number, number] = this.markers.length > 0
  ? [this.markers[0].lng, this.markers[0].lat]
  : [-3.7038, 40.4168];


    this.map = new mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      center,
      zoom: this.zoom,
      accessToken: environment.mapboxToken
    });

    this.addMarkers();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['markers'] && this.map) {
       console.log('Markers recibidos:', this.markers);
      this.updateMarkers();
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private addMarkers(): void {
    this.markers.forEach(({ lat, lng, popupText }) => {
      const marker = new mapboxgl.Marker()
        .setLngLat([lng, lat]);

      if (popupText) {
        marker.setPopup(new mapboxgl.Popup().setText(popupText));
      }

      marker.addTo(this.map);
      this.currentMarkers.push(marker);
    });
  }

  private updateMarkers(): void {
    this.currentMarkers.forEach(marker => marker.remove());
    this.currentMarkers = [];
    this.addMarkers();
  }
}
