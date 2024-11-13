import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroPage } from './registro.page';
import { IonicModule } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

describe('RegistroPage', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistroPage],
      imports: [IonicModule.forRoot()],
      providers: [SevicebdService, SQLite]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Vaidar nombre de usuario vacio', () => {
    component.nombre_usuario = '';
    expect(component.validateUsername()).toBeFalse();
  });
  
  it('Validar cantidad de caracteres nombre de usuario', () => {
    component.nombre_usuario = 'abcdefghijklmnop';
    expect(component.validateUsername()).toBeFalse();
  });
  
  it('Validar nombre de usuario correcto', () => {
    component.nombre_usuario = 'Autumnbzx';
    expect(component.validateUsername()).toBeTrue();
  });

  it('Validar email vacio', () => {
    component.email = '';
    expect(component.validateEmail()).toBeFalse();
  });
  
  it('Validar email invalido', () => {
    component.email = 'email.com';
    expect(component.validateEmail()).toBeFalse();
  });
  
  it('Validar cantidad de caracteres maximos en email', () => {
    component.email = 'ejemplodeemailmuylargo@ejemplo.com';
    expect(component.validateEmail()).toBeFalse();
  });
  
  it('Validar email valido', () => {
    component.email = 'chris.sellao@gmail.com';
    expect(component.validateEmail()).toBeTrue();
  });

  it('Validar caracteres maximos en password', () => {
    component.password = 'Paswordlarga123';
    expect(component.validatePassword()).toBeFalse();
  });
  
  it('Validar password correcto', () => {
    component.password = 'Kuki2024*';
    expect(component.validatePassword()).toBeTrue();
  });

  it('Validar que las 2 password no sean iguales', () => {
    component.password = 'password1';
    component.password2 = 'password2';
    expect(component.validatePasswordMatch()).toBeFalse();
  });
  
  it('Validar que las 2 password sean iguales', () => {
    component.password = 'password123';
    component.password2 = 'password123';
    expect(component.validatePasswordMatch()).toBeTrue();
  });


});
