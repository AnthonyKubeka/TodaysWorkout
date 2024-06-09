import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonSleekComponent } from './button-sleek.component';

describe('ButtonSleekComponent', () => {
  let component: ButtonSleekComponent;
  let fixture: ComponentFixture<ButtonSleekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonSleekComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ButtonSleekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
