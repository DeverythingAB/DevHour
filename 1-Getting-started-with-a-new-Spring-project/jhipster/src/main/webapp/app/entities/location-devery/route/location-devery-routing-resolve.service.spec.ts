import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ILocationDevery, LocationDevery } from '../location-devery.model';
import { LocationDeveryService } from '../service/location-devery.service';

import { LocationDeveryRoutingResolveService } from './location-devery-routing-resolve.service';

describe('LocationDevery routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: LocationDeveryRoutingResolveService;
  let service: LocationDeveryService;
  let resultLocationDevery: ILocationDevery | undefined;

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
    routingResolveService = TestBed.inject(LocationDeveryRoutingResolveService);
    service = TestBed.inject(LocationDeveryService);
    resultLocationDevery = undefined;
  });

  describe('resolve', () => {
    it('should return ILocationDevery returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLocationDevery = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultLocationDevery).toEqual({ id: 123 });
    });

    it('should return new ILocationDevery if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLocationDevery = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultLocationDevery).toEqual(new LocationDevery());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as LocationDevery })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLocationDevery = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultLocationDevery).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
