import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogMoodComponent } from './log-mood.component';

describe('LogMoodComponent', () => {
  let component: LogMoodComponent;
  let fixture: ComponentFixture<LogMoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogMoodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogMoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
