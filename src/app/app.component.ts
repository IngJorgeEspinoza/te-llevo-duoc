// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { FirebaseService } from './service/firebase.service';
import { AlertController, LoadingController, Platform, MenuController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { SessionService } from './service/session.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  userEmail: string = '';
  userName: string = 'Usuario';
  userPhoto: string = 'assets/images/default-user.png';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private firebase: FirebaseService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private platform: Platform,
    private menuController: MenuController,
    private session: SessionService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
    });
  }

  ngOnInit() {
    // Obtengo el correo electrónico desde el Login usando el servicio session
    const storedEmail = this.session.get('email');
    if (storedEmail) {
      this.userEmail = storedEmail;
    }

    // esto es para capturar el nombre
    // const storedName = this.session.get('name');
    // if (storedName) {
    //   this.userName = storedName;
    // }

    // esto es para capturar la foto
    // const storedPhoto = this.session.get('photo');
    // if (storedPhoto) {
    //   this.userPhoto = storedPhoto;
    // }
  }

  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Confirmar Cierre de Sesión',
      message: '¿Estás seguro de que deseas cerrar sesión',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        },
        {
          text: 'Cerrar Sesión',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }

  async logout() {
    await this.menuController.close();

    // Loader con animación de cierre 
    const loading = await this.loadingController.create({
      message: 'Cerrando sesión...',
      duration: 1000, 
      spinner: 'crescent'
    });
    await loading.present();

    try {
      await this.firebase.logout();
      // Limpiar los datos del usuario 
      this.session.clear();
      await loading.onDidDismiss();
      this.router.navigate(['/login']);
    } catch (error) {
      await loading.dismiss();
      console.error('Error al cerrar sesión:', error);
      this.presentAlert('Error', 'No se pudo cerrar sesión. Inténtalo de nuevo.');
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

  async editProfile() {
    const alert = await this.alertController.create({
      header: 'Editar Perfíl',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Ingresa tu nombre',
          value: this.userName
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.name && data.name.trim() !== '') {
              this.userName = data.name.trim();
              this.session.set('name', this.userName);
              this.presentAlert('Éxito', 'Tu nombre ha sido actualizado.');
              return true;
            } else {
              this.presentAlert('Error', 'Name cannot be empty.');
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
