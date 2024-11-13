import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EjemploPostPage } from './ejemplo-post.page';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { SevicebdService } from 'src/app/services/sevicebd.service';


// Mock para SQLiteObject
class SQLiteObjectMock {
  executeSql(query: string, params: any[]): Promise<any> {
    return Promise.resolve({
      rows: {
        length: 1,
        item: (index: number) => ({ id: 1, name: 'Test Item' })
      }
    });
  }
}

// Mock para SQLite
class SQLiteMock {
  create(): Promise<SQLiteObjectMock> {
    return Promise.resolve(new SQLiteObjectMock());
  }
}

// Mock para NativeStorage
class NativeStorageMock {
  getItem(key: string): Promise<any> {
    return Promise.resolve({});
  }

  setItem(key: string, value: any): Promise<any> {
    return Promise.resolve();
  }
}

describe('EjemploPostPage', () => {
  let component: EjemploPostPage;
  let fixture: ComponentFixture<EjemploPostPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EjemploPostPage],
      imports: [IonicModule.forRoot()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '123' } }, // Simula un parámetro ID en la URL
          }
        },
        { provide: SQLite, useClass: SQLiteMock },
        { provide: NativeStorage, useClass: NativeStorageMock },
        SevicebdService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EjemploPostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
