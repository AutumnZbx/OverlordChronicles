import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuiasPage } from './guias.page';

describe('GuiasPage', () => {
  let component: GuiasPage;
  let fixture: ComponentFixture<GuiasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GuiasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
