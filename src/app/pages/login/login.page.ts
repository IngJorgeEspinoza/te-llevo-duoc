import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/service/firebase.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = "";
  password: string = "";
  tokenID: string = ""; // Para almacenar el token ID

  constructor(
    private firebase: FirebaseService,
    private router: Router,
    private alertController: AlertController,
    private storage: StorageService
  ) { }

  ngOnInit() {}

  async login() {
    try {
      // Autenticación del usuario
      let user = await this.firebase.Auth(this.email, this.password);
      
      // Obtener el token ID del usuario autenticado
      this.tokenID = await user.user?.getIdToken() || "";
      console.log("TokenID:", this.tokenID);

      // Guardar el token ID y el correo en el almacenamiento
      this.storage.set('tokenID', this.tokenID);
      this.storage.set('email', this.email);

      // Navegar a la página principal con los datos necesarios
      const navigationExtras: NavigationExtras = {
        queryParams: { email: this.email }
      };
      this.router.navigate(['/tabs/tab1'], navigationExtras);

    } catch (error) {
      console.log(error);
      this.popAlert();
    }
  }

  async popAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'E-mail o Contraseña incorrectas',
      buttons: ['Intentar nuevamente']
    });
    await alert.present();
  }
}
