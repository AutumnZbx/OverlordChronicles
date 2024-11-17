import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ToastController } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { Clipboard } from '@capacitor/clipboard';
import { Toast } from '@capacitor/toast';
@Component({
  selector: 'app-ejemplo-guias',
  templateUrl: './ejemplo-guias.page.html',
  styleUrls: ['./ejemplo-guias.page.scss'],
})
export class EjemploGuiasPage implements OnInit {

  guias : any;
  comentario: string = '';
  showCommentInput: boolean = false;
  comentarios: any[] = [];
  usuario: any = {}; 

  constructor(private router: Router, private activedrouter:ActivatedRoute, private bd: SevicebdService,  private storage: NativeStorage,private toastController: ToastController) { }

  ngOnInit() {
    this.cargarDatosUsuario();
    // Verificar si el postId fue pasado en el estado de navegación
    if (this.router.getCurrentNavigation()?.extras?.state?.['guiaId']) {
      const guiaId = this.router.getCurrentNavigation()?.extras?.state?.['guiaId'];
      this.cargarPost(guiaId); // Cargar el post con el id
    } else {
      // Si no se recibió el id, mostramos un mensaje de error
      this.guias = {
        id_guia: 0,
        titulo: 'Guide not found',
        contenido: 'No content available for this guide.',
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

  async cargarPost(id_guia: number) {
    try {
      // Llamamos a la función del servicio para obtener el post por su id
      const guiaCargada = await this.bd.getGuideById(id_guia);
      if (guiaCargada) {
        this.guias = guiaCargada; // Guardamos el post en la variable
      } else {
        this.guias = {
          id_guia: 0,
          titulo: 'Guide not found',
          contenido: 'This guide does not exist or has been deleted.',
          imagen: null
        };
      }
    } catch (error) {
      console.error('Error loading the guide: ', error);
      this.guias = {
        id_guia: 0,
        titulo: 'Error',
        contenido: 'There was an error trying to load the guide.',
        imagen: null
      };
    }
  }


  usuarioEsAutorOAdmin(): boolean {
    return (
      this.usuario.id_usuario === this.guias.id_usuario || // Si es el creador
      this.usuario.id_rol === 1 // O si es administrador (depende de cómo guardes el rol)
    );
  }

  irAEditarPost() {
    // Redireccionar a la página de edición del post
    this.router.navigate(['/editar-guia'], {
      state: { guiaId: this.guias.id_guia }  // Pasar el ID del post
    });
  }

  async copiarTexto() {
    if (this.guias && this.guias.contenido) {
      try {
        await Clipboard.write({
          string: this.guias.contenido
        }); 
      } catch (error) {
        console.error('Error :', error);
      }
    }
  }

  async cargarComentarios(id_guia: number) {
    try {
      this.comentarios = await this.bd.getComentariosByPGuide(id_guia);
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
        await this.bd.guardarComentario2(this.guias.id_guia, id_usuario, this.comentario);
        this.comentario = '';  
        this.showCommentInput = false; 
        this.cargarComentarios(this.guias.id_guia);  
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
      await this.bd.eliminarComentario2(id_comentario);
      this.cargarComentarios(this.guias.id_guia);  
      await this.presentToast('Comment deleted.');
    } catch (error) {
      console.error('Error deleting the comment', error);
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
