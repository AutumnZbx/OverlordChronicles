import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, Observable} from 'rxjs';
import { AlertController, Platform } from '@ionic/angular';
import { Rol } from './rol';
import { Usuarios } from './usuarios';

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
  
  //tablaComentatios: string= "CREATE TABLE IF NOT EXISTS comentario (id_comentario INTEGER PRIMARY KEY AUTOINCREMENT,contenido TEXT NOT NULL,fecha_publicacion DATETIME,id_post INTEGER NOT NULL,FOREIGN KEY (id_post) REFERENCES post(id_post) ON DELETE CASCADE, id_usuario INTEGER NOT NULL, FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE);"

  //variables de insert iniciales de las tablas
  //registroNoticia: string = "INSERT or IGNOREJ INTO noticia(idnoticia, titulo, texto) VALUES (1, 'Soy un titulo', 'Soy un texto co,mo contenido de la noticia recien creada');";
  rolesApp: string = "INSERT or IGNORE INTO rol (nombre_rol) VALUES ('Admin'); INSERT INTO roles (nombre_rol) VALUES ('Usuario');"

  usuariosApp: string = "INSERT or IGNORE INTO usuario (nombre_usuario,email,password,foto_perfil,id_rol) VALUES ('Admin','chris.sellao@gmail.com','Kuki2024*',NULL,'1');"

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
      //await this.database.executeSql(this.tablaComentatios,[]);

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
    return this.database.executeSql('INSERT INTO usuario(nombre_usuario, email, password, id_rol) VALUES(?,?,?,?)',[nombre_usuario,email,password,id_rol]).then(res=>{
      this.presentAlert("Registro","Usuario agregado correctamente");
      this.seleccionarUsuario();
    }).catch(e=>{
      this.presentAlert('Registro', 'Error: ' + JSON.stringify(e));
    })

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

  addPost(titulo: string, contenido: string, imagen: any) {
    const createdAt = new Date().toISOString();
    const sql = `INSERT INTO post (titulo, contenido, imagen, fecha_publicacion) VALUES (?, ?, ?, ?)`;
    return this.database.executeSql(sql, [titulo, contenido, imagen, createdAt]);
  }

  addGuide(titulo: string, contenido: string, imagen: any) {
    const createdAt = new Date().toISOString();
    const sql = `INSERT INTO guias (titulo, contenido, imagen, fecha_publicacion) VALUES (?, ?, ?, ?)`;
    return this.database.executeSql(sql, [titulo, contenido, imagen, createdAt]);
  }

  getPostById(postId: string) {
    const sql = 'SELECT * FROM post WHERE id_post = ?';
    return this.database.executeSql(sql, [postId]).then(res => {
      return res.rows.item(0);
    });
  }

  getCommentsByPostId(postId: string) {
    const sql = `SELECT c.*, u.nombre_usuario FROM comentario c JOIN usuario u ON c.id_usuario = u.id_usuario WHERE c.post_id = ? ORDER BY c.fecha_publicacion DESC`;
    return this.database.executeSql(sql, [postId]).then(res => {
      let comments = [];
      for (let i = 0; i < res.rows.length; i++) {
        comments.push(res.rows.item(i));
      }
      return comments;
    });
  }
  addComment(postId: number, userId: number, content: string, createdAt: string) {
    const sql = `INSERT INTO comment (id_post, id_usuario, contenido, fecha_publicacion) VALUES (?, ?, ?, ?)`;
    return this.database.executeSql(sql, [postId, userId, content, createdAt]);
  }

  deleteComment(commentId: number) {
    const sql = 'DELETE FROM comment WHERE id_comentario = ?';
    return this.database.executeSql(sql, [commentId]);
  }

  deletePost(postId:string){
    return this.database.executeSql('DELETE FROM post WHERE id_post = ?',[postId]).then(res=>{
      this.presentAlert("Eliminar","Post eliminada exitosamente");
      this.getAllPosts();
    }).catch(e=>{
      this.presentAlert('Eliminar', 'Error: ' + JSON.stringify(e));
    })
  }

  deleteGuide(guideId:string){
    return this.database.executeSql('DELETE FROM guias WHERE id_guia = ?',[guideId]).then(res=>{
      this.presentAlert("Eliminar","Guia eliminada exitosamente");
      this.getAllGuides();
    }).catch(e=>{
      this.presentAlert('Eliminar', 'Error: ' + JSON.stringify(e));
    })
  }

  

}
