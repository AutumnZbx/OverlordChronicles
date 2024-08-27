import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearGuiaPage } from './crear-guia.page';

describe('CrearGuiaPage', () => {
  let component: CrearGuiaPage;
  let fixture: ComponentFixture<CrearGuiaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearGuiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
