import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/service/firebase.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  imageFile: File | null = null;
  imageTouched = false;

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
    private loadingController: LoadingController,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.initializeDateOptions();

    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, this.emailInstitutionalValidator]],
      nombre: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],  // Validación para un número de 9 dígitos
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

  passwordMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

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
    if (this.registerForm.valid && this.imageFile) {
      const { email, password, nombre, telefono, dia, mes, anio } = this.registerForm.value;
      const fechaNacimiento = `${anio}-${mes}-${dia}`;
      const loading = await this.loadingController.create({
        message: 'Creando cuenta...'
      });
      await loading.present();
      try {
        await this.firebase.register(email, password);
        const token = await this.firebase.getTokenID() || '';

        await this.apiService.agregarUsuario({
          p_nombre: nombre,
          p_correo_electronico: email,
          p_fecha_nacimiento: fechaNacimiento,
          p_telefono: telefono,
          token
        }, this.imageFile as File);

        await loading.dismiss();
        this.presentAlert('Cuenta creada', 'Tu cuenta ha sido creada exitosamente.');
        this.router.navigateByUrl('/login');
      } catch (error: any) {
        await loading.dismiss();
        if (error.code === 'auth/email-already-in-use') {
          this.presentAlert('Error', 'El correo electrónico ya está en uso. Intenta con otro.');
        } else {
          this.presentAlert('Error', 'No se pudo crear la cuenta. Inténtalo de nuevo.');
        }
      }
    } else {
      this.imageTouched = true;
      this.presentAlert('Formulario incompleto', 'Por favor, completa todos los campos correctamente.');
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
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
      buttons: ['OK']
    });
    await alert.present();
  }
}
