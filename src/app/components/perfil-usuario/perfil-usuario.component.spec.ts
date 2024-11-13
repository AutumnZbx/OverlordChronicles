import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { PerfilUsuarioComponent } from './perfil-usuario.component';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx'; // Importa NativeStorage

describe('PerfilUsuarioComponent', () => {
  let component: PerfilUsuarioComponent;
  let fixture: ComponentFixture<PerfilUsuarioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilUsuarioComponent ],
      imports: [IonicModule.forRoot()],
      providers: [NativeStorage] // Agrega NativeStorage como proveedor
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
