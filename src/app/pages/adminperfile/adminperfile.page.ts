import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { Usuarios } from 'src/app/services/usuarios';
import { Toast } from '@capacitor/toast';
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
  usuario: any = {};  // Variable para almacenar los datos del usuario actual
  unreadNotifications: boolean = false;

  constructor(private router:Router, private alertController: AlertController, private toastController: ToastController,private activedroute: ActivatedRoute,private bd:SevicebdService,private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadUsers();
    this.cargarDatosUsuario();
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

  checkUnreadNotifications() {
    const userId = this.usuario.id_usuario;
  
    // Fetch unread notifications
    this.bd.getUnreadNotifications(userId).then((notifications) => {
      this.unreadNotifications = notifications.length > 0; // true if there are unread notifications
    });
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
      header: 'Comfirm',
      message: 'Are you sure you want to make this user an administrator?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Make admin',
          handler: async () => {
            await this.bd.updateUserRole(id_usuario, 1);
            await this.bd.createNotification(
              1, // tipo de notificación
              'Promotion to Administrator', // título
              'You have been promoted to the role of administrator.', // contenido
              0, // estado (por ejemplo, 0 para "no leído")
              id_usuario // id del usuario
            );
            this.presentToast('The user has been made an administrator.');
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
    header: 'Confirm',
    message: 'Are you sure you want to remove the administrator role from this user?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
      },
      {
        text: 'Drop admin',
        handler: async () => {
          await this.bd.updateUserRole(id_usuario, 2);
          await this.bd.createNotification(
            3, // tipo de notificación (por ejemplo, 3 para eliminación de admin)
            'Administrator Role Removed', // título
            'Your administrator role has been revoked.', // contenido
            0, // estado (no leído)
            id_usuario // id del usuario
          );
          this.presentToast('The administrator role has been removed.');
          this.loadUsers();
        },
      },
    ],
  });
  await alert.present();
}


  async confirmBlockUser(id_usuario: number) {
    const alert = await this.alertController.create({
      header: 'Block user',
      inputs: [
        { name: 'reason', type: 'text', placeholder: 'Reason' },
        { name: 'days', type: 'number', placeholder: 'Duration in days', min: 1,},
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: async (data) => {
            if (data.days < 1) {
              await this.presentToast('Duration must be at least 1 day.');
              return false; // Aseguramos que se devuelve un valor aquí
            }
            await this.bd.updateUserRole(id_usuario, 3);
            await this.bd.createNotification(
              2, // tipo de notificación
              'Account Blocked', // título
              `You have been blocked for ${data.days} days. Motive: ${data.reason}`, // contenido
              0, // estado (por ejemplo, 0 para "no leído")
              id_usuario // id del usuario
            );
            this.presentToast(`User blocked for ${data.days} days. Motive: ${data.reason}`);
            this.loadUsers();
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  // Función para desbloquear a un usuario
async unblockUser(id_usuario: number) {
  const alert = await this.alertController.create({
    header: 'Confirm',
    message: 'Are you sure you want to unblock this user?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
      },
      {
        text: 'Unblock',
        handler: async () => {
          await this.bd.updateUserRole(id_usuario, 2);
          await this.bd.createNotification(
            4, // tipo de notificación (por ejemplo, 4 para desbloqueo)
            'Account Unlocked', // título
            'Your account has been restored and you can continue using the platform.', // contenido
            0, // estado (no leído)
            id_usuario // id del usuario
          );
          this.presentToast('User has been unlocked.');
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

  // Navigate to the notifications page
  goToNotifications() {
    this.router.navigate(['/notificaciones']);
  }

}
