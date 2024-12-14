// src/app/pages/vehicle/vehicle.page.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService, BodyVehicle } from 'src/app/service/api.service';
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
        message: 'Agregando vehículo...'
      });
      await loading.present();
  
      try {
        // 1. Obtener token
        const token = this.storage.get('tokenID');
        if (!token) {
          throw new Error('No hay sesión activa');
        }

        // 2. Obtener ID del usuario
        const userId = await this.apiService.getUserId();
        console.log('ID de usuario obtenido:', userId);

        // 3. Preparar datos del vehículo
        const vehicleData: BodyVehicle = {
          p_id_usuario: userId,
          p_patente: this.vehicleForm.value.patente.toUpperCase(),
          p_marca: this.vehicleForm.value.marca,
          p_modelo: this.vehicleForm.value.modelo,
          p_anio: parseInt(this.vehicleForm.value.anio, 10),
          p_color: this.vehicleForm.value.color,
          p_tipo_combustible: this.vehicleForm.value.tipo_combustible,
          token: token
        };
  
        // 4. Enviar datos a la API
        console.log('Enviando datos del vehículo:', vehicleData);
        const response = await this.apiService.agregarVehiculo(vehicleData, this.imageFile);
        
        await loading.dismiss();
        await this.presentAlert('Éxito', 'Vehículo agregado correctamente');
        this.router.navigate(['/tabs/tab1']);
      } catch (error: any) {
        await loading.dismiss();
        console.error('Error detallado:', error);
        const errorMessage = error.message || 'No se pudo agregar el vehículo. Inténtalo de nuevo.';
        this.presentAlert('Error', errorMessage);
      }
    } else {
      await this.presentAlert('Formulario incompleto', 'Por favor, completa todos los campos correctamente y sube una imagen.');
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