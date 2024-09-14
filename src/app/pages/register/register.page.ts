import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private firebase:FirebaseService, private router:Router) { }

  email=""
  password=""

  ngOnInit() {
  }
  
  async register(){

    let usuario=await this.firebase.register(this.email,this.password);
    console.log(usuario);
    this.router.navigateByUrl("login")
  }

}
