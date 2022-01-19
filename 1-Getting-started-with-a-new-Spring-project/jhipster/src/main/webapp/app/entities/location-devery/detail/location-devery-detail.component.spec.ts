import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LocationDeveryDetailComponent } from './location-devery-detail.component';

describe('LocationDevery Management Detail Component', () => {
  let comp: LocationDeveryDetailComponent;
  let fixture: ComponentFixture<LocationDeveryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocationDeveryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ location: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LocationDeveryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LocationDeveryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load location on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.location).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
