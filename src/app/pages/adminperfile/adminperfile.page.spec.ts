import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminperfilePage } from './adminperfile.page';

describe('AdminperfilePage', () => {
  let component: AdminperfilePage;
  let fixture: ComponentFixture<AdminperfilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminperfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
