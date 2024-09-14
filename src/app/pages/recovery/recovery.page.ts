import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/service/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.page.html',
  styleUrls: ['./recovery.page.scss'],
})
export class RecoveryPage implements OnInit {

  email= ""
  password = ""

  constructor(private firebase:FirebaseService, private router:Router) { }

  ngOnInit() {
  }

  async recovery(){
    let usuario=await this.firebase.recovery(this.email);
    console.log(usuario);
    this.router.navigateByUrl("login")

  }

}
