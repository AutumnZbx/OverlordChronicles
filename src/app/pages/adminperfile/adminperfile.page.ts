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
  admins: any[] = [];
  normalUsers: any[] = [];
  blockedUsers: any[] = [];

  constructor(private router:Router, private alertController: AlertController, private toastController: ToastController,private activedroute: ActivatedRoute,private bd:SevicebdService) { }

  ngOnInit() {
    this.loadUsers();
  }

  ionViewWillEnter() {
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

  async loadUsers() {
    this.bd.getAllUsers().then(result => {
      this.users = [];
      for (let i = 0; i < result.rows.length; i++) {
        const user = result.rows.item(i);
        this.users.push(user);

        // Clasificar según el rol
        if (user.id_rol === 1) {
          this.admins.push(user);
        } else if (user.id_rol === 2) {
          this.normalUsers.push(user);
        } else if (user.id_rol === 3) {
          this.blockedUsers.push(user);
        }
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

  async removeAdmin(id_usuario: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Deseas quitar el rol de admin a este usuario?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: () => {
            this.bd.updateUserRole(id_usuario, 2).then(() => {
              this.presentToast('Admin ahora es usuario normal');
              this.loadUsers();
            });
          },
        },
      ],
    });
    await alert.present();
  }

  async confirmBlockUser(id_usuario: number) {
    const alert = await this.alertController.create({
      header: 'Bloquear Usuario',
      inputs: [
        {
          name: 'reason',
          type: 'text',
          placeholder: 'Razón del bloqueo',
        },
        {
          name: 'days',
          type: 'number',
          placeholder: 'Duración en días',
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: (data) => {
            // Asignar id_rol 3 para bloquear al usuario
            this.bd.updateUserRole(id_usuario, 3).then(() => {
              this.presentToast(`Usuario bloqueado por ${data.days} días`);
              this.loadUsers();
            });
          },
        },
      ],
    });
    await alert.present();
  }

  async unblockUser(id_usuario: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Deseas desbloquear este usuario?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Desbloquear',
          handler: () => {
            this.bd.updateUserRole(id_usuario, 2).then(() => {
              this.presentToast('Usuario desbloqueado');
              this.loadUsers();
            });
          },
        },
      ],
    });
    await alert.present();
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
