import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firebase: AngularFireAuth) {}

  async Auth(email: string, password: string) {
    const request = await this.firebase.signInWithEmailAndPassword(email, password);
    return request;
  }

  async register(email: string, password: string) {
    const request = await this.firebase.createUserWithEmailAndPassword(email, password);
    return request;
  }

  async recovery(email: string) {
    const request = await this.firebase.sendPasswordResetEmail(email);
    return request;
  }

  async logout() {
    await this.firebase.signOut();
  }

  // Método para obtener el token de autenticación del usuario actual
  async getTokenID(): Promise<string | null> {
    const user = await this.firebase.currentUser;
    return user ? await user.getIdToken() : null;
  }
}