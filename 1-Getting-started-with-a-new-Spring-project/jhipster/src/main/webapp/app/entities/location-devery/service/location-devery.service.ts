import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILocationDevery, getLocationDeveryIdentifier } from '../location-devery.model';

export type EntityResponseType = HttpResponse<ILocationDevery>;
export type EntityArrayResponseType = HttpResponse<ILocationDevery[]>;

@Injectable({ providedIn: 'root' })
export class LocationDeveryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/locations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(location: ILocationDevery): Observable<EntityResponseType> {
    return this.http.post<ILocationDevery>(this.resourceUrl, location, { observe: 'response' });
  }

  update(location: ILocationDevery): Observable<EntityResponseType> {
    return this.http.put<ILocationDevery>(`${this.resourceUrl}/${getLocationDeveryIdentifier(location) as number}`, location, {
      observe: 'response',
    });
  }

  partialUpdate(location: ILocationDevery): Observable<EntityResponseType> {
    return this.http.patch<ILocationDevery>(`${this.resourceUrl}/${getLocationDeveryIdentifier(location) as number}`, location, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILocationDevery>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILocationDevery[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLocationDeveryToCollectionIfMissing(
    locationCollection: ILocationDevery[],
    ...locationsToCheck: (ILocationDevery | null | undefined)[]
  ): ILocationDevery[] {
    const locations: ILocationDevery[] = locationsToCheck.filter(isPresent);
    if (locations.length > 0) {
      const locationCollectionIdentifiers = locationCollection.map(locationItem => getLocationDeveryIdentifier(locationItem)!);
      const locationsToAdd = locations.filter(locationItem => {
        const locationIdentifier = getLocationDeveryIdentifier(locationItem);
        if (locationIdentifier == null || locationCollectionIdentifiers.includes(locationIdentifier)) {
          return false;
        }
        locationCollectionIdentifiers.push(locationIdentifier);
        return true;
      });
      return [...locationsToAdd, ...locationCollection];
    }
    return locationCollection;
  }
}
