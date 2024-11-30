import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  tripForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Inicialización del formulario reactivo
    this.tripForm = this.formBuilder.group({
      origen: ['', Validators.required],
      destino: ['', Validators.required],
      fechaHoraSalida: ['', Validators.required],
      asientosDisponibles: ['', [Validators.required, Validators.min(1)]],
      precioAsiento: ['', [Validators.required, Validators.min(0)]],
      descripcion: [''],
    });
  }

  async publishTrip() {
    if (this.tripForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Publicando viaje...',
      });
      await loading.present();

      try {
        const tripData = {
          origen: this.tripForm.value.origen,
          destino: this.tripForm.value.destino,
          fechaHoraSalida: this.tripForm.value.fechaHoraSalida,
          asientosDisponibles: this.tripForm.value.asientosDisponibles,
          precioAsiento: this.tripForm.value.precioAsiento,
          descripcion: this.tripForm.value.descripcion,
        };

        await this.apiService.publicarViaje(tripData);
        await loading.dismiss();
        this.presentAlert('Éxito', 'El viaje ha sido publicado correctamente.');
        this.tripForm.reset();
      } catch (error) {
        await loading.dismiss();
        this.presentAlert('Error', 'No se pudo publicar el viaje. Por favor, inténtalo nuevamente.');
      }
    } else {
      this.presentAlert('Formulario incompleto', 'Por favor, completa todos los campos obligatorios.');
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
