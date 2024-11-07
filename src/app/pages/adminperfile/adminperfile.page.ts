import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  constructor(private router:Router, private alertController: AlertController, private toastController: ToastController,private activedroute: ActivatedRoute,private bd:SevicebdService,private changeDetectorRef: ChangeDetectorRef) { }

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

  async loadUsers() {
    this.admins = [];
    this.normalUsers = [];
    this.blockedUsers = [];
    
    this.bd.getAllUsers().then(result => {
      for (let i = 0; i < result.rows.length; i++) {
        const user = result.rows.item(i);
        if (user.id_rol === 1) {
          this.admins.push(user);
        } else if (user.id_rol === 2) {
          this.normalUsers.push(user);
        } else if (user.id_rol === 3) {
          this.blockedUsers.push(user);
        }
      }
      this.changeDetectorRef.detectChanges(); // Forzar la actualización manual
    });
  }
  

  // Function to make the user an admin
  async makeAdmin(id_usuario: number) {
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
          handler: async () => {
            await this.bd.updateUserRole(id_usuario, 1);
            await this.bd.createNotification(
              1, // tipo de notificación
              'Promoción a Administrador', // título
              'Has sido promovido al rol de administrador.', // contenido
              0, // estado (por ejemplo, 0 para "no leído")
              id_usuario // id del usuario
            );
            this.presentToast('El usuario ha sido convertido en administrador.');
            this.loadUsers();
          },
        },
      ],
    });
    await alert.present();
  }
  

  // Función para quitar el rol de administrador
async removeAdmin(id_usuario: number) {
  const alert = await this.alertController.create({
    header: 'Confirmar',
    message: '¿Estás seguro de que quieres quitar el rol de administrador a este usuario?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
      },
      {
        text: 'Quitar Admin',
        handler: async () => {
          await this.bd.updateUserRole(id_usuario, 2);
          await this.bd.createNotification(
            3, // tipo de notificación (por ejemplo, 3 para eliminación de admin)
            'Rol de Administrador Removido', // título
            'Tu rol de administrador ha sido revocado.', // contenido
            0, // estado (no leído)
            id_usuario // id del usuario
          );
          this.presentToast('El rol de administrador ha sido removido.');
          this.loadUsers();
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
        { name: 'reason', type: 'text', placeholder: 'Razón del bloqueo' },
        { name: 'days', type: 'number', placeholder: 'Duración en días' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: async (data) => {
            await this.bd.updateUserRole(id_usuario, 3);
            await this.bd.createNotification(
              2, // tipo de notificación
              'Cuenta Bloqueada', // título
              `Has sido bloqueado por ${data.days} días. Motivo: ${data.reason}`, // contenido
              0, // estado (por ejemplo, 0 para "no leído")
              id_usuario // id del usuario
            );
            this.presentToast(`Usuario bloqueado por ${data.days} días`);
            this.loadUsers();
          },
        },
      ],
    });
    await alert.present();
  }

  // Función para desbloquear a un usuario
async unblockUser(id_usuario: number) {
  const alert = await this.alertController.create({
    header: 'Confirmar',
    message: '¿Estás seguro de que quieres desbloquear a este usuario?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
      },
      {
        text: 'Desbloquear',
        handler: async () => {
          await this.bd.updateUserRole(id_usuario, 2);
          await this.bd.createNotification(
            4, // tipo de notificación (por ejemplo, 4 para desbloqueo)
            'Cuenta Desbloqueada', // título
            'Tu cuenta ha sido restaurada y puedes continuar usando la plataforma.', // contenido
            0, // estado (no leído)
            id_usuario // id del usuario
          );
          this.presentToast('El usuario ha sido desbloqueado.');
          this.loadUsers();
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
