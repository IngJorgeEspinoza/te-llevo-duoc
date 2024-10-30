import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {

  supportEmail: string = 'soporte@tellevo.duoc.cl';
  contactEmail: string = 'soporte@tellevo.duoc.cl';

  constructor() { }

  ngOnInit() {
  }

}
