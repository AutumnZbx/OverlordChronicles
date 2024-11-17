import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { Toast } from '@capacitor/toast';
@Component({
  selector: 'app-guias',
  templateUrl: './guias.page.html',
  styleUrls: ['./guias.page.scss'],
})
export class GuiasPage {

  post: any[] = [];
  usuario: any = {};
  unreadNotifications: boolean = false;

  constructor(private router: Router, private activedroute: ActivatedRoute, private bd:SevicebdService,private storage: NativeStorage, private alertCtrl: AlertController) { 
    
   }
   

  ionViewWillEnter() {
    this.cargarDatosUsuario(); 
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
    this.bd.getAllGuides().subscribe(guides => {
      this.post = guides;
    }, err => {
      console.error('Error al cargar las guías:', err);
    });
  }
  
  

   // Function to determine if the user can view the post
   shouldDisplayPost(post: any): boolean {
    return post.estado === 1 && post.categoria === 2|| (this.isAdmin() && post.estado === 2 && post.categoria === 2);
  }


  // Function to check if the user is an admin
  isAdmin(): boolean {
    return this.usuario.id_rol === 1;
  }
  

  async blockPost(id_post: number, id_usuario: number, titulo: string) {
    const alert = await this.alertCtrl.create({
        header: 'Block Post',
        message: 'Please provide the reason for blocking this post.',
        inputs: [
            {
                name: 'reason',
                type: 'textarea',
                placeholder: 'Reason for blocking',
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
                    if (data.reason) {
                        // Call the updatePostStatus method to update the post status and create the notification
                        this.bd.updatePostStatus(id_post, 2, id_usuario, data.reason).then(() => {
                            this.loadPosts(); // Reload posts after blocking
                            this.presentAlert("Blocked", "Post has been successfully blocked and user notified.");
                        });
                    } else {
                        this.presentAlert("Error", "Reason for blocking is required.");
                    }
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
    this.router.navigate(['/crear-guia']);
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
             this.presentToast('Guide deleted.');
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
    

}


