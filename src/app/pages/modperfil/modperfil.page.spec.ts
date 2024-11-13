import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModperfilPage } from './modperfil.page';
import { IonicModule } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('ModperfilPage', () => {
  let component: ModperfilPage;
  let fixture: ComponentFixture<ModperfilPage>;
  let sevicebdServiceSpy: jasmine.SpyObj<SevicebdService>;

  beforeEach(async () => {
    sevicebdServiceSpy = jasmine.createSpyObj('SevicebdService', ['getUsuarioById', 'updateUsuario']);
    
    // Simular un usuario de prueba para la función `getUsuarioById`
    sevicebdServiceSpy.getUsuarioById.and.returnValue(Promise.resolve({
      id_usuario: 1,
      nombre_usuario: 'Usuario de prueba',
      email: 'test@example.com',
      password: '12345'
    }));

    await TestBed.configureTestingModule({
      declarations: [ModperfilPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: SevicebdService, useValue: sevicebdServiceSpy },
        SQLite
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModperfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data on initialization', async () => {
    await component.cargarDatosUsuario();
    expect(component.currentUser.nombre_usuario).toBe('Usuario de prueba');
    expect(component.nombre_usuario).toBe('Usuario de prueba');
    expect(component.email).toBe('test@example.com');
  });
});
