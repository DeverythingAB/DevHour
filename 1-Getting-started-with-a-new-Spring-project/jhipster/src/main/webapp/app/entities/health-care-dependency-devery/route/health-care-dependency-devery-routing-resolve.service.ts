import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHealthCareDependencyDevery, HealthCareDependencyDevery } from '../health-care-dependency-devery.model';
import { HealthCareDependencyDeveryService } from '../service/health-care-dependency-devery.service';

@Injectable({ providedIn: 'root' })
export class HealthCareDependencyDeveryRoutingResolveService implements Resolve<IHealthCareDependencyDevery> {
  constructor(protected service: HealthCareDependencyDeveryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHealthCareDependencyDevery> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((healthCareDependency: HttpResponse<HealthCareDependencyDevery>) => {
          if (healthCareDependency.body) {
            return of(healthCareDependency.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new HealthCareDependencyDevery());
  }
}
