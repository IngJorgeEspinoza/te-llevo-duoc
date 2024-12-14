import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { LoadingController } from '@ionic/angular';
import { StorageService } from 'src/app/service/storage.service';

interface Viaje {
  id: string;
  fecha: string;
  origen: string;
  destino: string;
  costo: number;
  estado: string;
  conductorNombre?: string;
  pasajeroNombre?: string;
}

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  viajes: Viaje[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private apiService: ApiService,
    private loadingCtrl: LoadingController,
    private storage: StorageService
  ) {}

  async ngOnInit() {
    await this.cargarViajes();
  }

  async cargarViajes() {
    this.isLoading = true;
    const loading = await this.loadingCtrl.create({
      message: 'Cargando historial...'
    });
    await loading.present();

    try {
      const userId = await this.apiService.getUserId();
      const response = await this.apiService.obtenerViajes();
      
      // Filtrar los viajes del usuario actual y transformar los datos
      const viajesUsuario = Array.isArray(response) ? response : [];
      this.viajes = viajesUsuario
        .filter(viaje => viaje.p_id_usuario === userId)
        .map(viaje => ({
          id: viaje.id,
          fecha: new Date(viaje.fecha).toLocaleDateString('es-CL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }),
          origen: viaje.p_ubicacion_origen,
          destino: viaje.p_ubicacion_destino,
          costo: viaje.p_costo,
          estado: viaje.estado || 'PENDIENTE',
          conductorNombre: viaje.conductor_nombre,
          pasajeroNombre: viaje.pasajero_nombre
        }))
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      
    } catch (err) {
      console.error('Error al cargar viajes:', err);
      this.error = 'No se pudo cargar el historial de viajes';
    } finally {
      this.isLoading = false;
      loading.dismiss();
    }
  }

  async doRefresh(event: any) {
    try {
      await this.cargarViajes();
    } finally {
      event.target.complete();
    }
  }

  getEstadoColor(estado: string): string {
    switch (estado.toUpperCase()) {
      case 'COMPLETADO':
        return 'success';
      case 'EN_CURSO':
        return 'warning';
      case 'CANCELADO':
        return 'danger';
      default:
        return 'medium';
    }
  }
}