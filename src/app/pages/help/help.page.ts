import { Component, OnInit } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';

interface Faq {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {

  faqs: Faq[] = [
    {
      question: '¿Cómo puedo crear una cuenta en Te Llevo DUOC?',
      answer: 'Para crear una cuenta, dirígete a la sección de registro en la aplicación. Completa el formulario con tu correo institucional, una contraseña segura y la información personal requerida. Una vez registrado, recibirás un correo de confirmación para activar tu cuenta.',
      isOpen: false
    },
    {
      question: '¿Qué hago si olvidé mi contraseña?',
      answer: 'Si olvidaste tu contraseña, ve a la sección de recuperación en la pantalla de inicio de sesión. Ingresa tu correo electrónico institucional y recibirás un enlace para restablecer tu contraseña. Sigue las instrucciones en el correo para completar el proceso.',
      isOpen: false
    },
    {
      question: '¿Cómo puedo editar mi perfil?',
      answer: 'Para editar tu perfil, accede a la sección de "Cuenta" en la aplicación. Allí encontrarás la opción "Editar Perfil", donde podrás actualizar tu información personal, cambiar tu foto de perfil y ajustar tus preferencias de notificación.',
      isOpen: false
    },
    {
      question: '¿Cómo reservar un viaje?',
      answer: 'Para reservar un viaje, ve a la sección "Reservar Viaje" en la aplicación. Selecciona tu punto de partida y destino, elige la fecha y hora deseada, y confirma la reserva. Recibirás una notificación una vez que un conductor acepte tu solicitud.',
      isOpen: false
    },
    {
      question: '¿Puedo cancelar una reserva?',
      answer: 'Sí, puedes cancelar una reserva desde la sección "Mis Reservas" en la aplicación. Ten en cuenta que las cancelaciones realizadas con menos de 15 minutos de la hora programada podrían estar sujetas a una pequeña tarifa de cancelación.',
      isOpen: false
    },
    {
      question: '¿Cuáles son los métodos de pago aceptados?',
      answer: 'Te Llevo DUOC acepta varios métodos de pago, incluyendo tarjetas de crédito y débito, transferencias bancarias, y pagos en efectivo. Puedes seleccionar tu método de pago preferido durante el proceso de reserva.',
      isOpen: false
    },
    {
      question: '¿Cómo contacto al soporte técnico?',
      answer: 'Puedes contactar al soporte enviando un correo a soporte@tellevo.duoc.cl o llamando al número de atención 800-123-456. Nuestro equipo está disponible de lunes a viernes, de 9:00 AM a 6:00 PM.',
      isOpen: false
    },
    {
      question: '¿Dónde puedo ver mi historial de viajes?',
      answer: 'Tu historial de viajes está disponible en la sección "Historial de Viajes" de la aplicación. Aquí podrás ver todas tus reservas anteriores, incluyendo detalles como fecha, hora, ruta y conductor asignado.',
      isOpen: false
    },
    {
      question: '¿Qué hago si encuentro un problema durante el viaje?',
      answer: 'Si enfrentas algún problema durante un viaje, como retrasos o inconvenientes con el conductor, puedes reportarlo desde la sección "Ayuda" en la aplicación. Proporciona detalles específicos para que podamos investigar y resolver la situación lo antes posible.',
      isOpen: false
    },
    {
      question: '¿Cómo actualizo la información de mi vehículo?',
      answer: 'Si eres conductor en Te Llevo DUOC, puedes actualizar la información de tu vehículo desde la sección "Perfil de Conductor". Aquí podrás editar detalles como modelo, color, número de placa y subir una foto actualizada de tu vehículo.',
      isOpen: false
    }
  ];

  contactEmail: string = 'ma.henriquezq@duocuc.cl';

  constructor(private platform: Platform, private alertController: AlertController) { }

  ngOnInit() {
  }

  toggleAnswer(faq: Faq): void {
    faq.isOpen = !faq.isOpen;
  }

  openWhatsApp(): void {
    const phoneNumber = '+56991379473';
    const message = 'Hola, necesito ayuda con Te Llevo DUOC.';

    // esto es para diferenciar entre plataforma web o móvil
    if (this.platform.is('capacitor')) {
      // WhatsApp en celular
      window.open(`whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`, '_system');
    } else {
      // WhatsApp Web
      window.open(`https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`, '_blank');
    }
  }

}
