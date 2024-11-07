import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-editar-post',
  templateUrl: './editar-post.page.html',
  styleUrls: ['./editar-post.page.scss'],
})
export class EditarPostPage implements OnInit {
  post: any = {
    id_post: null,
    titulo: '',
    contenido: '',
    imagen: ''
  };
  imagen: any;

  constructor(
    private router: Router,
    private activedRoute: ActivatedRoute,
    private bd: SevicebdService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    // Obtener el ID del post desde el estado de la navegación
    if (this.router.getCurrentNavigation()?.extras?.state?.['postId']) {
      const postId = this.router.getCurrentNavigation()?.extras?.state?.['postId'];
      this.cargarPost(postId); 
    } else {
      this.mostrarToast('Post not found');
    }
  }

  // Cargar los detalles del post a editar
  async cargarPost(id_post: number) {
    try {
      const postCargado = await this.bd.getPostById(id_post);
      if (postCargado) {
        this.post = postCargado;  // Asignar el post al objeto
      } else {
        this.mostrarToast('Post not found');
      }
    } catch (error) {
      this.mostrarToast('Error load post');
      console.error('Error al cargar el post', error);
    }
  }


 // Subir imagen
async takePicture() {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.Uri
  });

  this.imagen = image.webPath; // Mostrar la imagen en el HTML
  this.post.imagen = image.webPath; // Asignar la imagen al objeto post
}

borrarImagen() {
  this.post.imagen = ''; // Eliminar la imagen del objeto post
}

  // Guardar los cambios realizados en el post
  async guardarCambios() {
    if (this.post.titulo.trim() && this.post.contenido.trim()) {
      try {
        // Asegúrate de pasar this.post.imagen al método actualizarPost
        await this.bd.actualizarPost(this.post.id_post, this.post.titulo, this.post.contenido, this.post.imagen);
        this.mostrarToast('Post update succesful');
        this.router.navigate(['/home']);  // Redirigir a la página del foro
      } catch (error) {
        this.mostrarToast('Error updating post');
        console.error('Error al actualizar el post', error);
      }
    } else {
      this.mostrarToast('Title and content are obligatory');
    }
  }

  // Mostrar un toast para retroalimentación del usuario
  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

}