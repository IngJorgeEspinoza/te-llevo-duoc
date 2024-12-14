import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { StorageService } from '../service/storage.service';
import { AlertController, LoadingController } from '@ionic/angular';

interface Viaje {
  id: string;
  origen: string;
  destino: string;
  conductorNombre: string;
  conductorEmail: string;
  costo: number;
  asientosDisponibles: number;
  estado: string;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  viajes: Viaje[] = [];
  isLoading = false;
  userEmail: string;

  constructor(
    private apiService: ApiService,
    private storage: StorageService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    this.userEmail = this.storage.get('email') || '';
  }

  ngOnInit() {
    this.cargarViajes();
  }

  async cargarViajes() {
    this.isLoading = true;
    const loading = await this.loadingCtrl.create({
      message: 'Cargando viajes...',
    });
    await loading.present();

    try {
      const response = await this.apiService.obtenerViajes();
      this.viajes = response.filter((viaje: Viaje) =>
        viaje.estado === 'PUBLICADO' &&
        viaje.conductorEmail !== this.userEmail
      );
    } catch (error) {
      console.error('Error al cargar viajes:', error);
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'No se pudieron cargar los viajes',
        buttons: ['OK'],
      });
      await alert.present();
    } finally {
      loading.dismiss();
      this.isLoading = false;
    }
  }

  async tomarViaje(viaje: Viaje) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar viaje',
      message: `¿Deseas tomar este viaje a ${viaje.destino} por $${viaje.costo}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: () => this.confirmarViaje(viaje),
        },
      ],
    });
    await alert.present();
  }

  private async confirmarViaje(viaje: Viaje) {
    const loading = await this.loadingCtrl.create({
      message: 'Confirmando viaje...',
    });
    await loading.present();

    try {
      await this.apiService.actualizarEstadoViaje(viaje.id, 2); // Estado 2 = EN_CURSO

      const alert = await this.alertCtrl.create({
        header: 'Éxito',
        message: 'Viaje confirmado exitosamente',
        buttons: ['OK'],
      });
      await alert.present();
      this.cargarViajes(); // Recargar lista de viajes
    } catch (error) {
      console.error('Error al confirmar viaje:', error);
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'No se pudo confirmar el viaje',
        buttons: ['OK'],
      });
      await alert.present();
    } finally {
      loading.dismiss();
    }
  }

  doRefresh(event: any) {
    this.cargarViajes().then(() => {
      event.target.complete();
    });
  }
}
