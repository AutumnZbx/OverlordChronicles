import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { IonicModule } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule.forRoot()],
      providers: [SevicebdService, SQLite]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Validar campo email vacio', () => {
    component.email = '';
    component.validateEmail();
    expect(component.showEmailError).toBeTrue();
  });

  it('Validar campo email con mas de 30 caracteres', () => {
    component.email = 'a'.repeat(31);
    component.validateEmail();
    expect(component.emailTooLong).toBeTrue();
  });

  it('Validar campo email correcto', () => {
    component.email = 'chris.sellao@gmail.com';
    component.validateEmail();
    expect(component.showEmailError).toBeFalse();
    expect(component.emailTooLong).toBeFalse();
  });
});

