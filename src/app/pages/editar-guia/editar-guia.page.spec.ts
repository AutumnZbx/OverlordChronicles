import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarGuiaPage } from './editar-guia.page';

describe('EditarGuiaPage', () => {
  let component: EditarGuiaPage;
  let fixture: ComponentFixture<EditarGuiaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarGuiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
