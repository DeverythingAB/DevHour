import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PatientDeveryService } from '../service/patient-devery.service';
import { IPatientDevery, PatientDevery } from '../patient-devery.model';

import { PatientDeveryUpdateComponent } from './patient-devery-update.component';

describe('PatientDevery Management Update Component', () => {
  let comp: PatientDeveryUpdateComponent;
  let fixture: ComponentFixture<PatientDeveryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let patientService: PatientDeveryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PatientDeveryUpdateComponent],
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
      .overrideTemplate(PatientDeveryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PatientDeveryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    patientService = TestBed.inject(PatientDeveryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const patient: IPatientDevery = { id: 456 };

      activatedRoute.data = of({ patient });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(patient));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PatientDevery>>();
      const patient = { id: 123 };
      jest.spyOn(patientService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ patient });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: patient }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(patientService.update).toHaveBeenCalledWith(patient);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PatientDevery>>();
      const patient = new PatientDevery();
      jest.spyOn(patientService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ patient });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: patient }));
      saveSubject.complete();

      // THEN
      expect(patientService.create).toHaveBeenCalledWith(patient);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PatientDevery>>();
      const patient = { id: 123 };
      jest.spyOn(patientService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ patient });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(patientService.update).toHaveBeenCalledWith(patient);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
