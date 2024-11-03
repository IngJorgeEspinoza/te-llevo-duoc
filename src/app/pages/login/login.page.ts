import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(
    private firebase: FirebaseService,
    private router: Router,
    private alertController: AlertController,
    private storage: StorageService
  ) { }

  ngOnInit() {
  }

  async login() {
    try {
      let user = await this.firebase.Auth(this.email, this.password);
      console.log(user);
      // Guarda el correo
      this.storage.set('email', this.email);
      // Esto para guardar el nombre
      // this.storage.set('name', 'Nombre del Usuario');
      // esto es para guardar la foto
      // this.storage.set('photo', 'ruta/a/la/foto.jpg');
      this.router.navigate(['/tabs/tab1']);
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