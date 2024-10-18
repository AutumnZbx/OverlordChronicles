import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarPostPage } from './editar-post.page';

describe('EditarPostPage', () => {
  let component: EditarPostPage;
  let fixture: ComponentFixture<EditarPostPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarPostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
