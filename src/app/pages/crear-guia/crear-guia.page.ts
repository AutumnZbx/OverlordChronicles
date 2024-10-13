import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-crear-guia',
  templateUrl: './crear-guia.page.html',
  styleUrls: ['./crear-guia.page.scss'],
})
export class CrearGuiaPage implements OnInit {

  titulo: string = '';
  contenido: string = '';
  imagen: any;
  currentUserId: number = 0;

  constructor(private router: Router, private alertController: AlertController, private sanitizer: DomSanitizer, private bd:SevicebdService,private storage: NativeStorage) { }

  ngOnInit() {
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
  
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    this.imagen = image.webPath;
  
    
  };

  createGuide() {
    if (this.titulo === '' || this.contenido === '') {
      alert('All fields are required.');
      return;
    }

    // Guardar los datos del post, incluyendo la imagen y el ID del usuario
    this.bd.addGuia(this.titulo, this.contenido, this.imagen, this.currentUserId).then(() => {
      this.router.navigate(['/guias']);  // Redirigir al foro tras crear el post
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
