import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.page.html',
  styleUrls: ['./vehicle.page.scss'],
})
export class VehiclePage implements OnInit {
  vehicleForm!: FormGroup;
  imageFile: File | null = null;
  imageTouched = false;
  currentYear = new Date().getFullYear();

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router,
    private storage: StorageService
  ) {}

  ngOnInit() {
    this.vehicleForm = this.formBuilder.group({
      patente: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]],
      marca: ['', [Validators.required, Validators.minLength(2)]],
      modelo: ['', [Validators.required, Validators.minLength(2)]],
      anio: ['', [Validators.required, Validators.min(1950), Validators.max(this.currentYear)]],
      color: ['', [Validators.required, Validators.minLength(2)]],
      tipo_combustible: ['', Validators.required],
    });
  }

  async addVehicle() {
    this.vehicleForm.markAllAsTouched();

    if (this.vehicleForm.valid && this.imageFile) {
      const loading = await this.loadingController.create({
        message: 'Agregando vehículo...',
      });
      await loading.present();

      try {
        const email = this.storage.get('email');
        const token = this.storage.get('tokenID');

        if (!email || !token) {
          throw new Error('Falta el email o token en el almacenamiento.');
        }

        const userResponse = await this.apiService.obtenerUsuario(email);
        const userId = userResponse?.id;

        if (!userId) {
          throw new Error('No se pudo obtener el ID del usuario.');
        }

        const formData = {
          p_id_usuario: userId,
          p_patente: this.vehicleForm.value.patente.toUpperCase(),
          p_marca: this.vehicleForm.value.marca,
          p_modelo: this.vehicleForm.value.modelo,
          p_anio: parseInt(this.vehicleForm.value.anio, 10),
          p_color: this.vehicleForm.value.color,
          p_tipo_combustible: this.vehicleForm.value.tipo_combustible,
          token: token,
        };

        await this.apiService.agregarVehiculo(formData, this.imageFile);

        await loading.dismiss();
        await this.presentAlert('Éxito', 'Vehículo agregado correctamente');
        this.router.navigate(['/tabs/tab1']);
      } catch (error: any) {
        await loading.dismiss();
        console.error('Error detallado:', error);
        this.presentAlert('Error', error.message || 'No se pudo agregar el vehículo. Inténtalo de nuevo.');
      }
    } else {
      await this.presentAlert('Formulario incompleto', 'Por favor, completa todos los campos correctamente y sube una imagen.');
    }
  }

  onImageSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput?.files && fileInput.files.length > 0) {
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
