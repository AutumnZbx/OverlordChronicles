import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';

@Component({
  selector: 'app-guias',
  templateUrl: './guias.page.html',
  styleUrls: ['./guias.page.scss'],
})
export class GuiasPage implements OnInit {

  post: any[] = [];
  usuario: any = {};
  constructor(private router: Router, private activedroute: ActivatedRoute, private bd:SevicebdService,private storage: NativeStorage, private alertCtrl: AlertController) { 
    
   }
   ngOnInit() {
    this.cargarDatosUsuario();  // Cargar los datos del usuario actual
    this.loadPosts();
  }

  ionViewWillEnter() {
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
          });
        }
      });
    } else {
      // Si no hay usuario guardado, redirigir al login o manejar el error
      this.router.navigate(['/login']);
    }
  }

  loadPosts() {
    this.bd.getAllGuides().then(result => {
      this.post = [];
      for (let i = 0; i < result.rows.length; i++) {
        let currentPost = result.rows.item(i);
        if (currentPost.categoria === 2) {  // Only add posts with categoria = 2
          this.post.push(currentPost);
        }
      }
      console.log(this.post);  // Check the loaded posts data
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
  
    

}


