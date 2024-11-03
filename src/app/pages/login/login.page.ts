import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/service/firebase.service';
import { SessionService } from 'src/app/service/session.service';

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
    private session: SessionService
  ) { }

  ngOnInit() {
  }

  async login() {
    try {
      let user = await this.firebase.Auth(this.email, this.password);
      console.log(user);
      this.session.set('email', this.email);
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
