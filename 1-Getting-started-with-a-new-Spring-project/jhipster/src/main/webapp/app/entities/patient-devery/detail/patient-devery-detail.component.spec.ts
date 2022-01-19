import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PatientDeveryDetailComponent } from './patient-devery-detail.component';

describe('PatientDevery Management Detail Component', () => {
  let comp: PatientDeveryDetailComponent;
  let fixture: ComponentFixture<PatientDeveryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientDeveryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ patient: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PatientDeveryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PatientDeveryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load patient on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.patient).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
