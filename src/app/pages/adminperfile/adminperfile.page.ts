import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';

@Component({
  selector: 'app-adminperfile',
  templateUrl: './adminperfile.page.html',
  styleUrls: ['./adminperfile.page.scss'],
})
export class AdminperfilePage implements OnInit {
  users: any[] = [];

  constructor(private router:Router, private alertController: AlertController, private toastController: ToastController,private activedroute: ActivatedRoute,private bd:SevicebdService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.bd.getAllUsers().then(result => {
      this.users = [];
      for (let i = 0; i < result.rows.length; i++) {
        this.users.push(result.rows.item(i));
      }
    });
  }

  // Confirm deletion of the user
  async confirmDeleteUser(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this user?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteUser(id);
          }
        }
      ]
    });

    await alert.present();
  }

  // Delete the user and reload the list
  deleteUser(id_usuario: any) {
    this.bd.eliminarUsuario(id_usuario).then(() => {
      this.loadUsers(); // Reload users after deletion
    });
  }



  perfil(){
    this.router.navigate(['/perfil']);
  }

}
