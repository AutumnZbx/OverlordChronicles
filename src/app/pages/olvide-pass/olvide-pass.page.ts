import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-olvide-pass',
  templateUrl: './olvide-pass.page.html',
  styleUrls: ['./olvide-pass.page.scss'],
})
export class OlvidePassPage implements OnInit {

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
