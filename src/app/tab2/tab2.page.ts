import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService, BodyTrip } from '../service/api.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { StorageService } from '../service/storage.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  tripForm: FormGroup;
  vehiculoId: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private storage: StorageService
  ) {
    this.tripForm = this.formBuilder.group({
      origen: ['', Validators.required],
      destino: ['', Validators.required],
      fechaHoraSalida: ['', Validators.required],
      asientosDisponibles: ['', [Validators.required, Validators.min(1)]],
      precioAsiento: ['', [Validators.required, Validators.min(0)]],
      descripcion: [''],
    });
  }

  async ngOnInit() {
    try {
      const userId = await this.apiService.getUserId();
      const vehiculos = await this.apiService.obtenerVehiculos(userId);

      if (vehiculos.length > 0) {
        this.vehiculoId = vehiculos[0]?.id;
      } else {
        console.warn('No se encontraron vehículos registrados.');
      }
    } catch (error) {
      console.error('Error al cargar vehículo:', error);
      await this.presentAlert(
        'Error',
        'Hubo un problema al cargar tus vehículos. Asegúrate de tener un vehículo registrado.'
      );
    }
  }

  async publishTrip() {
    if (this.tripForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Publicando viaje...',
      });
      await loading.present();

      try {
        const userId = await this.apiService.getUserId();
        if (!this.vehiculoId) {
          throw new Error('No hay vehículo registrado. Registra un vehículo primero.');
        }

        const formValues = this.tripForm.value;
        const tripData: BodyTrip = {
          p_id_usuario: userId,
          p_ubicacion_origen: formValues.origen,
          p_ubicacion_destino: formValues.destino,
          p_costo: formValues.precioAsiento,
          p_id_vehiculo: this.vehiculoId,
        };

        await this.apiService.publicarViaje(tripData);
        await loading.dismiss();

        await this.presentAlert('Éxito', 'El viaje ha sido publicado correctamente.');
        this.tripForm.reset();
      } catch (error: any) {
        await loading.dismiss();
        console.error('Error al publicar viaje:', error);
        await this.presentAlert('Error', error.message || 'No se pudo publicar el viaje.');
      }
    } else {
      await this.presentAlert('Formulario incompleto', 'Completa todos los campos obligatorios.');
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
