import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-editar-guia',
  templateUrl: './editar-guia.page.html',
  styleUrls: ['./editar-guia.page.scss'],
})
export class EditarGuiaPage implements OnInit {
  guia: any = {
    id_guia: null,
    titulo: '',
    contenido: '',
    imagen: ''
  };
  imagen: any;
  constructor(private router: Router,
    private activedRoute: ActivatedRoute,
    private bd: SevicebdService,
    private toastController: ToastController) { }

    ngOnInit() {
      // Obtener el ID del post desde el estado de la navegación
      if (this.router.getCurrentNavigation()?.extras?.state?.['guiaId']) {
        const guiaId = this.router.getCurrentNavigation()?.extras?.state?.['guiaId'];
        this.cargarGuia(guiaId); 
      } else {
        this.mostrarToast('No se encontró la guia');
      }
    }
  
    // Cargar los detalles del post a editar
    async cargarGuia(id_guia: number) {
      try {
        const postCargado = await this.bd.getPostById(id_guia);
        if (postCargado) {
          this.guia = postCargado; 
        } else {
          this.mostrarToast('No se encontró la guia');
        }
      } catch (error) {
        this.mostrarToast('Error al cargar guia');
        console.error('Error al cargar guia', error);
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
    this.guia.imagen = image.webPath; // Asignar la imagen al objeto post
  }
  
  borrarImagen() {
    this.guia.imagen = ''; // Eliminar la imagen del objeto post
  }
  
    // Guardar los cambios realizados en el post
    async guardarCambios() {
      if (this.guia.titulo.trim() && this.guia.contenido.trim()) {
        try {
          // Asegúrate de pasar this.post.imagen al método actualizarPost
          await this.bd.actualizarGuia(this.guia.id_guia, this.guia.titulo, this.guia.contenido, this.guia.imagen);
          this.mostrarToast('Guia actualizado correctamente');
          this.router.navigate(['/guias']);  // Redirigir a la página del foro
        } catch (error) {
          this.mostrarToast('Error al actualizar guia');
          console.error('Error al actualizar guia', error);
        }
      } else {
        this.mostrarToast('El título y el contenido son obligatorios');
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