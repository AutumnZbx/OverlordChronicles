import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambioPassPage } from './cambio-pass.page';

describe('CambioPassPage', () => {
  let component: CambioPassPage;
  let fixture: ComponentFixture<CambioPassPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioPassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
