import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
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

  constructor(private router: Router, private activedroute: ActivatedRoute, private bd:SevicebdService,private storage: NativeStorage, private alertCtrl: AlertController) { 
   }
    ngOnInit() {
      this.loadPosts();
    }

    loadPosts() {
      this.bd.getAllPosts().then(result => {
        this.post = [];
        for (let i = 0; i < result.rows.length; i++) {
          this.post.push(result.rows.item(i));
        }
      });
    }
  
    // Navigate to the Create Post page
    createPost() {
      this.router.navigate(['/crear-post']);
    }

    goToPost(post: any) {
      const navigationExtras = {
        state: {
          postId: post.id_post // Solo enviamos el id_post
        }
      };
      this.router.navigate(['/ejemplo-post'], navigationExtras);
    }

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

