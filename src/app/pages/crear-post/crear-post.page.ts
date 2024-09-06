import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-crear-post',
  templateUrl: './crear-post.page.html',
  styleUrls: ['./crear-post.page.scss'],
})
export class CrearPostPage implements OnInit {
  // Variables para los campos del formulario
  titulo: string = '';
  subtitulo: string = '';
  contenido: string = '';

  constructor(private router: Router, private alertController: AlertController, ) { }

  ngOnInit() {
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
  async crearpost() {
    const alert = await this.alertController.create({
      header: 'Exito',
      message: 'Se ha creado el post correctamente',
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  crear() {
    if (this.titulo.trim() === '') {
      this.presentAlert('El campo "Título" no puede estar vacío.');
      return;
    }

    if (this.subtitulo.trim() === '') {
      this.presentAlert('El campo "Subtítulo" no puede estar vacío.');
      return;
    }

    if (this.contenido.trim() === '') {
      this.presentAlert('El campo "Post" no puede estar vacío.');
      return;
    }

    this.crearpost();
    this.router.navigate(['/foro']);
  }
}
