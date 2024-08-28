import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cambio-pass',
  templateUrl: './cambio-pass.page.html',
  styleUrls: ['./cambio-pass.page.scss'],
})
export class CambioPassPage implements OnInit {

  constructor(private router:Router, private alertController: AlertController) { }

  ngOnInit() {
  }

  async presentAlert(titulo:string, texto:string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: texto,
      buttons: ['OK'],
    });

    await alert.present();
  }

  cambiarPassword(){
    this.presentAlert('Contraseña cambiada', 'se le ha enviado a su correo un enlace en donde podra cambiar su contraseña');
    this.router.navigate(['/inicio']);
  }

}
