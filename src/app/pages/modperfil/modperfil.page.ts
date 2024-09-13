import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController,ToastController } from '@ionic/angular';

@Component({
  selector: 'app-modperfil',
  templateUrl: './modperfil.page.html',
  styleUrls: ['./modperfil.page.scss'],
})
export class ModperfilPage implements OnInit {
  username: string ="";
  email: string="";


  constructor(private router:Router, public alertController: AlertController, private toastController: ToastController) { }
  ngOnInit() {
  }
  async presentToast(position: 'bottom', texto:string) {
    const toast = await this.toastController.create({
      message: texto,
      duration: 1500,
      position: position,
    });

    await toast.present();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Modificar perfil',
      message: 'Se ha modificado el perfil correctamente',
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  
  guardar(){
    if (this.username === "") {
      this.presentToast('bottom', 'El campo "Nombre" no debe estar vacío.');
      return;
    }
    
    if (this.email === "") {
      this.presentToast('bottom', 'El campo "Correo electrónico" no debe estar vacío.');
      return;
    }
    if (!this.email.includes('@')) {
      this.presentToast('bottom', 'El correo electrónico no es valido.');
      return;
    }

    this.presentAlert();
    this.router.navigate(['/perfil']);
  }

}
