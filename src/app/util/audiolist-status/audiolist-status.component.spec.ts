import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudiolistStatusComponent } from './audiolist-status.component';

describe('AudiolistStatusComponent', () => {
  let component: AudiolistStatusComponent;
  let fixture: ComponentFixture<AudiolistStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudiolistStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AudiolistStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
