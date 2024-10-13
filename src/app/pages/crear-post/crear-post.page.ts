import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-crear-post',
  templateUrl: './crear-post.page.html',
  styleUrls: ['./crear-post.page.scss'],
})
export class CrearPostPage implements OnInit {
  // Variables para los campos del formulario
  titulo: string = '';
  contenido: string = '';
  imagen: any;
  currentUserId: number = 0;

  constructor(private router: Router, private alertController: AlertController, private sanitizer: DomSanitizer, private bd:SevicebdService,private storage: NativeStorage) { }

  ngOnInit() {
    // Recuperar el usuario logueado desde localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUserId = user.id_usuario; // Asignar el ID del usuario logueado
    } else {
      // Si no hay usuario logueado, redirigir a la página de login
      this.router.navigate(['/login']);
    }
  }

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });
    this.imagen = image.webPath;
  };

  createPost() {
    if (this.titulo === '' || this.contenido === '') {
      this.presentAlert('All fields are required.');
      return;
    }

    // Guardar los datos del post, incluyendo la imagen y el ID del usuario
    this.bd.addPost(this.titulo, this.contenido, this.imagen, this.currentUserId).then(() => {
      this.router.navigate(['/foro']);  // Redirigir al foro tras crear el post
    });
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
