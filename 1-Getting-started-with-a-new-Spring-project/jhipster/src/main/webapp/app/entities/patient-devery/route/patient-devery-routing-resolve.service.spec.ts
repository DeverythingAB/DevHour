import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IPatientDevery, PatientDevery } from '../patient-devery.model';
import { PatientDeveryService } from '../service/patient-devery.service';

import { PatientDeveryRoutingResolveService } from './patient-devery-routing-resolve.service';

describe('PatientDevery routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PatientDeveryRoutingResolveService;
  let service: PatientDeveryService;
  let resultPatientDevery: IPatientDevery | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(PatientDeveryRoutingResolveService);
    service = TestBed.inject(PatientDeveryService);
    resultPatientDevery = undefined;
  });

  describe('resolve', () => {
    it('should return IPatientDevery returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPatientDevery = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPatientDevery).toEqual({ id: 123 });
    });

    it('should return new IPatientDevery if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPatientDevery = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPatientDevery).toEqual(new PatientDevery());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as PatientDevery })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPatientDevery = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPatientDevery).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
