import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EjemploGuiasPage } from './ejemplo-guias.page';

describe('EjemploGuiasPage', () => {
  let component: EjemploGuiasPage;
  let fixture: ComponentFixture<EjemploGuiasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EjemploGuiasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
