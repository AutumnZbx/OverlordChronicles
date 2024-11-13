import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarGuiaPage } from './editar-guia.page';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';  // Importa FormsModule
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { RouterTestingModule } from '@angular/router/testing'; // Importa RouterTestingModule

describe('EditarGuiaPage', () => {
  let component: EditarGuiaPage;
  let fixture: ComponentFixture<EditarGuiaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarGuiaPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        FormsModule // Agrega FormsModule aquí
      ],
      providers: [SevicebdService, SQLite]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarGuiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
