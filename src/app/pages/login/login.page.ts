import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/service/firebase.service';
import { Tab1Page } from 'src/app/tab1/tab1.page';

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
      this.router.navigateByUrl("/tabs/tab1")
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
