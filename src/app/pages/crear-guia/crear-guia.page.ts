import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-crear-guia',
  templateUrl: './crear-guia.page.html',
  styleUrls: ['./crear-guia.page.scss'],
})
export class CrearGuiaPage implements OnInit {

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

  createGuide() {
    if (this.titulo === '' || this.contenido === '') {
      alert('All fields are required.');
      return;
    }

    // Save post data including the image
    this.bd.addGuide(this.titulo, this.contenido, this.imagen).then(() => {
      this.router.navigate(['/guias']);
    });
  }
}
