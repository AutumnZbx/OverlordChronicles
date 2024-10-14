import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { Clipboard } from '@capacitor/clipboard';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-ejemplo-post',
  templateUrl: './ejemplo-post.page.html',
  styleUrls: ['./ejemplo-post.page.scss'],
})
export class EjemploPostPage implements OnInit {

  post: any;
  comentario: string = '';
  showCommentInput: boolean = false;
  comentarios: any[] = [];
  usuario: any = {}; 


  constructor(private router: Router, private activedrouter:ActivatedRoute, private bd: SevicebdService,  private storage: NativeStorage,private clipboard: Clipboard,private toastController: ToastController) { 
  }

  ngOnInit() {
    this.cargarDatosUsuario();
    // Verificar si el postId fue pasado en el estado de navegación
    if (this.router.getCurrentNavigation()?.extras?.state?.['postId']) {
      const postId = this.router.getCurrentNavigation()?.extras?.state?.['postId'];
      this.cargarPost(postId); // Cargar el post con el id
      this.cargarComentarios(postId);
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

  cargarDatosUsuario() {
    // Verificar si hay un usuario guardado en localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      // Parsear el usuario guardado
      const user = JSON.parse(storedUser);
      // Consultar por el estado de la base de datos
      this.bd.dbReady().subscribe(data => {
        if (data) {
          // Obtener los datos del usuario de la base de datos
          this.bd.getUsuarioById(user.id_usuario).then(res => {
            this.usuario = res;
          });
        }
      });
    } else {
      // Si no hay usuario guardado, redirigir al login o manejar el error
      this.router.navigate(['/login']);
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

  async cargarComentarios(id_post: number) {
    try {
      this.comentarios = await this.bd.getComentariosByPost(id_post);
    } catch (error) {
      console.error('Error al cargar comentarios', error);
    }
  }

  toggleCommentInput() {
    this.showCommentInput = !this.showCommentInput;
  }

  async submitComment() {
    // Verificar si el comentario no está vacío y no excede los 100 caracteres
    if (this.comentario.trim().length > 0 && this.comentario.length <= 100 && this.usuario) {
      try {
        // Obtener el id del usuario logueado
        const id_usuario = this.usuario.id_usuario;
        await this.bd.guardarComentario(this.post.id_post, id_usuario, this.comentario);
        this.comentario = '';  // Limpiar el campo de comentario
        this.showCommentInput = false;  // Ocultar el campo de comentarios
        this.cargarComentarios(this.post.id_post);  // Recargar los comentarios
      } catch (error) {
        console.error('Error al guardar el comentario', error);
      }
    } else if (this.comentario.length > 100) {
      // Mensaje de advertencia si se excede el límite
      const toast = await this.toastController.create({
        message: 'El comentario no puede exceder los 100 caracteres.',
        duration: 2000,
        position: 'bottom'
      });
      await toast.present();
    }
  }

  async deleteComment(id_comentario: number) {
    try {
      await this.bd.eliminarComentario(id_comentario);
      this.cargarComentarios(this.post.id_post);  // Recargar los comentarios
    } catch (error) {
      console.error('Error al eliminar el comentario', error);
    }
  }


  async copiarTexto() {
    if (this.post && this.post.contenido) {
      try {
        await Clipboard.write({
          string: this.post.contenido
        });
        
        // Mostrar el mensaje de "Texto copiado"
        const toast = await this.toastController.create({
          message: 'Texto copiado',
          duration: 2000,  // 2 segundos
          position: 'bottom'  // Aparecerá en la parte inferior
        });
        await toast.present();
  
      } catch (error) {
        console.error('Error al copiar el texto:', error);
      }
    }
  }


}
