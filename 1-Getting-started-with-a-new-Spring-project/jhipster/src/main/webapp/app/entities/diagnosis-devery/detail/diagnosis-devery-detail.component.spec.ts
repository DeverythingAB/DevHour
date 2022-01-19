import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DiagnosisDeveryDetailComponent } from './diagnosis-devery-detail.component';

describe('DiagnosisDevery Management Detail Component', () => {
  let comp: DiagnosisDeveryDetailComponent;
  let fixture: ComponentFixture<DiagnosisDeveryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiagnosisDeveryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ diagnosis: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DiagnosisDeveryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DiagnosisDeveryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load diagnosis on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.diagnosis).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
