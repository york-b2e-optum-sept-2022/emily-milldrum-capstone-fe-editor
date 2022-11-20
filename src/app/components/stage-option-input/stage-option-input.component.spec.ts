import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageOptionInputComponent } from './stage-option-input.component';

describe('StageOptionInputComponent', () => {
  let component: StageOptionInputComponent;
  let fixture: ComponentFixture<StageOptionInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StageOptionInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StageOptionInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
