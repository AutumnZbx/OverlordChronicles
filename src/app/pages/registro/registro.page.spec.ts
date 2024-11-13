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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
