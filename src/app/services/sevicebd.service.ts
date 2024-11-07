import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, Observable} from 'rxjs';
import { AlertController, Platform } from '@ionic/angular';
import { Rol } from './rol';
import { Usuarios } from './usuarios';
import { Post } from './post';
import { Guias } from './guias';
import { Comentarios } from './comentarios';
import { Comentario2 } from './comentario2';

@Injectable({
  providedIn: 'root'
})
export class SevicebdService {
  //creo mi variable de conexión a Base de Datos
  public database!: SQLiteObject;

  // Variables de eliminación de tablas
  borrarTablaComentario2: string = "DROP TABLE IF EXISTS comentario2;";
  borrarTablaComentarios: string = "DROP TABLE IF EXISTS comentario;";
  borrarTablaObjetos: string = "DROP TABLE IF EXISTS objetos;";
  borrarTablaPersonajes: string = "DROP TABLE IF EXISTS personajes;";
  borrarTablaGuias: string = "DROP TABLE IF EXISTS guias;";
  borrarTablaPost: string = "DROP TABLE IF EXISTS post;";
  borrarTablaUsuarios: string = "DROP TABLE IF EXISTS usuario;";
  borrarTablaRol: string = "DROP TABLE IF EXISTS rol;";
  borrarTablaNotificacion: string = "DROP TABLE IF EXISTS notificacion;";

  //variables de creación de tablas
  tablaRol: string = "CREATE TABLE IF NOT EXISTS rol (id_rol INTEGER PRIMARY KEY AUTOINCREMENT, nombre_rol TEXT NOT NULL UNIQUE);";

  tablaUsuarios: string = "CREATE TABLE IF NOT EXISTS usuario (id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,nombre_usuario VARCHAR(15) UNIQUE NOT NULL, email VARCHAR(50) UNIQUE NOT NULL, password VARCHAR(100) NOT NULL, foto_perfil BLOB, id_rol INTEGER NOT NULL, FOREIGN KEY(id_rol) REFERENCES rol(id_rol));";

  tablaPost: string = "CREATE TABLE IF NOT EXISTS post (id_post INTEGER PRIMARY KEY AUTOINCREMENT,categoria INTEGER NOT NULL, titulo TEXT NOT NULL, contenido TEXT NOT NULL, imagen BLOB , fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP, estado INTEGER NOT NULL, id_usuario INTEGER NOT NULL, FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE);";

  tablaGuias: string = "CREATE TABLE IF NOT EXISTS guias (id_guia INTEGER PRIMARY KEY AUTOINCREMENT,titulo TEXT NOT NULL, contenido TEXT NOT NULL, imagen BLOB , fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP, id_usuario INTEGER NOT NULL, FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE);";

  tablaComentatios: string= "CREATE TABLE IF NOT EXISTS comentario (id_comentario INTEGER PRIMARY KEY AUTOINCREMENT ,id_post INTEGER NOT NULL,id_usuario INTEGER NOT NULL,mensaje TEXT NOT NULL,fecha DATETIME DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY (id_post) REFERENCES post(id_post) ON DELETE CASCADE,FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE);"

  tablaComentarios: string= "CREATE TABLE IF NOT EXISTS comentario2 (id_comentario INTEGER PRIMARY KEY AUTOINCREMENT ,id_guia INTEGER NOT NULL,id_usuario INTEGER NOT NULL,mensaje TEXT NOT NULL,fecha DATETIME DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY (id_guia) REFERENCES guias(id_guias) ON DELETE CASCADE,FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE);"

  tablaNotificacion: string = "CREATE TABLE IF NOT EXISTS notificacion (id_notificacion INTEGER PRIMARY KEY AUTOINCREMENT, tipo INTEGER NOT NULL, titulo TEXT NOT NULL, contenido TEXT NOT NULL, estado INTEGER NOT NULL, fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP, id_usuario INTEGER NOT NULL, FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE);";

  rolesApp: string = "INSERT OR IGNORE INTO rol (id_rol, nombre_rol) VALUES (1, 'Admin'); INSERT OR IGNORE INTO rol (id_rol, nombre_rol) VALUES (2, 'Usuario');  INSERT OR IGNORE INTO rol (id_rol, nombre_rol) VALUES (3, 'bloqueado');"

  usuariosApp: string = "INSERT or IGNORE INTO usuario (nombre_usuario,email,password,foto_perfil,id_rol) VALUES ('Admin','admin','admin','assets/images/alain_thumb.png','1');"

  postApp: string = "INSERT or IGNORE INTO post (titulo,contenido,imagen,id_usuario)VALUES ('Welcome to Overlord Chronicles','Hello and welcome to the community! We are excited to have you here! In this app, you’ll find a wide variety of content created to enhance your experience and help you stay informed and engaged with everything that’s happening.  Welcome aboard, and enjoy the adventure!','assets/images/header2.png','1');"

  guiaApp: string = "INSERT or IGNORE INTO guias (titulo,contenido,imagen,id_usuario)VALUES ('Forum Guidelines: Respect and Community Standards','To ensure our community remains a friendly and welcoming space for everyone, we’ve established some important guidelines for interacting with others and sharing content in the forum. Please read through these rules carefully and help us maintain a positive environment! Respect Others  No Explicit or Inappropriate Content  Stay On Topic  Contribute Positively ','assets/images/welcome.png','1');"



  //observables para guardar las consultas de las tablas
  listaApp = new BehaviorSubject([]);


  //observable para manipular el estado de la base de datos
  private isDBReady: BehaviorSubject<boolean>= new BehaviorSubject(false);



  constructor(private sqlite: SQLite, private platform: Platform, private alertController: AlertController) { 
    this.crearConexion();
  }

  //funciones de retorno de observable para las variables de los selects
  fetchRol(): Observable<Rol[]>{
    return this.listaApp.asObservable();
  }
  fetchUsuario(): Observable<Usuarios[]>{
    return this.listaApp.asObservable();
  }
  fetchPost(): Observable<Post[]>{
    return this.listaApp.asObservable();
  }
  fetchComentario(): Observable<Comentarios[]>{
    return this.listaApp.asObservable();
  }
  fetchComentario2(): Observable<Comentarios[]>{
    return this.listaApp.asObservable();
  }
  
  getPostById(postId: number): Promise<any> {
    const sql = 'SELECT * FROM post WHERE id_post = ?';
    return this.database.executeSql(sql, [postId]).then((result) => {
      if (result.rows.length > 0) {
        return result.rows.item(0);
      }
      return null;
    });
  }
  getGuideById(id_guia: number) {
    const sql = 'SELECT * FROM guias WHERE id_guia = ?';
    return this.database.executeSql(sql, [id_guia]).then(res => {
      if (res.rows.length > 0) {
        return res.rows.item(0); // Retorna el primer resultado si lo hay
      } else {
        return null; // Retorna null si no hay resultados
      }
    }).catch(e => {
      console.error('Error al obtener la guia:', e);
      return null;
    });
  }


  dbReady(){
    return this.isDBReady.asObservable();
  }
  async presentAlert(titulo:string, msj:string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
    });

    await alert.present();
  }
  //función para crear la base de datos
  crearConexion(){
    //verificar si la plataforma esta lista
    this.platform.ready().then(()=>{
      this.sqlite.create({
        name: 'overlordchronicles.db',
        location: 'default'
      }).then((db: SQLiteObject)=>{
        //guardar la conexion
        this.database = db;
        //Eliminar las tablas para resetear la base de datos
        //this.borrarTablas();
        //llamar a la funcion de creacion de tabla
        this.crearTablas();
        this.seleccionarUsuario();
        //indicar que la base de datos esta lista
        this.isDBReady.next(true);
      }).catch(e=>{
        this.presentAlert('crear conexion','error en crear bd' + JSON.stringify(e));
      })
    })

  }
  async crearTablas(){
    try{
      //ejecutar la creacion de la tabla
      await this.database.executeSql(this.tablaRol,[]);
      await this.database.executeSql(this.tablaUsuarios,[]);
      await this.database.executeSql(this.tablaPost,[]);
      await this.database.executeSql(this.tablaGuias,[]);
      await this.database.executeSql(this.tablaComentatios,[]);
      await this.database.executeSql(this.tablaComentarios,[]);
      await this.database.executeSql(this.tablaNotificacion,[]);
      //ejecutar los inserts en caso de que existan
      await this.database.executeSql(this.rolesApp,[]);
      await this.database.executeSql(this.usuariosApp,[]);
      //await this.database.executeSql(this.postApp,[]);
      //await this.database.executeSql(this.guiaApp,[]);

    }catch(e){
      this.presentAlert('crear conexion','error en crear bd' + JSON.stringify(e));
    }
  }
  async borrarTablas(){
    try{
      //ejecutar la creacion de la tabla
      await this.database.executeSql(this.borrarTablaRol,[]);
      await this.database.executeSql(this.borrarTablaUsuarios,[]);
      await this.database.executeSql(this.borrarTablaPost,[]);
      await this.database.executeSql(this.borrarTablaGuias,[]);
      await this.database.executeSql(this.borrarTablaComentarios,[]);
      await this.database.executeSql(this.borrarTablaComentario2,[]);
      await this.database.executeSql(this.borrarTablaNotificacion,[]);

    }catch(e){
      this.presentAlert('crear conexion','error en resetear bd' + JSON.stringify(e));
    }
  }


  seleccionarUsuario(){
    return this.database.executeSql('SELECT * FROM usuario',[]).then(res=>{
      //variable para guardar el resultado de la consulta
      let items: Usuarios[] = [];
      //verificar si la consulta trae registros
      if(res.rows.length > 0){
        //recorro el cursor
        for(var i = 0; i < res.rows.length; i++){
          items.push({
            id_usuario: res.rows.item(i).id_usuario,
            nombre_usuario: res.rows.item(i).nombre_usuario,
            email: res.rows.item(i).email,
            password: res.rows.item(i).password,
            foto_perfil: res.rows.item(i).foto_perfil,
          })
        }
      }
      //actualizamos el observable de este select
      this.listaApp.next(items as any);
    }).catch(e=>{
      this.presentAlert('Select', 'Error: ' + JSON.stringify(e));
    })
  }

  registrarUsuario(nombre_usuario: string, email: string, password:string, id_rol:number) {
    const foto_perfil = 'assets/images/alain_thumb.png'; 
    return this.database.executeSql('INSERT INTO usuario(nombre_usuario, email, password, foto_perfil, id_rol) VALUES(?,?,?,?,?)',[nombre_usuario,email,password,foto_perfil,id_rol]).then(res=>{
      this.presentAlert("Sign Up","Account created");
      this.seleccionarUsuario();
    }).catch(e=>{
      this.presentAlert('Sign Up', 'Error: ' + JSON.stringify(e));
    })

  }

  seleccionarPost(){
    return this.database.executeSql('SELECT * FROM post',[]).then(res=>{
      //variable para guardar el resultado de la consulta
      let items: Post[] = [];
      //verificar si la consulta trae registros
      if(res.rows.length > 0){
        //recorro el cursor
        for(var i = 0; i < res.rows.length; i++){
          items.push({
            id_post: res.rows.item(i).id_post,
            titulo: res.rows.item(i).titulo,
            contenido: res.rows.item(i).contenido,
            imagen: res.rows.item(i).imagen,
          })
        }
      }
      //actualizamos el observable de este select
      this.listaApp.next(items as any);
    }).catch(e=>{
      this.presentAlert('Select', 'Error: ' + JSON.stringify(e));
    })
  }
  

  seleccionarPostId(id_post: number){
    return this.database.executeSql('SELECT * FROM post WHERE id_post = ?',[id_post]).then(res=>{
      //variable para guardar el resultado de la consulta
      let items: Post[] = [];
      //verificar si la consulta trae registros
      if(res.rows.length > 0){
        //recorro el cursor
        for(var i = 0; i < res.rows.length; i++){
          items.push({
            id_post: res.rows.item(i).id_post,
            titulo: res.rows.item(i).titulo,
            contenido: res.rows.item(i).contenido,
            imagen: res.rows.item(i).imagen,
          })
        }
      }
      //actualizamos el observable de este select
      this.listaApp.next(items as any);
    }).catch(e=>{
      this.presentAlert('Select', 'Error: ' + JSON.stringify(e));
    })
  }

  addPost(titulo: string, contenido: string, imagen: any, id_usuario: number) {
    const createdAt = new Date().toISOString();  // Generate the creation date
    const estado = 1;  // Default value for estado to make the post visible
    const categoria = 1;  // Set the category as 1 for posts
  
    return this.database.executeSql(
      'INSERT INTO post (titulo, contenido, imagen, fecha_publicacion, id_usuario, estado, categoria) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [titulo, contenido, imagen, createdAt, id_usuario, estado, categoria]  // Provide all 7 values in the correct order
    ).then(res => {
      this.presentAlert("Add", "Post created");
      this.seleccionarPost();  // Refresh the post list after adding the new post
    }).catch(e => {
      this.presentAlert('Add', 'Error: ' + JSON.stringify(e));
    });
  }

  addGuide(titulo: string, contenido: string, imagen: any, id_usuario: number) {
    const createdAt = new Date().toISOString();  // Generate the creation date
    const estado = 1;  // Default value for estado to make the post visible
    const categoria = 2;  
  
    return this.database.executeSql(
      'INSERT INTO post (titulo, contenido, imagen, fecha_publicacion, id_usuario, estado, categoria) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [titulo, contenido, imagen, createdAt, id_usuario, estado, categoria]  // Provide all 7 values in the correct order
    ).then(res => {
      this.presentAlert("Add", "Guide created");
      this.seleccionarPost();  // Refresh the post list after adding the new post
    }).catch(e => {
      this.presentAlert('Add', 'Error: ' + JSON.stringify(e));
    });
  }
  

  async updatePostStatus(id_post: number, estado: number, id_usuario: number, reason: string) {
    // Update the post's status
    await this.database.executeSql(
        'UPDATE post SET estado = ? WHERE id_post = ?',
        [estado, id_post]
    );

    // If the post is being blocked, retrieve the post title and insert a single notification
    if (estado === 2) {
        // Retrieve the post title
        const result = await this.database.executeSql(
            'SELECT titulo FROM post WHERE id_post = ?',
            [id_post]
        );

        const postTitle = result.rows.length > 0 ? result.rows.item(0).titulo : 'Publicación';

        const tipo = 1; // Type 1 for blocked post
        const titulo = `Post bloqued: ${postTitle}`; // Title of notification
        const contenido = `Your post named "${postTitle}" has been bloqued. Because: ${reason}`;
        const estadoNotificacion = 0; // 0 for unread

        await this.database.executeSql(
            `INSERT INTO notificacion (tipo, titulo, contenido, estado, id_usuario) 
             VALUES (?, ?, ?, ?, ?)`,
            [tipo, titulo, contenido, estadoNotificacion, id_usuario]
        );
    }
}

  

  // Method in SevicebdService to get only visible posts
  getVisiblePosts() {
    const sql = 'SELECT * FROM post WHERE estado = 1 AND categoria = 1';
    return this.database.executeSql(sql, []);
  }

  getVisibleGuides() {
    const sql = 'SELECT * FROM post WHERE estado = 1 AND categoria = 2';
    return this.database.executeSql(sql, []);
  }
  


  seleccionarGuia(){
    return this.database.executeSql('SELECT * FROM guias',[]).then(res=>{
      //variable para guardar el resultado de la consulta
      let items: Guias[] = [];
      //verificar si la consulta trae registros
      if(res.rows.length > 0){
        //recorro el cursor
        for(var i = 0; i < res.rows.length; i++){
          items.push({
            id_guia: res.rows.item(i).id_guia,
            titulo: res.rows.item(i).titulo,
            contenido: res.rows.item(i).contenido,
            imagen: res.rows.item(i).imagen,
          })
        }
      }
      //actualizamos el observable de este select
      this.listaApp.next(items as any);
    }).catch(e=>{
      this.presentAlert('Select', 'Error: ' + JSON.stringify(e));
    })
  }

  seleccionarMensaje(){
    return this.database.executeSql('SELECT * FROM comentario',[]).then(res=>{
      //variable para guardar el resultado de la consulta
      let items: Comentarios[] = [];
      //verificar si la consulta trae registros
      if(res.rows.length > 0){
        //recorro el cursor
        for(var i = 0; i < res.rows.length; i++){
          items.push({
            id_comentario: res.rows.item(i).id_comentario,
            mensaje: res.rows.item(i).mensaje,
          })
        }
      }
      //actualizamos el observable de este select
      this.listaApp.next(items as any);
    }).catch(e=>{
      this.presentAlert('Select', 'Error: ' + JSON.stringify(e));
    })
  }

  seleccionarMensaje2(){
    return this.database.executeSql('SELECT * FROM comentario2',[]).then(res=>{
      //variable para guardar el resultado de la consulta
      let items: Comentario2[] = [];
      //verificar si la consulta trae registros
      if(res.rows.length > 0){
        //recorro el cursor
        for(var i = 0; i < res.rows.length; i++){
          items.push({
            id_comentario: res.rows.item(i).id_comentario,
            mensaje: res.rows.item(i).mensaje,
          })
        }
      }
      //actualizamos el observable de este select
      this.listaApp.next(items as any);
    }).catch(e=>{
      this.presentAlert('Select', 'Error: ' + JSON.stringify(e));
    })
  }

  addGuia(titulo: string, contenido: string, imagen: any, id_usuario: number) {
    const createdAt = new Date().toISOString();  // Generar la fecha de creación
    return this.database.executeSql(
      'INSERT INTO guias (titulo, contenido, imagen, fecha_publicacion, id_usuario) VALUES (?, ?, ?, ?, ?)',  
      [titulo, contenido, imagen, createdAt, id_usuario]  
    ).then(res => {
      this.presentAlert("Add", "Guide created");
      this.seleccionarGuia();  
    }).catch(e => {
      this.presentAlert('Add', 'Error: ' + JSON.stringify(e));
    });
}

  checkUserExists(nombre_usuario: string, email: string) {
    return this.database.executeSql(`
      SELECT * FROM usuario WHERE nombre_usuario = ? OR email = ?
    `, [nombre_usuario, email]).catch(e=>{
      this.presentAlert('Error check', 'Error: ' + JSON.stringify(e));
    })

  }

  checkUserCredentials(email: string, password: string) {
    return this.database.executeSql(`
      SELECT * FROM usuario WHERE email = ? AND password = ?
    `, [email, password]);
  }

  eliminarUsuario(id_usuario: string){
    return this.database.executeSql('DELETE FROM usuario WHERE id_usuario = ?',[id_usuario]).then(res=>{
      this.presentAlert("Delete"," User deleted");
    }).catch(e=>{
      this.presentAlert('Delete', 'Error: ' + JSON.stringify(e));
    })

  }
  getAllUsers() {
    return this.database.executeSql(`SELECT * FROM usuario`, []);
  }

  getLatestPosts() {
    return this.database.executeSql(`
      SELECT * FROM post ORDER BY fecha_publicacion DESC LIMIT 5
    `, []);
  }


  getLatestGuides() {
    return this.database.executeSql(`
      SELECT * FROM guias ORDER BY fecha_publicacion DESC LIMIT 5
    `, []);
  }

  getAllPosts() {
    return this.database.executeSql('SELECT * FROM post WHERE categoria = 1', []).then((result) => {
      return result;
    });
  }

  getAllGuides() {
    return this.database.executeSql('SELECT * FROM post WHERE categoria = 2', []).then((result) => {
      return result;
    });
  }


  deletePost(id_post: number) {
    const sql = 'DELETE FROM post WHERE id_post = ?';
    return this.database.executeSql(sql, [id_post]).then(res => {
      console.log('Post eliminado correctamente');
    }).catch(e => {
      console.log('Error al eliminar post:', JSON.stringify(e));
    });
  }

  deleteGuide(id_guia: number) {
    const sql = 'DELETE FROM guias WHERE id_guia = ?';
    return this.database.executeSql(sql, [id_guia]).then(res => {
      console.log('Guia eliminada correctamente');
    }).catch(e => {
      console.log('Error al eliminar guia:', JSON.stringify(e));
    });
  }

  eliminarComentario(id_comentario: number) {
    const sql = 'DELETE FROM comentario WHERE id_comentario = ?';
    return this.database.executeSql(sql, [id_comentario]).then(res => {
      console.log('Comentario eliminado correctamente');
    }).catch(e => {
      console.log('Error al eliminar comentario:', JSON.stringify(e));
    });
  }

  eliminarComentario2(id_comentario: number) {
    const sql = 'DELETE FROM comentario2 WHERE id_comentario = ?';
    return this.database.executeSql(sql, [id_comentario]).then(res => {
      console.log('Comentario eliminado correctamente');
    }).catch(e => {
      console.log('Error al eliminar comentario:', JSON.stringify(e));
    });
  }

  changeProfilePicture(newImage: string, userId: number) {
    const sql = 'UPDATE usuarios SET foto_perfil = ? WHERE id_usuario = ?';
    return this.database.executeSql(sql, [newImage, userId]).then(res => {
      console.log('Imagen de perfil actualizada');
    }).catch(e => {
      console.error('Error al actualizar la imagen de perfil:', JSON.stringify(e));
    });
  }


  getPostsByUser(id_usuario: number) {
    const sql = 'SELECT * FROM post WHERE id_usuario = ?';
    return this.database.executeSql(sql, [id_usuario]).then(res => {
      const posts: any[] | PromiseLike<any[]> = [];
      for (let i = 0; i < res.rows.length; i++) {
        posts.push(res.rows.item(i));
      }
      return posts; // Retorna un array con todos los posts
    }).catch(e => {
      console.error('Error al obtener los posts:', e);
      return [];
    });
  }

  getGuiasByUser(id_usuario: number) {
    const sql = 'SELECT * FROM guias WHERE id_usuario = ?';
    return this.database.executeSql(sql, [id_usuario]).then(res => {
      const guias = [];
      for (let i = 0; i < res.rows.length; i++) {
        guias.push(res.rows.item(i));
      }
      return guias; // Retorna un array con todos los posts
    }).catch(e => {
      console.error('Error al obtener los posts:', e);
      return [];
    });
  }

  getUsuarioById(id_usuario: number) {
    const sql = 'SELECT * FROM usuario WHERE id_usuario = ?';
    return this.database.executeSql(sql, [id_usuario]).then(res => {
      if (res.rows.length > 0) {
        return res.rows.item(0); // Retorna el primer resultado, que será el usuario con el ID dado
      } else {
        return null; // Si no se encuentra el usuario, retorna null
      }
    }).catch(e => {
      console.error('Error al obtener el usuario:', e);
      return null; // Manejo de errores
    });
  }

  getUsuarioByEmail(email: string) {
    const sql = 'SELECT * FROM usuario WHERE email = ?';
    return this.database.executeSql(sql, [email]).then(res => {
      if (res.rows.length > 0) {
        return res.rows.item(0); // Retorna el primer resultado, que será el usuario con el ID dado
      } else {
        return null; // Si no se encuentra el usuario, retorna null
      }
    }).catch(e => {
      console.error('Error al obtener el usuario:', e);
      return null; // Manejo de errores
    });
  }

  updateUserRole(id_usuario: number, id_rol: number) {
    const sql = 'UPDATE usuario SET id_rol = ? WHERE id_usuario = ?';
    return this.database.executeSql(sql, [id_rol, id_usuario]).then(res => {
      console.log('User role updated successfully');
    }).catch(e => {
      console.error('Error updating user role:', JSON.stringify(e));
    });
  }
  
  updateFotoPerfil(id_usuario: number, imagen: string) {
    const sql = 'UPDATE usuario SET foto_perfil = ? WHERE id_usuario = ?';
    return this.database.executeSql(sql, [imagen, id_usuario]);
  }

  updateUsuario(id_usuario: number, cambios: any) {
    const campos = [];
    const valores = [];
  
    if (cambios.nombre_usuario) {
      campos.push('nombre_usuario = ?');
      valores.push(cambios.nombre_usuario);
    }
    if (cambios.email) {
      campos.push('email = ?');
      valores.push(cambios.email);
    }
  
    valores.push(id_usuario);
    const sql = `UPDATE usuario SET ${campos.join(', ')} WHERE id_usuario = ?`;
    
    return this.database.executeSql(sql, valores).then(() => {
      console.log('Usuario actualizado');
    }).catch(e => {
      console.error('Error al actualizar el usuario:', e);
    });
  }
  
  updatePassword(id_usuario: number, nuevaContrasena: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const query = `UPDATE usuario SET password = ? WHERE id_usuario = ?`;
      this.database.executeSql(query, [nuevaContrasena, id_usuario])
        .then(res => {
          if (res.rowsAffected > 0) {
            resolve('Password changed');
          } else {
            reject('Can´t change password');
          }
        })
        .catch(err => {
          console.error('Error changing password:', err);
          reject(err);
        });
    });
  }

  actualizarContrasena(email: string, nuevaContrasena: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const query = `UPDATE usuario SET password = ? WHERE email = ?`;
      this.database.executeSql(query, [nuevaContrasena, email])
        .then(res => {
          if (res.rowsAffected > 0) {
            resolve('Password changed');
          } else {
            reject('Can´t change password');
          }
        })
        .catch(err => {
          console.error('Error changing password:', err);
          reject(err);
        });
    });
  }

 // Método para obtener comentarios de un post
 async getComentariosByPost(id_post: number) {
  const query = 'SELECT c.id_comentario,c.mensaje, u.nombre_usuario FROM comentario c INNER JOIN usuario u ON c.id_usuario = u.id_usuario WHERE c.id_post = ?';
  try {
    const result = await this.database.executeSql(query, [id_post]);
    let comentarios = [];
    for (let i = 0; i < result.rows.length; i++) {
      comentarios.push({
        mensaje: result.rows.item(i).mensaje,
        usuario: result.rows.item(i).nombre_usuario,
        id: result.rows.item(i).id_comentario,
      });
    }
    return comentarios;
  } catch (error) {
    console.error('Error al obtener los comentarios', error);
    return [];
  }
}

async getComentariosByPGuide(id_guia: number) {
  const query = 'SELECT c.id_comentario,c.mensaje, u.nombre_usuario FROM comentario2 c INNER JOIN usuario u ON c.id_usuario = u.id_usuario WHERE c.id_guia = ?';
  try {
    const result = await this.database.executeSql(query, [id_guia]);
    let comentarios = [];
    for (let i = 0; i < result.rows.length; i++) {
      comentarios.push({
        mensaje: result.rows.item(i).mensaje,
        usuario: result.rows.item(i).nombre_usuario,
        id: result.rows.item(i).id_comentario,
      });
    }
    return comentarios;
  } catch (error) {
    console.error('Error al obtener los comentarios', error);
    return [];
  }
}


  // Método para guardar un comentario
  async guardarComentario(id_post: number, id_usuario: number, mensaje: string) {
    const createdAt = new Date().toISOString(); 
    return this.database.executeSql(
      'INSERT INTO comentario (id_post, id_usuario, mensaje, fecha) VALUES (?, ?, ?, ?)',
      [id_post, id_usuario, mensaje, createdAt]
    )
    .then(async res => {
      if (res.insertId) {
        this.seleccionarMensaje();  
      }
    })
    .catch(e => {
      this.presentAlert('Add', 'Error: ' + JSON.stringify(e));
    });
  }

  async guardarComentario2(id_guia: number, id_usuario: number, mensaje: string) {
    const createdAt = new Date().toISOString(); 
    return this.database.executeSql(
      'INSERT INTO comentario2 (id_guia, id_usuario, mensaje, fecha) VALUES (?, ?, ?, ?)',
      [id_guia, id_usuario, mensaje, createdAt]
    )
    .then(async res => {
      if (res.insertId) {
        this.seleccionarMensaje2();  
      }
    })
    .catch(e => {
      this.presentAlert('Add', 'Error: ' + JSON.stringify(e));
    });
  }

  actualizarPost(id_post: number, titulo: string, contenido: string, imagen: string): Promise<any> {
    const query = 'UPDATE post SET titulo = ?, contenido = ?, imagen = ? WHERE id_post = ?';
    return this.database.executeSql(query, [titulo, contenido, imagen, id_post]);
  }

  actualizarGuia(id_guia: number, titulo: string, contenido: string, imagen: string): Promise<any> {
    const query = 'UPDATE guias SET titulo = ?, contenido = ?, imagen = ? WHERE id_guia = ?';
    return this.database.executeSql(query, [titulo, contenido, imagen, id_guia]);
  }

 // En SevicebdService
obtenerNotificaciones(id_usuario: number) {
  return this.database.executeSql(
    `SELECT * FROM notificacion WHERE id_usuario = ? ORDER BY fecha_publicacion DESC`,
    [id_usuario]
  ).then(res => {
    let notificaciones = [];
    for (let i = 0; i < res.rows.length; i++) {
      notificaciones.push(res.rows.item(i));
    }
    return notificaciones;
  });
}

addNotification(notification: { tipo: number; titulo: string; contenido: string; estado: number; id_usuario: number }) {
  const query = `INSERT INTO notificacion (tipo, titulo, contenido, estado, id_usuario) VALUES (?, ?, ?, ?, ?)`;
  return this.database.executeSql(query, [
    notification.tipo, 
    notification.titulo, 
    notification.contenido, 
    notification.estado, 
    notification.id_usuario
  ]);
}



// Método para marcar una notificación como leída
async marcarComoLeida(id_notificacion: number) {
  const query = 'UPDATE notificacion SET estado = 1 WHERE id_notificacion = ?';
  await this.database.executeSql(query, [id_notificacion]);
}

// Método para marcar todas las notificaciones como leídas
async marcarTodasComoLeidas(id_usuario: number) {
  const query = 'UPDATE notificacion SET estado = 1 WHERE id_usuario = ?';
  await this.database.executeSql(query, [id_usuario]);
}

// Método para eliminar una notificación
async eliminarNotificacion(id_notificacion: number) {
  const query = 'DELETE FROM notificacion WHERE id_notificacion = ?';
  await this.database.executeSql(query, [id_notificacion]);
}

getUnreadNotifications(userId: number): Promise<any[]> {
  const sql = 'SELECT * FROM notificacion WHERE estado = 0 AND id_usuario = ?';
  return this.database.executeSql(sql, [userId])
    .then((result) => {
      let notifications = [];
      for (let i = 0; i < result.rows.length; i++) {
        notifications.push(result.rows.item(i));
      }
      return notifications;
    })
    .catch((error) => {
      console.error('Error fetching unread notifications', error);
      return [];
    });
}
// En el archivo sevicebd.service.ts
async createNotification(tipo: number, titulo: string, contenido: string, estado: number, userId: number) {
  const query = `
    INSERT INTO notificacion (tipo, titulo, contenido, estado, id_usuario) 
    VALUES (?, ?, ?, ?, ?)
  `;
  return this.database.executeSql(query, [tipo, titulo, contenido, estado, userId]);
}



}
