import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HomePage } from './home.page';
import { SevicebdService } from '../services/sevicebd.service';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

// Mock para SQLiteObject con executeSql simulado
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

// Mock para SQLite que retorna SQLiteObjectMock
class SQLiteMock {
  create(): Promise<SQLiteObject> {
    return Promise.resolve(new SQLiteObjectMock() as unknown as SQLiteObject);
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

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule
      ],
      providers: [
        { provide: SQLite, useClass: SQLiteMock },
        { provide: NativeStorage, useClass: NativeStorageMock },
        SevicebdService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
