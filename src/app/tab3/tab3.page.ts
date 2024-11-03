import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {

  map: google.maps.Map | undefined;

  constructor(private storage: StorageService) { }

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    if (typeof google === 'undefined') {
      console.error('Google Maps API no está cargada.');
      return;
    }

    // Aquí se configura lo que muestra el Mapa
    const mapOptions: google.maps.MapOptions = {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      fullscreenControl: false,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER
      }
    };

    const mapElement = document.getElementById('map');

    if (mapElement) {
      this.map = new google.maps.Map(mapElement, mapOptions);

      // GEOlocalización
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );
            this.map!.setCenter(userLocation);
            new google.maps.Marker({
              position: userLocation,
              map: this.map,
              title: 'Tu Ubicación',
            });
          },
          (error) => {
            console.error('Error obteniendo la ubicación:', error);
          }
        );
      } else {
        console.error('La geolocalización no está soportada por este navegador.');
      }
    } else {
      console.error('No se encontró el elemento del mapa en el DOM.');
    }
  }
}