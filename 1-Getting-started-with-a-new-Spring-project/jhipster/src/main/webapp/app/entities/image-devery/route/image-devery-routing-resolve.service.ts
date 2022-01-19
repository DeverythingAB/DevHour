import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IImageDevery, ImageDevery } from '../image-devery.model';
import { ImageDeveryService } from '../service/image-devery.service';

@Injectable({ providedIn: 'root' })
export class ImageDeveryRoutingResolveService implements Resolve<IImageDevery> {
  constructor(protected service: ImageDeveryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IImageDevery> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((image: HttpResponse<ImageDevery>) => {
          if (image.body) {
            return of(image.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ImageDevery());
  }
}
