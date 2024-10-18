import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';

@Component({
  selector: 'app-foro',
  templateUrl: './foro.page.html',
  styleUrls: ['./foro.page.scss'],
})
export class ForoPage implements OnInit {

  post: any[] = [];
  usuario: any = {};  // Variable para almacenar los datos del usuario actual

  constructor(
    private router: Router, 
    private activedroute: ActivatedRoute, 
    private bd: SevicebdService,
    private storage: NativeStorage, 
    private alertCtrl: AlertController
  ) { 
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
    this.bd.getAllPosts().then(result => {
      this.post = [];
      for (let i = 0; i < result.rows.length; i++) {
        this.post.push(result.rows.item(i));
      }
    });
  }

  // Función para verificar si el usuario puede eliminar un post
  canDeletePost(post: any): boolean {
    return post.id_usuario === this.usuario.id_usuario || this.usuario.id_rol === 1;  // Si es el creador o admin (id_rol === 1)
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
              this.loadPosts(); // Recargar la lista de posts después de eliminar
            });
          },
        },
      ],
    });

    await alert.present();
  }

}
