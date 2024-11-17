import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { Clipboard } from '@capacitor/clipboard';
import { ToastController } from '@ionic/angular';
import { Toast } from '@capacitor/toast';

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


  constructor(private router: Router, private activedrouter:ActivatedRoute, private bd: SevicebdService,  private storage: NativeStorage,private toastController: ToastController) { 
  }

  ngOnInit() {
    this.cargarDatosUsuario();
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state && state['postId']) {
      const postId = state['postId'];
      this.loadPost(postId); 
      this.cargarComentarios(postId);
    } else {
      this.post = {
        id_post: 0,
        titulo: 'Post not found',
        contenido: 'No content available for this post.',
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
      const postCargado = await this.bd.getPostById(id_post);
      if (postCargado) {
        this.post = postCargado; 
      } else {
        this.post = {
          id_post: 0,
          titulo: 'Post not found',
          contenido: 'This post does not exist or has been deleted.',
          imagen: null
        };
      }
    } catch (error) {
      console.error('Error loading the post: ', error);
      this.post = {
        id_post: 0,
        titulo: 'Error',
        contenido: 'There was an error trying to load the post.',
        imagen: null
      };
    }
  }

  loadPost(postId: number) {
    this.bd.getPostById(postId).then((res) => {
      this.post = res;
      // Handle displaying the content based on the category, if necessary
    }).catch((err) => {
      console.error('Error loading post:', err);
    });
  }

  usuarioEsAutorOAdmin(): boolean {
    return (
      this.usuario.id_usuario === this.post.id_usuario || // Si es el creador
      this.usuario.id_rol === 1 // O si es administrador (depende de cómo guardes el rol)
    );
  }

  irAEditarPost() {
    // Redireccionar a la página de edición del post
    this.router.navigate(['/editar-post'], {
      state: { postId: this.post.id_post }  // Pasar el ID del post
    });
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
    if (this.comentario.trim().length > 0 && this.comentario.length <= 100 && this.usuario) {
      try {
        const id_usuario = this.usuario.id_usuario;
        await this.bd.guardarComentario(this.post.id_post, id_usuario, this.comentario);
        this.comentario = '';  
        this.showCommentInput = false; 
        this.cargarComentarios(this.post.id_post);  
      } catch (error) {
        console.error('Error saving the comment', error);
      }
    } else if (this.comentario.length > 100) {
      const toast = await this.toastController.create({
        message: 'The comment cannot exceed 100 characters.',
        duration: 2000,
        position: 'bottom'
      });
      await toast.present();
    }
  }
  

  async deleteComment(id_comentario: number) {
    try {
      await this.bd.eliminarComentario(id_comentario);
      this.cargarComentarios(this.post.id_post);  
      await this.presentToast('Comment deleted.');
    } catch (error) {
      console.error('Error deleting the comment', error);
    }
  }


  async copiarTexto() {
    if (this.post && this.post.contenido) {
      try {
        await Clipboard.write({
          string: this.post.contenido
        }); 
      } catch (error) {
        console.error('Error :', error);
      }
    }
  }
  async presentToast(message: string) {
    await Toast.show({
      text: message,
      duration: 'short', // 'short' o 'long'
      position: 'bottom', // 'top', 'center', 'bottom'
    });
  }

}
