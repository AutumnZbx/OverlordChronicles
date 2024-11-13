import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetallePage } from './detalle.page';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { of } from 'rxjs';

describe('DetallePage', () => {
  let component: DetallePage;
  let fixture: ComponentFixture<DetallePage>;
  let mockApiService: Partial<ApiService>;

  beforeEach(async () => {
    // Mock básico para ApiService
    mockApiService = {
      // Define métodos simulados aquí si es necesario, por ejemplo:
      getCharacterById: (id: string) => of({ ok: true, personaje: { id, name: 'Test Character', desc: 'Character description' } })
    };

    await TestBed.configureTestingModule({
      declarations: [DetallePage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '123' } } // Simula un ID en los parámetros de la ruta
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
