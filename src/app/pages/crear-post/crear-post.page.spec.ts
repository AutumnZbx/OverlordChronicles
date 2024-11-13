import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearPostPage } from './crear-post.page';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing'; // Importa RouterTestingModule
import { of } from 'rxjs';

describe('CrearPostPage', () => {
  let component: CrearPostPage;
  let fixture: ComponentFixture<CrearPostPage>;
  let mockServicebdService: Partial<SevicebdService>;

  beforeEach(() => {
    // Crear mock para SevicebdService
    mockServicebdService = {
      // Aquí puedes añadir métodos simulados de SevicebdService si los necesitas
    };

    TestBed.configureTestingModule({
      declarations: [CrearPostPage],
      imports: [IonicModule.forRoot(), RouterTestingModule], // Agregar RouterTestingModule
      providers: [
        { provide: SevicebdService, useValue: mockServicebdService },
        { provide: SQLite, useValue: {} },         // Mock vacío para SQLite
        { provide: NativeStorage, useValue: {} }   // Mock vacío para NativeStorage
      ]
    }).compileComponents();


    fixture = TestBed.createComponent(CrearPostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('validarTitulo', () => {
    it('Validar campo titulo con menos de 10 caracteres', () => {
      component.titulo = 'titulo'; 
      component.validarTitulo();
      expect(component.tituloError).toBeTrue();
    });

    it('Validar campo titulo con mas de 50 caracteres', () => {
      component.titulo = 'A'.repeat(51); 
      component.validarTitulo();
      expect(component.tituloError).toBeTrue();
    });

    it('Validar campo titulo correcto', () => {
      component.titulo = 'Título válido prueba';
      component.validarTitulo();
      expect(component.tituloError).toBeFalse();
    });
  });

  describe('validarContenido', () => {
    it('Validar campo contenido con menos de 10 caracteres', () => {
      component.contenido = 'contenido'; 
      component.validarContenido();
      expect(component.contenidoError).toBeTrue();
    });

    it('Validar campo contenido con mas de 250 carecteres', () => {
      component.contenido = 'A'.repeat(251); 
      component.validarContenido();
      expect(component.contenidoError).toBeTrue();
    });

    it('Validar campo contenido correcto', () => {
      component.contenido = 'Contenido del post correcto';
      component.validarContenido();
      expect(component.contenidoError).toBeFalse();
    });
  });
});
