import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambioPassPage } from './cambio-pass.page';
import { ActivatedRoute, Router } from '@angular/router';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { of } from 'rxjs';
import { AlertController } from '@ionic/angular';

describe('CambioPassPage', () => {
  let component: CambioPassPage;
  let fixture: ComponentFixture<CambioPassPage>;
  let mockServicebdService: Partial<SevicebdService>;

  beforeEach(() => {
    mockServicebdService = {
      dbReady: () => of(true),
      getUsuarioById: (id: number) => Promise.resolve({ id_usuario: id, nombre_usuario: 'Test User', password: 'test123' })
    };

    TestBed.configureTestingModule({
      declarations: [CambioPassPage],
      providers: [
        { provide: SevicebdService, useValue: mockServicebdService },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } },
        { provide: AlertController, useValue: { create: jasmine.createSpy('create').and.returnValue(Promise.resolve()) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CambioPassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('validarPasswords', () => {
    it('Validar campo contraseña vacio', () => {
      component.newPassword = '   ';
      component.validarPasswords();
      expect(component.newPasswordVacia).toBeTrue();
    });

    it('Validar campo confirmar contraseña vacio', () => {
      component.confirmPassword = '   ';
      component.validarPasswords();
      expect(component.confirmPasswordVacia).toBeTrue();
    });

    it('Validar caracteres maximos en los campos de contraseña y confirmar contraseña', () => {
      component.newPassword = 'a'.repeat(16);
      component.confirmPassword = 'a'.repeat(16);
      component.validarPasswords();
      expect(component.passwordLarga).toBeTrue();
    });

    it('Validar que ambas contraseñas no coincidan', () => {
      component.newPassword = 'Password1';
      component.confirmPassword = 'Password2';
      component.validarPasswords();
      expect(component.passwordsNoCoinciden).toBeTrue();
    });

    it('Validar campos contraseñas correctas', () => {
      component.newPassword = 'Kuki2024*';
      component.confirmPassword = 'Kuki2024*';
      component.validarPasswords();
      expect(component.newPasswordVacia).toBeFalse();
      expect(component.confirmPasswordVacia).toBeFalse();
      expect(component.passwordLarga).toBeFalse();
      expect(component.passwordsNoCoinciden).toBeFalse();
    });
  });
});
