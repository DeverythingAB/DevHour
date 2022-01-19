import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IImageDevery, ImageDevery } from '../image-devery.model';

import { ImageDeveryService } from './image-devery.service';

describe('ImageDevery Service', () => {
  let service: ImageDeveryService;
  let httpMock: HttpTestingController;
  let elemDefault: IImageDevery;
  let expectedResult: IImageDevery | IImageDevery[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ImageDeveryService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      imageContentType: 'image/png',
      image: 'AAAAAAA',
      uploaded: false,
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

    it('should create a ImageDevery', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ImageDevery()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ImageDevery', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          image: 'BBBBBB',
          uploaded: true,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ImageDevery', () => {
      const patchObject = Object.assign(
        {
          image: 'BBBBBB',
        },
        new ImageDevery()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ImageDevery', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          image: 'BBBBBB',
          uploaded: true,
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

    it('should delete a ImageDevery', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addImageDeveryToCollectionIfMissing', () => {
      it('should add a ImageDevery to an empty array', () => {
        const image: IImageDevery = { id: 123 };
        expectedResult = service.addImageDeveryToCollectionIfMissing([], image);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(image);
      });

      it('should not add a ImageDevery to an array that contains it', () => {
        const image: IImageDevery = { id: 123 };
        const imageCollection: IImageDevery[] = [
          {
            ...image,
          },
          { id: 456 },
        ];
        expectedResult = service.addImageDeveryToCollectionIfMissing(imageCollection, image);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ImageDevery to an array that doesn't contain it", () => {
        const image: IImageDevery = { id: 123 };
        const imageCollection: IImageDevery[] = [{ id: 456 }];
        expectedResult = service.addImageDeveryToCollectionIfMissing(imageCollection, image);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(image);
      });

      it('should add only unique ImageDevery to an array', () => {
        const imageArray: IImageDevery[] = [{ id: 123 }, { id: 456 }, { id: 85526 }];
        const imageCollection: IImageDevery[] = [{ id: 123 }];
        expectedResult = service.addImageDeveryToCollectionIfMissing(imageCollection, ...imageArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const image: IImageDevery = { id: 123 };
        const image2: IImageDevery = { id: 456 };
        expectedResult = service.addImageDeveryToCollectionIfMissing([], image, image2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(image);
        expect(expectedResult).toContain(image2);
      });

      it('should accept null and undefined values', () => {
        const image: IImageDevery = { id: 123 };
        expectedResult = service.addImageDeveryToCollectionIfMissing([], null, image, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(image);
      });

      it('should return initial array if no ImageDevery is added', () => {
        const imageCollection: IImageDevery[] = [{ id: 123 }];
        expectedResult = service.addImageDeveryToCollectionIfMissing(imageCollection, undefined, null);
        expect(expectedResult).toEqual(imageCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
