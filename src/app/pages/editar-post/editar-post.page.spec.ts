import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarPostPage } from './editar-post.page';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('EditarPostPage', () => {
  let component: EditarPostPage;
  let fixture: ComponentFixture<EditarPostPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarPostPage],
      imports: [IonicModule.forRoot(), FormsModule], // Agrega FormsModule aquí
      providers: [
        SevicebdService,
        SQLite,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: (key: string) => '123' } }, // Simula un ID de ejemplo
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarPostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
