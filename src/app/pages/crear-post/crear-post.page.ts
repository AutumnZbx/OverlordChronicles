import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { SevicebdService } from 'src/app/services/sevicebd.service';

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

  constructor(private router: Router, private alertController: AlertController, private sanitizer: DomSanitizer, private bd:SevicebdService) { }

  ngOnInit() {
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

  createPost() {
    if (this.titulo === '' || this.contenido === '') {
      alert('All fields are required.');
      return;
    }

    // Save post data including the image
    this.bd.addPost(this.titulo, this.contenido, this.imagen).then(() => {
      this.router.navigate(['/foro']);
    });
  }
}
