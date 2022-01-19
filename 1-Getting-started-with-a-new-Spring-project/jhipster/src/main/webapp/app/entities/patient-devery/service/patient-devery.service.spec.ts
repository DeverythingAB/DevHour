import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPatientDevery, PatientDevery } from '../patient-devery.model';

import { PatientDeveryService } from './patient-devery.service';

describe('PatientDevery Service', () => {
  let service: PatientDeveryService;
  let httpMock: HttpTestingController;
  let elemDefault: IPatientDevery;
  let expectedResult: IPatientDevery | IPatientDevery[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PatientDeveryService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      curp: 'AAAAAAA',
      firstName: 'AAAAAAA',
      lastName: 'AAAAAAA',
      email: 'AAAAAAA',
      phoneNumber: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a PatientDevery', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new PatientDevery()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PatientDevery', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          curp: 'BBBBBB',
          firstName: 'BBBBBB',
          lastName: 'BBBBBB',
          email: 'BBBBBB',
          phoneNumber: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PatientDevery', () => {
      const patchObject = Object.assign(
        {
          firstName: 'BBBBBB',
          lastName: 'BBBBBB',
        },
        new PatientDevery()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PatientDevery', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          curp: 'BBBBBB',
          firstName: 'BBBBBB',
          lastName: 'BBBBBB',
          email: 'BBBBBB',
          phoneNumber: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a PatientDevery', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPatientDeveryToCollectionIfMissing', () => {
      it('should add a PatientDevery to an empty array', () => {
        const patient: IPatientDevery = { id: 123 };
        expectedResult = service.addPatientDeveryToCollectionIfMissing([], patient);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(patient);
      });

      it('should not add a PatientDevery to an array that contains it', () => {
        const patient: IPatientDevery = { id: 123 };
        const patientCollection: IPatientDevery[] = [
          {
            ...patient,
          },
          { id: 456 },
        ];
        expectedResult = service.addPatientDeveryToCollectionIfMissing(patientCollection, patient);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PatientDevery to an array that doesn't contain it", () => {
        const patient: IPatientDevery = { id: 123 };
        const patientCollection: IPatientDevery[] = [{ id: 456 }];
        expectedResult = service.addPatientDeveryToCollectionIfMissing(patientCollection, patient);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(patient);
      });

      it('should add only unique PatientDevery to an array', () => {
        const patientArray: IPatientDevery[] = [{ id: 123 }, { id: 456 }, { id: 1371 }];
        const patientCollection: IPatientDevery[] = [{ id: 123 }];
        expectedResult = service.addPatientDeveryToCollectionIfMissing(patientCollection, ...patientArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const patient: IPatientDevery = { id: 123 };
        const patient2: IPatientDevery = { id: 456 };
        expectedResult = service.addPatientDeveryToCollectionIfMissing([], patient, patient2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(patient);
        expect(expectedResult).toContain(patient2);
      });

      it('should accept null and undefined values', () => {
        const patient: IPatientDevery = { id: 123 };
        expectedResult = service.addPatientDeveryToCollectionIfMissing([], null, patient, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(patient);
      });

      it('should return initial array if no PatientDevery is added', () => {
        const patientCollection: IPatientDevery[] = [{ id: 123 }];
        expectedResult = service.addPatientDeveryToCollectionIfMissing(patientCollection, undefined, null);
        expect(expectedResult).toEqual(patientCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
