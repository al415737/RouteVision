import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeocodingPlaceMockComponent } from './geocoding-place-mock.component';

describe('GeocodingPlaceMockComponent', () => {
  let component: GeocodingPlaceMockComponent;
  let fixture: ComponentFixture<GeocodingPlaceMockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeocodingPlaceMockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeocodingPlaceMockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
