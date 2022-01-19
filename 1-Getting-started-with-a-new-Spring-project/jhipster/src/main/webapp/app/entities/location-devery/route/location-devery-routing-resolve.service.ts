import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILocationDevery, LocationDevery } from '../location-devery.model';
import { LocationDeveryService } from '../service/location-devery.service';

@Injectable({ providedIn: 'root' })
export class LocationDeveryRoutingResolveService implements Resolve<ILocationDevery> {
  constructor(protected service: LocationDeveryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILocationDevery> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((location: HttpResponse<LocationDevery>) => {
          if (location.body) {
            return of(location.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new LocationDevery());
  }
}
