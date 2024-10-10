import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';

@Component({
  selector: 'app-postejemplo',
  templateUrl: './postejemplo.page.html',
  styleUrls: ['./postejemplo.page.scss'],
})
export class PostejemploPage implements OnInit {

  post: any = {};
  currentUserId: number = 0;
  isAdmin: boolean = false;

  constructor(private route: ActivatedRoute, private bd: SevicebdService,private alertController: AlertController, private router: Router,private storage: Storage) { }

  async ngOnInit() {
    const postId = this.route.snapshot.paramMap.get('id');
    this.loadPost(postId);

    this.currentUserId = await this.storage['get']('user_id');
    this.isAdmin = await this.storage['get']('is_admin');
  }

  loadPost(postId: any) {
    this.bd.getPostById(postId).then(post => {
      this.post = post;
    });
  }

  canDeletePost() {
    return this.post.user_id === this.currentUserId || this.isAdmin;
  }

  async confirmDeletePost() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas eliminar este post?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Eliminar',
          handler: () => {
            this.deletePost();
          }
        }
      ]
    });

    await alert.present();
  }

  deletePost() {
    this.bd.deletePost(this.post.id_post).then(() => {
      this.router.navigate(['/foro']);  // Navigate back to home page after deletion
    });
  }

}
