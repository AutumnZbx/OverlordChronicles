import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { Toast } from '@capacitor/toast';
@Component({
  selector: 'app-foro',
  templateUrl: './foro.page.html',
  styleUrls: ['./foro.page.scss'],
})
export class ForoPage  {

  post: any[] = [];
  usuario: any = {};  // Variable para almacenar los datos del usuario actual
  unreadNotifications: boolean = false;

  constructor(
    private router: Router, 
    private activedroute: ActivatedRoute, 
    private bd: SevicebdService,
    private storage: NativeStorage, 
    private alertCtrl: AlertController
  ) { 
  }

  

  ionViewWillEnter() {
    //this.bd.crearConexion();
    this.cargarDatosUsuario();  // Cargar los datos del usuario actual
    this.loadPosts();
  }

  // Cargar los datos del usuario desde localStorage o servicio
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
            this.checkUnreadNotifications();
          });
        }
      });
    } else {
      // Si no hay usuario guardado, redirigir al login o manejar el error
      this.router.navigate(['/login']);
    }
  }

  // Check for unread notifications for the user
  checkUnreadNotifications() {
    const userId = this.usuario.id_usuario;
  
    // Fetch unread notifications
    this.bd.getUnreadNotifications(userId).then((notifications) => {
      this.unreadNotifications = notifications.length > 0; // true if there are unread notifications
    });
  }
  

  // Navigate to the notifications page
  goToNotifications() {
    this.router.navigate(['/notificaciones']);
  }

  loadPosts() {
    this.bd.getAllPosts().subscribe(guides => {
      this.post = guides;
    }, err => {
      console.error('Error al cargar las guías:', err);
    });
  }
  

   // Function to determine if the user can view the post
   shouldDisplayPost(post: any): boolean {
    return post.estado === 1 && post.categoria === 1 || (this.isAdmin() && post.estado === 2  && post.categoria === 1);
  }


  // Function to check if the user is an admin
  isAdmin(): boolean {
    return this.usuario.id_rol === 1;
  }
  

  async blockPost(id_post: number, id_usuario: number, titulo: string) {
    const alert = await this.alertCtrl.create({
      header: 'Block Post',
      message: 'Please select the reason for blocking this post.',
      inputs: [
        {
          name: 'reason',
          type: 'radio',
          label: 'Inappropriate Content',
          value: 'Inappropriate Content',
        },
        {
          name: 'reason',
          type: 'radio',
          label: 'Spam',
          value: 'Spam',
        },
        {
          name: 'reason',
          type: 'radio',
          label: 'Copyright Violation',
          value: 'Copyright Violation',
        },
        {
          name: 'reason',
          type: 'radio',
          label: 'Offensive Language',
          value: 'Offensive Language',
        },
        {
          name: 'reason',
          type: 'radio',
          label: 'Other',
          value: 'Other',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Block',
          handler: (data) => {
            if (data) {
              // Handle the case when a reason is selected
              const fullMessage = `${data}. You can update the post from your profile.`;
              this.bd.updatePostStatus(id_post, 2, id_usuario, fullMessage).then(() => {
                this.loadPosts(); // Reload posts
                this.presentAlert(
                  'Blocked',
                  `Post has been successfully blocked for the following reason: "${data}". The user has been notified.`
                );
              });
              return true; // Successfully handled
            } else {
              // Handle the case when no reason is selected
              this.presentAlert('Error', 'You must select a reason for blocking the post.');
              return false; // Indicate failure
            }
          },
        },
      ],
    });
  
    await alert.present();
  }
  
  

async unblockPost(id_post: number,id_usuario: number, titulo: string) {
  const alert = await this.alertCtrl.create({
    header: 'Unblock Post',
    message: 'Are you sure you want to unblock this post?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
      },
      {
        text: 'Unblock',
        handler: () => {
          this.bd.updatePostStatus(id_post, 1, id_usuario).then(() => {
            this.loadPosts(); // Recargar lista de posts
            this.presentToast('Post unblocked successfully.');
          });
        },
      },
    ],
  });

  await alert.present();
}
  


  // Función para verificar si el usuario puede eliminar un post
  canDeletePost(post: any): boolean {
    return post.id_usuario === this.usuario.id_usuario;  // Si es el creador o admin (id_rol === 1)
  }

  // Navegar a la página de creación de post
  createPost() {
    this.router.navigate(['/crear-post']);
  }

  goToPost(post: any) {
    const navigationExtras = {
      state: {
        postId: post.id_post  // Solo enviamos el id_post
      }
    };
    this.router.navigate(['/ejemplo-post'], navigationExtras);
  }

  // Borrar el post seleccionado
  async deletePost(id_post: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this post?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            // Lógica para borrar el post de la base de datos
            this.bd.deletePost(id_post).then(() => {
               this.presentToast('Post deleted.');
              this.loadPosts(); // Recargar la lista de posts después de eliminar
            });
          },
        },
      ],
    });

    await alert.present();
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
  async presentToast(message: string) {
    await Toast.show({
      text: message,
      duration: 'short', // 'short' o 'long'
      position: 'bottom', // 'top', 'center', 'bottom'
    });
  }

  irPerfil() {
    this.router.navigate(['/perfil']);
  }


}
