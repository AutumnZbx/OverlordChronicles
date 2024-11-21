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


  it('Simular usuario logeado', async () => {
    await component.cargarDatosUsuario();
    expect(component.currentUser.nombre_usuario).toBe('Usuario de prueba');
    expect(component.nombre_usuario).toBe('Usuario de prueba');
    expect(component.email).toBe('test@example.com');
  });
  
  describe('validarNombreUsuario', () => {
    it('Validar campo username vacio', () => {
      component.nombre_usuario = '   ';
      component.validarNombreUsuario();
      expect(component.nombreVacio).toBeTrue();
    });

    it('Validar campo username con menos de 5 caracteres', () => {
      component.nombre_usuario = 'wasd';
      component.validarNombreUsuario();
      expect(component.nombreInvalido).toBeTrue();
    });

    it('Validar campo username con mas de 15 caracteres', () => {
      component.nombre_usuario = 'a'.repeat(16);
      component.validarNombreUsuario();
      expect(component.nombreInvalido).toBeTrue();
    });

    it('Validar que username no sea igual al existente', () => {
      component.currentUser = { nombre_usuario: 'usuario' };
      component.nombre_usuario = 'usuario';
      component.validarNombreUsuario();
      expect(component.nombreIgual).toBeTrue();
    });

    it('Validar campo usuario correcto', () => {
      component.currentUser = { nombre_usuario: 'usuario' };
      component.nombre_usuario = 'AutumnBzx';
      component.validarNombreUsuario();
      expect(component.nombreVacio).toBeFalse();
      expect(component.nombreInvalido).toBeFalse();
      expect(component.nombreIgual).toBeFalse();
    });
  });

  describe('validarEmail', () => {
    it('Validar campo email vacio', () => {
      component.email = '   ';
      component.validarEmail();
      expect(component.emailVacio).toBeTrue();
    });

    it('Validar campo email valido', () => {
      component.email = 'email.com';
      component.validarEmail();
      expect(component.emailInvalido).toBeTrue();
    });

    it('Validar campo email valido', () => {
      component.email = 'chris.sellao@gmail.com';
      component.validarEmail();
      expect(component.emailInvalido).toBeFalse();
    });
  });

  describe('validarPassword', () => {
    it('Validar campo password vacio', () => {
      component.password = '   ';
      component.validarPassword();
      expect(component.passwordVacia).toBeTrue();
    });

    it('Validar campo password valido', () => {
      component.password = 'Kuki2024*';
      component.validarPassword();
      expect(component.passwordVacia).toBeFalse();
    });
  });
});
