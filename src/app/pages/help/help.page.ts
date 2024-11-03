import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {

  supportEmail: string = 'jor.espinozaa@duocuc.cl';
  contactEmail: string = 'jor.espinozaa@duocuc.cl';
  contactPhone: string = '+56 9 9137 9473'; // Número de contacto
  whatsappNumber: string = '56991379473'; // Número de WhatsApp sin símbolos ni espacios
  whatsappMessage: string = 'Hola, necesito ayuda con la aplicación Te Llevo DUOC.';

  constructor(private platform: Platform) { }

  ngOnInit() {
  }

  openWhatsApp() {
    const message = encodeURIComponent(this.whatsappMessage);
    const url = `https://wa.me/${this.whatsappNumber}?text=${message}`;

    if (this.platform.is('capacitor') || this.platform.is('cordova')) {
      // Para dispositivos móviles
      window.open(url, '_system');
    } else {
      // Para navegadores de escritorio
      window.open(url, '_blank');
    }
  }

}
