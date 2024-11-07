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

    // Variables de error para validar los campos
    tituloError: boolean = false;
    contenidoError: boolean = false;
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
  

  // Validación para el título
  validarTitulo() {
    this.tituloError = this.titulo.length < 10 || this.titulo.length > 50;
  }

  // Validación para el contenido
  validarContenido() {
    this.contenidoError = this.contenido.length < 10 || this.contenido.length > 250;
  }

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });
    this.imagen = image.webPath;
  
    
  };

  async createPost() {
    this.validarTitulo();
    this.validarContenido();

    if (this.tituloError || this.contenidoError) {
      this.presentAlert('Please ensure all fields meet the requirements.');
      return;
    }

    this.bd.addGuide(this.titulo, this.contenido, this.imagen, this.currentUserId).then(() => {
      this.router.navigate(['/guias'], { state: { refresh: true } });
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
