import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  imageFile: File | null = null;
  imageTouched = false;
  showPassword = false;
  showConfirmPassword = false;
  dateOfBirthInvalid = false;
  days: number[] = [];
  months: { value: number; name: string }[] = [];
  years: number[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private storage: StorageService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      dia: ['', Validators.required],
      mes: ['', Validators.required],
      anio: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.initializeDateOptions();
  }

  // Inicializa las opciones de días, meses y años
  initializeDateOptions() {
    this.days = Array.from({ length: 31 }, (_, i) => i + 1);
    this.months = [
      { value: 1, name: 'Enero' },
      { value: 2, name: 'Febrero' },
      { value: 3, name: 'Marzo' },
      { value: 4, name: 'Abril' },
      { value: 5, name: 'Mayo' },
      { value: 6, name: 'Junio' },
      { value: 7, name: 'Julio' },
      { value: 8, name: 'Agosto' },
      { value: 9, name: 'Septiembre' },
      { value: 10, name: 'Octubre' },
      { value: 11, name: 'Noviembre' },
      { value: 12, name: 'Diciembre' },
    ];
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  }

  onImageSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput?.files && fileInput.files.length > 0) {
      this.imageFile = fileInput.files[0];
      this.imageTouched = true;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async register() {
    if (this.registerForm.valid && this.imageFile) {
      const loading = await this.loadingController.create({
        message: 'Creando cuenta...',
      });
      await loading.present();

      try {
        const { email, nombre, telefono, password, dia, mes, anio } = this.registerForm.value;
        const token = 'token_simulado'; // Reemplaza con la lógica real para obtener el token.

        await this.apiService.agregarUsuario(
          { p_nombre: nombre, p_correo_electronico: email, p_telefono: telefono, token },
          this.imageFile
        );

        await loading.dismiss();
        await this.presentAlert('Cuenta creada', 'Tu cuenta ha sido creada exitosamente.');
        this.router.navigateByUrl('/login');
      } catch (error: any) {
        console.error('Error en registro:', error);
        await loading.dismiss();
        this.presentAlert('Error', 'No se pudo crear la cuenta. Por favor, intenta de nuevo.');
      }
    } else {
      this.imageTouched = true;
      await this.presentAlert('Formulario incompleto', 'Completa todos los campos y sube una imagen.');
    }
  }
}
