import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Camera, CameraResultType } from '@capacitor/camera';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Toast } from '@capacitor/toast';
@Component({
  selector: 'app-crear-post',
  templateUrl: './crear-post.page.html',
  styleUrls: ['./crear-post.page.scss'],
})
export class CrearPostPage implements OnInit {
  titulo: string = '';
  contenido: string = '';
  imagen: any;
  currentUserId: number = 0;

  // Variables de error para validar los campos
  tituloError: boolean = false;
  contenidoError: boolean = false;

  constructor(private router: Router, private alertController: AlertController, private sanitizer: DomSanitizer, private bd: SevicebdService, private storage: NativeStorage) { }

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUserId = user.id_usuario;
    } else {
      this.router.navigate(['/login']);
    }
  }

  // Validación para el título
  validarTitulo() {
    this.tituloError = this.titulo.length < 10 || this.titulo.length > 50;
  }

  // Validación para el contenido
  validarContenido() {
    this.contenidoError = this.contenido.length < 10 || this.contenido.length > 250;
  }

  // Subir imagen
  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });
    this.imagen = image.webPath;
  }

  // Crear el post después de validar
  async createPost() {
    this.validarTitulo();
    this.validarContenido();

    if (this.tituloError || this.contenidoError) {
      this.presentAlert('Please ensure all fields meet the requirements.');
      return;
    }

    this.bd.addPost(this.titulo, this.contenido, this.imagen, this.currentUserId).then(() => {
      this.router.navigate(['/foro'], { state: { refresh: true } });
       this.presentToast('Post created.');
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
  async presentToast(message: string) {
    await Toast.show({
      text: message,
      duration: 'short', // 'short' o 'long'
      position: 'bottom', // 'top', 'center', 'bottom'
    });
  }
}
