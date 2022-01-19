import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ImageDeveryService } from '../service/image-devery.service';
import { IImageDevery, ImageDevery } from '../image-devery.model';
import { ILocationDevery } from 'app/entities/location-devery/location-devery.model';
import { LocationDeveryService } from 'app/entities/location-devery/service/location-devery.service';
import { IDiagnosisDevery } from 'app/entities/diagnosis-devery/diagnosis-devery.model';
import { DiagnosisDeveryService } from 'app/entities/diagnosis-devery/service/diagnosis-devery.service';
import { IPatientDevery } from 'app/entities/patient-devery/patient-devery.model';
import { PatientDeveryService } from 'app/entities/patient-devery/service/patient-devery.service';

import { ImageDeveryUpdateComponent } from './image-devery-update.component';

describe('ImageDevery Management Update Component', () => {
  let comp: ImageDeveryUpdateComponent;
  let fixture: ComponentFixture<ImageDeveryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let imageService: ImageDeveryService;
  let locationService: LocationDeveryService;
  let diagnosisService: DiagnosisDeveryService;
  let patientService: PatientDeveryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ImageDeveryUpdateComponent],
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
      .overrideTemplate(ImageDeveryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ImageDeveryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    imageService = TestBed.inject(ImageDeveryService);
    locationService = TestBed.inject(LocationDeveryService);
    diagnosisService = TestBed.inject(DiagnosisDeveryService);
    patientService = TestBed.inject(PatientDeveryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call location query and add missing value', () => {
      const image: IImageDevery = { id: 456 };
      const location: ILocationDevery = { id: 94891 };
      image.location = location;

      const locationCollection: ILocationDevery[] = [{ id: 91743 }];
      jest.spyOn(locationService, 'query').mockReturnValue(of(new HttpResponse({ body: locationCollection })));
      const expectedCollection: ILocationDevery[] = [location, ...locationCollection];
      jest.spyOn(locationService, 'addLocationDeveryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ image });
      comp.ngOnInit();

      expect(locationService.query).toHaveBeenCalled();
      expect(locationService.addLocationDeveryToCollectionIfMissing).toHaveBeenCalledWith(locationCollection, location);
      expect(comp.locationsCollection).toEqual(expectedCollection);
    });

    it('Should call DiagnosisDevery query and add missing value', () => {
      const image: IImageDevery = { id: 456 };
      const diagnosis: IDiagnosisDevery = { id: 77660 };
      image.diagnosis = diagnosis;

      const diagnosisCollection: IDiagnosisDevery[] = [{ id: 57062 }];
      jest.spyOn(diagnosisService, 'query').mockReturnValue(of(new HttpResponse({ body: diagnosisCollection })));
      const additionalDiagnosisDeveries = [diagnosis];
      const expectedCollection: IDiagnosisDevery[] = [...additionalDiagnosisDeveries, ...diagnosisCollection];
      jest.spyOn(diagnosisService, 'addDiagnosisDeveryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ image });
      comp.ngOnInit();

      expect(diagnosisService.query).toHaveBeenCalled();
      expect(diagnosisService.addDiagnosisDeveryToCollectionIfMissing).toHaveBeenCalledWith(
        diagnosisCollection,
        ...additionalDiagnosisDeveries
      );
      expect(comp.diagnosesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call PatientDevery query and add missing value', () => {
      const image: IImageDevery = { id: 456 };
      const patient: IPatientDevery = { id: 76529 };
      image.patient = patient;

      const patientCollection: IPatientDevery[] = [{ id: 99742 }];
      jest.spyOn(patientService, 'query').mockReturnValue(of(new HttpResponse({ body: patientCollection })));
      const additionalPatientDeveries = [patient];
      const expectedCollection: IPatientDevery[] = [...additionalPatientDeveries, ...patientCollection];
      jest.spyOn(patientService, 'addPatientDeveryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ image });
      comp.ngOnInit();

      expect(patientService.query).toHaveBeenCalled();
      expect(patientService.addPatientDeveryToCollectionIfMissing).toHaveBeenCalledWith(patientCollection, ...additionalPatientDeveries);
      expect(comp.patientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const image: IImageDevery = { id: 456 };
      const location: ILocationDevery = { id: 67674 };
      image.location = location;
      const diagnosis: IDiagnosisDevery = { id: 56395 };
      image.diagnosis = diagnosis;
      const patient: IPatientDevery = { id: 98316 };
      image.patient = patient;

      activatedRoute.data = of({ image });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(image));
      expect(comp.locationsCollection).toContain(location);
      expect(comp.diagnosesSharedCollection).toContain(diagnosis);
      expect(comp.patientsSharedCollection).toContain(patient);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ImageDevery>>();
      const image = { id: 123 };
      jest.spyOn(imageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ image });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: image }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(imageService.update).toHaveBeenCalledWith(image);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ImageDevery>>();
      const image = new ImageDevery();
      jest.spyOn(imageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ image });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: image }));
      saveSubject.complete();

      // THEN
      expect(imageService.create).toHaveBeenCalledWith(image);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ImageDevery>>();
      const image = { id: 123 };
      jest.spyOn(imageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ image });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(imageService.update).toHaveBeenCalledWith(image);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackLocationDeveryById', () => {
      it('Should return tracked LocationDevery primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackLocationDeveryById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackDiagnosisDeveryById', () => {
      it('Should return tracked DiagnosisDevery primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDiagnosisDeveryById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackPatientDeveryById', () => {
      it('Should return tracked PatientDevery primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPatientDeveryById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
