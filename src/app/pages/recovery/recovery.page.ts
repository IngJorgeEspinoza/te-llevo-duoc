import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { FirebaseService } from 'src/app/service/firebase.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.page.html',
  styleUrls: ['./recovery.page.scss'],
})
export class RecoveryPage implements OnInit {

  recoveryForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.recoveryForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, this.emailInstitutionalValidator]]
    });
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

  async recoverPassword() {
    if (this.recoveryForm.valid) {
      const { email } = this.recoveryForm.value;
      const loading = await this.loadingController.create({
        message: 'Enviando correo de recuperación...'
      });
      await loading.present();
      try {
        await this.firebaseService.recovery(email);
        await loading.dismiss();
        this.presentAlert('Correo Enviado', 'Hemos enviado un enlace de recuperación a tu correo institucional.');
        this.recoveryForm.reset();
      } catch (error) {
        await loading.dismiss();
        this.presentAlert('Error', 'No pudimos enviar el correo de recuperación. Por favor, intenta de nuevo.');
      }
    } else {
      this.presentAlert('Formulario Incompleto', 'Por favor, ingresa un correo institucional válido.');
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
