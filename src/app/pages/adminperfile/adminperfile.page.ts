import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { Usuarios } from 'src/app/services/usuarios';

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

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position: 'bottom'
    });
    await toast.present();
  }

  loadUsers() {
    this.bd.getAllUsers().then(result => {
      this.users = [];
      for (let i = 0; i < result.rows.length; i++) {
        this.users.push(result.rows.item(i));
      }
    });
  }


  // Function to make the user an admin
  async makeAdmin(id_usuario: number) {
    const user = this.users.find(u => u.id_usuario === id_usuario);
  
    if (user && user.id_rol === 1) { // Si el usuario ya es admin
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Este usuario ya es administrador.',
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Confirmar',
        message: '¿Estás seguro de que quieres convertir a este usuario en administrador?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Convertir en Admin',
            handler: () => {
              this.bd.updateUserRole(id_usuario, 1).then(() => {
                this.presentToast('El usuario ha sido convertido en administrador.');
                this.loadUsers(); // Recargar usuarios después de la actualización
              });
            },
          },
        ],
      });
  
      await alert.present();
    }
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

}
