import { Component, OnInit } from '@angular/core';
import { NavigationExtras,Router,ActivatedRoute } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  usuario: any = {}; 
  posts: any[] = []; 
  guias: any[] = [];
  imagen: any;

  constructor(private router: Router, private bd: SevicebdService, private storage: NativeStorage) { 

 }
  ngOnInit() {
    this.cargarDatosUsuario();
  }

  ionViewWillEnter() {
    this.cargarDatosUsuario();
  }


  // Cargar datos del usuario desde la base de datos o el almacenamiento
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
            this.loadPostsAndGuides(user.id_usuario);
          });
        }
      });
    } else {
      // Si no hay usuario guardado, redirigir al login o manejar el error
      this.router.navigate(['/login']);
    }
  }

  loadPostsAndGuides(id_usuario: number) {
    this.bd.getPostsByUser(id_usuario).then(posts => {
      this.posts = posts;
    });
  
    this.bd.getGuiasByUser(id_usuario).then(guias => {
      this.guias = guias;
    });
  }
  



  modperfil(id_usuario: number){
    const navigationExtras = {
      state: {
        userId: id_usuario
      }
    };
    this.router.navigate(['/modperfil'], navigationExtras);
  }

   // Navegar a la página del post
   goToPost(id_post: number) {
    const navigationExtras = {
      state: {
        postId: id_post
      }
    };
    this.router.navigate(['/ejemplo-post'], navigationExtras);
  }

  // Navegar a la página de la guía
  goToGuide(id_guia: number) {
    const navigationExtras = {
      state: {
        guiaId: id_guia
      }
    };
    this.router.navigate(['/ejemplo-guias'], navigationExtras);
  }

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });
    this.imagen = image.webPath;
    this.cambiarFoto();
    this.cargarDatosUsuario();
  };

  cambiarFoto() {
    if (this.imagen) {
      // Lógica para actualizar la imagen de perfil en la base de datos
      // Por ejemplo, puedes llamar a un servicio que suba la imagen al servidor o actualice el campo foto_perfil del usuario.
      
      // Ejemplo de código para subir la foto al servidor
      this.bd.updateFotoPerfil(this.usuario.id_usuario, this.imagen).then(() => {
        console.log('Foto de perfil actualizada correctamente.');
        // Puedes agregar lógica aquí para actualizar la vista del perfil, o mostrar una notificación
      }).catch((err: any) => {
        console.error('Error al actualizar la foto de perfil:', err);
      });
    } else {
      console.error('No hay imagen seleccionada.');
    }
  }





}
