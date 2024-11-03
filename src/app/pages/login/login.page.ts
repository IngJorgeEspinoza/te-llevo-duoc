import { Component, OnInit } from '@angular/core';
import { NavigationExtras,Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/service/firebase.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email=""
  password=""

  constructor(private firebase:FirebaseService, private router:Router, private alertcontroler:AlertController) { }

  ngOnInit() {
  }

  async login(){
    try {
      let user=await this.firebase.Auth(this.email,this.password);
      console.log(user);
      const navigationExtras:NavigationExtras = {
        queryParams: {email: this.email}
      };
      this.router.navigate(['/tabs/tab1'], navigationExtras)
    } catch (error) {
      console.log(error);
      this.popAlert();
    }
  }

  async popAlert(){
    const alert=await this.alertcontroler.create({
      header:'Error',
      message:'E-mail o Contraseña incorrectas',
      buttons:['Intentar nuevamente']
    })
    await alert.present();
  }
}
