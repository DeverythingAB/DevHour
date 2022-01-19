import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILocationDevery, LocationDevery } from '../location-devery.model';

import { LocationDeveryService } from './location-devery.service';

describe('LocationDevery Service', () => {
  let service: LocationDeveryService;
  let httpMock: HttpTestingController;
  let elemDefault: ILocationDevery;
  let expectedResult: ILocationDevery | ILocationDevery[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LocationDeveryService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      streetAddress: 'AAAAAAA',
      postalCode: 'AAAAAAA',
      city: 'AAAAAAA',
      stateProvince: 'AAAAAAA',
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

    it('should create a LocationDevery', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new LocationDevery()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LocationDevery', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          streetAddress: 'BBBBBB',
          postalCode: 'BBBBBB',
          city: 'BBBBBB',
          stateProvince: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LocationDevery', () => {
      const patchObject = Object.assign(
        {
          streetAddress: 'BBBBBB',
          postalCode: 'BBBBBB',
          city: 'BBBBBB',
        },
        new LocationDevery()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LocationDevery', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          streetAddress: 'BBBBBB',
          postalCode: 'BBBBBB',
          city: 'BBBBBB',
          stateProvince: 'BBBBBB',
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

    it('should delete a LocationDevery', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addLocationDeveryToCollectionIfMissing', () => {
      it('should add a LocationDevery to an empty array', () => {
        const location: ILocationDevery = { id: 123 };
        expectedResult = service.addLocationDeveryToCollectionIfMissing([], location);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(location);
      });

      it('should not add a LocationDevery to an array that contains it', () => {
        const location: ILocationDevery = { id: 123 };
        const locationCollection: ILocationDevery[] = [
          {
            ...location,
          },
          { id: 456 },
        ];
        expectedResult = service.addLocationDeveryToCollectionIfMissing(locationCollection, location);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LocationDevery to an array that doesn't contain it", () => {
        const location: ILocationDevery = { id: 123 };
        const locationCollection: ILocationDevery[] = [{ id: 456 }];
        expectedResult = service.addLocationDeveryToCollectionIfMissing(locationCollection, location);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(location);
      });

      it('should add only unique LocationDevery to an array', () => {
        const locationArray: ILocationDevery[] = [{ id: 123 }, { id: 456 }, { id: 53343 }];
        const locationCollection: ILocationDevery[] = [{ id: 123 }];
        expectedResult = service.addLocationDeveryToCollectionIfMissing(locationCollection, ...locationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const location: ILocationDevery = { id: 123 };
        const location2: ILocationDevery = { id: 456 };
        expectedResult = service.addLocationDeveryToCollectionIfMissing([], location, location2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(location);
        expect(expectedResult).toContain(location2);
      });

      it('should accept null and undefined values', () => {
        const location: ILocationDevery = { id: 123 };
        expectedResult = service.addLocationDeveryToCollectionIfMissing([], null, location, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(location);
      });

      it('should return initial array if no LocationDevery is added', () => {
        const locationCollection: ILocationDevery[] = [{ id: 123 }];
        expectedResult = service.addLocationDeveryToCollectionIfMissing(locationCollection, undefined, null);
        expect(expectedResult).toEqual(locationCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
