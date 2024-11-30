import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.page.html',
  styleUrls: ['./vehicle.page.scss'],
})
export class VehiclePage implements OnInit {
  vehicleForm!: FormGroup;
  imageFile: File | null = null;
  imageTouched = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.vehicleForm = this.formBuilder.group({
      patente: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      anio: ['', [Validators.required, Validators.pattern('^(19|20)[0-9]{2}$')]],
      color: ['', Validators.required],
      tipo_combustible: ['', Validators.required],
    });
  }

  async addVehicle() {
    if (this.vehicleForm.valid && this.imageFile) {
      const loading = await this.loadingController.create({
        message: 'Agregando vehículo...',
      });
      await loading.present();

      try {
        const token = (await this.firebaseService.getTokenID()) || '';
        const userId = await this.apiService.getUserId(); // Método que obtiene el ID del usuario desde la API
        const formData = {
          p_id_usuario: userId,
          p_patente: this.vehicleForm.value.patente,
          p_marca: this.vehicleForm.value.marca,
          p_modelo: this.vehicleForm.value.modelo,
          p_anio: this.vehicleForm.value.anio,
          p_color: this.vehicleForm.value.color,
          p_tipo_combustible: this.vehicleForm.value.tipo_combustible,
          token,
        };

        await this.apiService.agregarVehiculo(formData, this.imageFile);
        await loading.dismiss();
        this.presentAlert('Éxito', 'Vehículo agregado correctamente.');
      } catch (error) {
        await loading.dismiss();
        this.presentAlert(
          'Error',
          'No se pudo agregar el vehículo. Inténtalo de nuevo.'
        );
      }
    } else {
      this.imageTouched = true;
      this.presentAlert(
        'Formulario incompleto',
        'Por favor, completa todos los campos correctamente.'
      );
    }
  }

  onImageSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.imageFile = fileInput.files[0];
      this.imageTouched = true;
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
