// app.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { FirebaseService } from './service/firebase.service';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  userEmail: string = '';
  userName: string = 'Usuario'; // Nombre por defecto
  userPhoto: string = 'assets/images/default-user.png'; // Foto por defecto

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private firebase: FirebaseService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private platform: Platform
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Puedes inicializar servicios aquí si es necesario
    });
  }

  ngOnInit() {
    // Capturar parámetros desde la navegación
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(() => {
        const currentNavigation = this.router.getCurrentNavigation();
        if (currentNavigation?.extras?.queryParams) {
          const params = currentNavigation.extras.queryParams;
          if (params && params['email']) {
            this.userEmail = params['email'];
          }
        }
      });
  }

  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Confirmar Cierre de Sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // Acción al cancelar
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
    // Mostrar un loader con animación de cierre de sesión
    const loading = await this.loadingController.create({
      message: 'Cerrando sesión...',
      duration: 2000, // Duración de la animación en milisegundos
      spinner: 'crescent' // Tipo de spinner
    });
    await loading.present();

    try {
      await this.firebase.logout();
      await loading.onDidDismiss(); // Esperar a que el loader desaparezca
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
      header: 'Editar Perfil',
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
            // Acción al cancelar
          }
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.name && data.name.trim() !== '') {
              this.userName = data.name.trim();
              this.presentAlert('Éxito', 'Tu nombre ha sido actualizado.');
              return true; // Permite que la alerta se cierre
            } else {
              this.presentAlert('Error', 'El nombre no puede estar vacío.');
              return false; // Evita que la alerta se cierre
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
