import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../service/firebase.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Asegúrate de tener esto importado

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  userEmail: string = ''; // Mantén solo el email del usuario

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private alertController: AlertController,
    private afAuth: AngularFireAuth // Inyectado
  ) { }

  ngOnInit() {
    this.getUserEmail();
  }

  // Método para obtener el email del usuario
  getUserEmail() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userEmail = user.email ? user.email : '';
      } else {
        // Si no hay usuario autenticado, redirigir al login
        this.router.navigate(['/login']);
      }
    });
  }

  logout() {
    this.presentLogoutConfirmation();
  }

  async presentLogoutConfirmation() {
    const alert = await this.alertController.create({
      header: 'Confirmar cierre de sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cierre de sesión cancelado');
          }
        }, {
          text: 'Cerrar sesión',
          handler: async () => {
            try {
              await this.firebaseService.logout();
              this.router.navigate(['/login']);
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
