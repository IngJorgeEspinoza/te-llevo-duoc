import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/service/firebase.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;

  days: number[] = [];
  months = [
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
  years: number[] = [];

  get dateOfBirthInvalid(): boolean {
    return this.registerForm.hasError('dateInvalid') && !!this.registerForm.get('dia')?.touched;
  }

  constructor(
    private firebase: FirebaseService,
    private router: Router,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.initializeDateOptions();

    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, this.emailInstitutionalValidator]],
      nombre: ['', Validators.required],
      dia: ['', Validators.required],
      mes: ['', Validators.required],
      anio: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: [this.passwordMatchValidator, this.dateValidator]
    });
  }

  initializeDateOptions() {
    this.days = Array.from({ length: 31 }, (_, i) => i + 1);
    const currentYear = new Date().getFullYear();
    this.years = [];
    for (let year = currentYear; year >= 1900; year--) {
      this.years.push(year);
    }
  }

  // confirmar que las contraseñas coinciden
  passwordMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Validación correo DUOC
  emailInstitutionalValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    if (email && email.indexOf('@') !== -1) {
      const domain = email.substring(email.lastIndexOf('@') + 1);
      if (domain.toLowerCase() === 'duocuc.cl') {
        return null;
      } else {
        return { notInstitutionalEmail: true };
      }
    }
    return null;
  }

  // Validación fecha de nacimiento
  dateValidator(formGroup: AbstractControl): ValidationErrors | null {
    const dia = formGroup.get('dia')?.value;
    const mes = formGroup.get('mes')?.value;
    const anio = formGroup.get('anio')?.value;

    if (dia && mes && anio) {
      const date = new Date(anio, mes - 1, dia);
      if (date && date.getDate() === dia && date.getMonth() === mes - 1 && date.getFullYear() === anio) {
        return null;
      } else {
        return { dateInvalid: true };
      }
    }
    return { dateInvalid: true };
  }

  async register() {
    if (this.registerForm.valid) {
      const { email, password, nombre, dia, mes, anio } = this.registerForm.value;
      const fechaNacimiento = new Date(anio, mes - 1, dia);
      const loading = await this.loadingController.create({
        message: 'Creando cuenta...'
      });
      await loading.present();
      try {
        // Lógica para registrar el usuario
        await this.firebase.register(email, password);
        await loading.dismiss();
        this.presentAlert('Cuenta creada', 'Tu cuenta ha sido creada exitosamente.');
        this.router.navigateByUrl('/login');
      } catch (error) {
        await loading.dismiss();
        this.presentAlert('Error', 'No se pudo crear la cuenta. Inténtalo de nuevo.');
      }
    } else {
      this.presentAlert('Formulario incompleto', 'Por favor, completa todos los campos correctamente.');
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
      buttons: ['OK']
    });
    await alert.present();
  }
}
