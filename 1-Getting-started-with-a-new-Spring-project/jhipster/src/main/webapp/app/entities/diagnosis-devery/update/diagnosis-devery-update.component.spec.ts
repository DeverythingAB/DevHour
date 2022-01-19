import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DiagnosisDeveryService } from '../service/diagnosis-devery.service';
import { IDiagnosisDevery, DiagnosisDevery } from '../diagnosis-devery.model';

import { DiagnosisDeveryUpdateComponent } from './diagnosis-devery-update.component';

describe('DiagnosisDevery Management Update Component', () => {
  let comp: DiagnosisDeveryUpdateComponent;
  let fixture: ComponentFixture<DiagnosisDeveryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let diagnosisService: DiagnosisDeveryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DiagnosisDeveryUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(DiagnosisDeveryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DiagnosisDeveryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    diagnosisService = TestBed.inject(DiagnosisDeveryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const diagnosis: IDiagnosisDevery = { id: 456 };

      activatedRoute.data = of({ diagnosis });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(diagnosis));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DiagnosisDevery>>();
      const diagnosis = { id: 123 };
      jest.spyOn(diagnosisService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ diagnosis });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: diagnosis }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(diagnosisService.update).toHaveBeenCalledWith(diagnosis);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DiagnosisDevery>>();
      const diagnosis = new DiagnosisDevery();
      jest.spyOn(diagnosisService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ diagnosis });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: diagnosis }));
      saveSubject.complete();

      // THEN
      expect(diagnosisService.create).toHaveBeenCalledWith(diagnosis);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DiagnosisDevery>>();
      const diagnosis = { id: 123 };
      jest.spyOn(diagnosisService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ diagnosis });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(diagnosisService.update).toHaveBeenCalledWith(diagnosis);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
