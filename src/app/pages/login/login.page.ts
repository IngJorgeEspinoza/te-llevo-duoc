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
  tokenID: string = ""; 

  constructor(
    private firebase: FirebaseService,
    private router: Router,
    private alertController: AlertController,
    private storage: StorageService
  ) { }

  ngOnInit() {}

  async login() {
    try {
      let user = await this.firebase.Auth(this.email, this.password);
      this.tokenID = await user.user?.getIdToken() || "";
      console.log("TokenID:", this.tokenID);

      // Almacena el tokenID y el email en el storage
      this.storage.set('tokenID', this.tokenID);
      this.storage.set('email', this.email);

      // Redirige sin `NavigationExtras` para evitar queryParams
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
