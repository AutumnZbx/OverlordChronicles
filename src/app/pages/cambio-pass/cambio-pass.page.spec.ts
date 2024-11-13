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
    // Crear el mock de SevicebdService
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
