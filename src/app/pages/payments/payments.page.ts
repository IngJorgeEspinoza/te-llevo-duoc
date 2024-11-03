import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

interface Card {
  name: string;
  holderName: string;
  number: string;
  expiry: string;
  cvc: string;
}

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage {

  cards: Card[] = [];
  selectedCard: Card | null = null;

  constructor(private alertController: AlertController) { }

  // Agregar tarjeta
  async addCard() {
    const alert = await this.alertController.create({
      header: 'Agregar Tarjeta',
      backdropDismiss: false,
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Nombre de la Tarjeta', attributes: { maxlength: 20 } },
        { name: 'holderName', type: 'text', placeholder: 'Titular de la Tarjeta', attributes: { maxlength: 30 } },
        {
          name: 'number',
          type: 'text',
          placeholder: 'Número de Tarjeta (16 dígitos)',
          attributes: { maxlength: 19 }
        },
        { name: 'expiry', type: 'text', placeholder: 'MM/AA' },
        { name: 'cvc', type: 'password', placeholder: 'CVC (3 dígitos)', attributes: { maxlength: 3 } }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Agregar',
          handler: (data) => {
            const errors = this.validateForm(data);
            if (errors.length > 0) {
              this.showValidationErrors(errors);
              return false;
            } else {
              const formattedCard: Card = {
                ...data,
                number: data.number.replace(/\s+/g, '').replace(/(\d{4})(?=\d)/g, '$1 '),
                cvc: '***'
              };
              this.cards.push(formattedCard);
              if (!this.selectedCard) {
                this.selectedCard = formattedCard;
              }
              return true;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  // Editar tarjeta
  async editCard(card: Card, event: Event) {
    event.stopPropagation();
    const alert = await this.alertController.create({
      header: 'Editar Tarjeta',
      backdropDismiss: false,
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Nombre de la Tarjeta', value: card.name, attributes: { maxlength: 20 } },
        { name: 'holderName', type: 'text', placeholder: 'Titular de la Tarjeta', value: card.holderName, attributes: { maxlength: 30 } },
        { name: 'number', type: 'text', placeholder: 'Número de Tarjeta', value: card.number },
        { name: 'expiry', type: 'text', placeholder: 'MM/AA', value: card.expiry },
        { name: 'cvc', type: 'password', placeholder: 'CVC', attributes: { maxlength: 3 } }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            const errors = this.validateForm(data);
            if (errors.length > 0) {
              this.showValidationErrors(errors);
              return false;
            } else {
              card.name = data.name;
              card.holderName = data.holderName;
              card.number = data.number.replace(/\s+/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
              card.expiry = data.expiry;
              card.cvc = '***';
              return true;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  // Mostrar errores de validación. No he podido hacer que se muestre bien. quiero que se vea como un listado
  async showValidationErrors(errors: string[]) {
    const formattedErrors = ' ' + errors.map(error => `${error}`).join('\n') + ' ';
  
    const alert = await this.alertController.create({
      header: 'Datos incorrectos o incompletos',
      message: formattedErrors,
      buttons: ['Volver a intentarlo'],
      cssClass: 'validation-alert'
    });
  
    await alert.present();
  }

  // Validadores
  validateForm(data: any): string[] {
    const errors: string[] = [];
    if (!data.name || data.name.trim().length < 3) {
      errors.push('Nombre de la Tarjeta debe tener al menos 3 caracteres.');
    }
    if (!data.holderName || data.holderName.trim().length < 3) {
      errors.push('Titular de la Tarjeta debe tener al menos 3 caracteres.');
    }
    if (!/^\d{16}$/.test(data.number.replace(/\s+/g, ''))) {
      errors.push('Número de tarjeta inválido, debe ser de 16 dígitos.');
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiry)) {
      errors.push('Fecha de expiración inválida, formato MM/AA.');
    }
    if (!/^\d{3}$/.test(data.cvc)) {
      errors.push('CVC inválido, debe ser de 3 dígitos.');
    }
    return errors;
  }

  // Tarjeta predeterminada
  selectCard(card: Card) {
    this.selectedCard = card;
  }

  // Eliminar tarjeta
  async deleteCard(card: Card, event: Event) {
    event.stopPropagation();
    const alert = await this.alertController.create({
      header: 'Eliminar Tarjeta',
      message: '¿Estás seguro de que deseas eliminar esta tarjeta?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            this.cards = this.cards.filter(c => c !== card);
            if (this.selectedCard === card) {
              this.selectedCard = this.cards.length > 0 ? this.cards[0] : null;
            }
          }
        }
      ]
    });

    await alert.present();
  }
}