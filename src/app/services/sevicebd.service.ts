import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, Observable} from 'rxjs';
import { AlertController, Platform } from '@ionic/angular';
import { Rol } from './rol';
import { Usuarios } from './usuarios';
import { Post } from './post';
import { Guias } from './guias';
import { Comentarios } from './comentarios';

@Injectable({
  providedIn: 'root'
})
export class SevicebdService {
  //creo mi variable de conexión a Base de Datos
  public database!: SQLiteObject;

  //variables de creación de tablas
  tablaRol: string = "CREATE TABLE IF NOT EXISTS rol (id_rol INTEGER PRIMARY KEY AUTOINCREMENT, nombre_rol TEXT NOT NULL UNIQUE);";

  tablaUsuarios: string = "CREATE TABLE IF NOT EXISTS usuario (id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,nombre_usuario VARCHAR(15) UNIQUE NOT NULL, email VARCHAR(50) UNIQUE NOT NULL, password VARCHAR(100) NOT NULL, foto_perfil BLOB, id_rol INTEGER NOT NULL, FOREIGN KEY(id_rol) REFERENCES rol(id_rol));";

  tablaPost: string = "CREATE TABLE IF NOT EXISTS post (id_post INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT NOT NULL, contenido TEXT NOT NULL, imagen BLOB , fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP, id_usuario INTEGER NOT NULL, FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE);";

  tablaGuias: string = "CREATE TABLE IF NOT EXISTS guias (id_guia INTEGER PRIMARY KEY AUTOINCREMENT,titulo TEXT NOT NULL, contenido TEXT NOT NULL, imagen BLOB , fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP, id_usuario INTEGER NOT NULL, FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE);";

  tablaPersonajes: string = "CREATE TABLE IF NOT EXISTS personajes (id_personaje INTEGER PRIMARY KEY AUTOINCREMENT, nombre_personaje TEXT NOT NULL, descripcion TEXT);";

  tablaObjetos: string = "CREATE TABLE IF NOT EXISTS objetos (id_objeto INTEGER PRIMARY KEY AUTOINCREMENT, nombre_objeto TEXT NOT NULL, descripcion TEXT);";
  
  tablaComentatios: string= "CREATE TABLE IF NOT EXISTS comentario (id_comentario INTEGER PRIMARY KEY AUTOINCREMENT,id_post INTEGER NOT NULL,id_usuario INTEGER NOT NULL,mensaje TEXT NOT NULL,fecha DATETIME DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY (id_post) REFERENCES post(id_post) ON DELETE CASCADE,FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE);"

  //variables de insert iniciales de las tablas
  //registroNoticia: string = "INSERT or IGNOREJ INTO noticia(idnoticia, titulo, texto) VALUES (1, 'Soy un titulo', 'Soy un texto co,mo contenido de la noticia recien creada');";
  rolesApp: string = "INSERT or IGNORE INTO rol (nombre_rol) VALUES ('Admin'); INSERT INTO roles (nombre_rol) VALUES ('Usuario');"

  usuariosApp: string = "INSERT or IGNORE INTO usuario (nombre_usuario,email,password,foto_perfil,id_rol) VALUES ('Admin','chris.sellao@gmail.com','Kuki2024*','assets/images/alain_thumb.png','1');"

  //postApp: string = "INSERT or IGNORE INTO post ()"

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
  
  getPostById(id_post: number) {
    const sql = 'SELECT * FROM post WHERE id_post = ?';
    return this.database.executeSql(sql, [id_post]).then(res => {
      if (res.rows.length > 0) {
        return res.rows.item(0); // Retorna el primer resultado si lo hay
      } else {
        return null; // Retorna null si no hay resultados
      }
    }).catch(e => {
      console.error('Error al obtener el post:', e);
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

      //ejecutar los inserts en caso de que existan
      await this.database.executeSql(this.rolesApp,[]);
      await this.database.executeSql(this.usuariosApp,[]);

    }catch(e){
      this.presentAlert('crear conexion','error en crear bd' + JSON.stringify(e));
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
      this.presentAlert("Registro","Usuario agregado correctamente");
      this.seleccionarUsuario();
    }).catch(e=>{
      this.presentAlert('Registro', 'Error: ' + JSON.stringify(e));
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
    const createdAt = new Date().toISOString();  // Generar la fecha de creación
    return this.database.executeSql(
      'INSERT INTO post (titulo, contenido, imagen, fecha_publicacion, id_usuario) VALUES (?, ?, ?, ?, ?)',  // Asegúrate de que sean 5 placeholders
      [titulo, contenido, imagen, createdAt, id_usuario]  // Proveer los 5 valores en el mismo orden
    ).then(res => {
      this.presentAlert("Agregar", "Post creado correctamente");
      this.seleccionarPost();  // Actualiza la lista de posts después de agregar el nuevo
    }).catch(e => {
      this.presentAlert('Agregar', 'Error: ' + JSON.stringify(e));
    });
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

  addGuia(titulo: string, contenido: string, imagen: any, id_usuario: number) {
    const createdAt = new Date().toISOString();  // Generar la fecha de creación
    return this.database.executeSql(
      'INSERT INTO guias (titulo, contenido, imagen, fecha_publicacion, id_usuario) VALUES (?, ?, ?, ?, ?)',  
      [titulo, contenido, imagen, createdAt, id_usuario]  
    ).then(res => {
      this.presentAlert("Agregar", "Post creado correctamente");
      this.seleccionarGuia();  
    }).catch(e => {
      this.presentAlert('Agregar', 'Error: ' + JSON.stringify(e));
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
      this.presentAlert("Eliminar","Usuario eliminado correctamente");
    }).catch(e=>{
      this.presentAlert('Eliminar', 'Error: ' + JSON.stringify(e));
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
    return this.database.executeSql(`SELECT * FROM post ORDER BY fecha_publicacion DESC`, []);
  }

  getAllGuides() {
    return this.database.executeSql(`SELECT * FROM guias ORDER BY fecha_publicacion DESC`, []);
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
            resolve('Contraseña actualizada con éxito');
          } else {
            reject('No se pudo actualizar la contraseña');
          }
        })
        .catch(err => {
          console.error('Error al actualizar la contraseña:', err);
          reject(err);
        });
    });
  }

 // Método para obtener comentarios de un post
 async getComentariosByPost(id_post: number) {
  const query = 'SELECT c.mensaje, u.nombre_usuario FROM comentario c INNER JOIN usuario u ON c.id_usuario = u.id_usuario WHERE c.id_post = ?';
  try {
    const result = await this.database.executeSql(query, [id_post]);
    let comentarios = [];
    for (let i = 0; i < result.rows.length; i++) {
      comentarios.push({
        mensaje: result.rows.item(i).mensaje,
        usuario: result.rows.item(i).nombre_usuario
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
    const query = 'INSERT INTO comentario (id_post, id_usuario, mensaje) VALUES (?, ?, ?)';
    try {
     await this.database.executeSql(query, [id_post, id_usuario, mensaje]);
    } catch (error) {
      console.error('Error al guardar el comentario', error);
    }
  }

  // Método para eliminar un comentario
  async eliminarComentario(id_comentario: number) {
    const sql = 'DELETE FROM comentario WHERE id_comentario = ?';
    return this.database.executeSql(sql, [id_comentario]).then(res => {
      console.log('Comentario eliminado correctamente');
    }).catch(e => {
      console.log('Error al eliminar comentario:', JSON.stringify(e));
    });
  }

}
