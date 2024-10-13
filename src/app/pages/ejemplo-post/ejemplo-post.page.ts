import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SevicebdService } from 'src/app/services/sevicebd.service';

@Component({
  selector: 'app-ejemplo-post',
  templateUrl: './ejemplo-post.page.html',
  styleUrls: ['./ejemplo-post.page.scss'],
})
export class EjemploPostPage implements OnInit {

  post: any;
  comentario: string = '';
  showCommentInput: boolean = false;
  comentarios: any[] = [
    { id: 1, mensaje: 'Gran post, muchas gracias!', usuario: 'Usuario1' },
    { id: 2, mensaje: 'Me encantó esta publicación', usuario: 'Usuario2' },
    // Agrega más comentarios
  ];

  constructor(private router: Router, private activedrouter:ActivatedRoute, private bd: SevicebdService) { 
  }

  ngOnInit() {
    // Verificar si el postId fue pasado en el estado de navegación
    if (this.router.getCurrentNavigation()?.extras?.state?.['postId']) {
      const postId = this.router.getCurrentNavigation()?.extras?.state?.['postId'];
      this.cargarPost(postId); // Cargar el post con el id
    } else {
      // Si no se recibió el id, mostramos un mensaje de error
      this.post = {
        id_post: 0,
        titulo: 'Post no encontrado',
        contenido: 'No hay contenido disponible para este post.',
        imagen: null
      };
    }
  }

  async cargarPost(id_post: number) {
    try {
      // Llamamos a la función del servicio para obtener el post por su id
      const postCargado = await this.bd.getPostById(id_post);
      if (postCargado) {
        this.post = postCargado; // Guardamos el post en la variable
      } else {
        this.post = {
          id_post: 0,
          titulo: 'Post no encontrado',
          contenido: 'Este post no existe o ha sido eliminado.',
          imagen: null
        };
      }
    } catch (error) {
      console.error('Error al cargar el post: ', error);
      this.post = {
        id_post: 0,
        titulo: 'Error',
        contenido: 'Hubo un error al intentar cargar el post.',
        imagen: null
      };
    }
  }

  toggleCommentInput() {
    this.showCommentInput = !this.showCommentInput;
  }

  
  submitComment() {
    if (this.comentario.length > 0) {
      // Lógica para enviar el comentario
      console.log('Comentario enviado:', this.comentario);

      // Añadir el nuevo comentario a la lista
      this.comentarios.push({
        id: this.comentarios.length + 1, // Generar un ID simple
        mensaje: this.comentario,
        usuario: 'UsuarioActual'  // Simula el nombre del usuario actual
      });

      // Limpiar el comentario después de enviarlo
      this.comentario = '';
      this.showCommentInput = false; // Ocultar el input de nuevo
    } else {
      console.log('El comentario está vacío');
    }
  }

  deleteComment(id: number) {
    // Lógica para eliminar el comentario
    this.comentarios = this.comentarios.filter(comentario => comentario.id !== id);
    console.log('Comentario eliminado:', id);
  }

  

}
