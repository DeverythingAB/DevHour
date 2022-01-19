import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHealthCareDependencyDevery, getHealthCareDependencyDeveryIdentifier } from '../health-care-dependency-devery.model';

export type EntityResponseType = HttpResponse<IHealthCareDependencyDevery>;
export type EntityArrayResponseType = HttpResponse<IHealthCareDependencyDevery[]>;

@Injectable({ providedIn: 'root' })
export class HealthCareDependencyDeveryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/health-care-dependencies');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(healthCareDependency: IHealthCareDependencyDevery): Observable<EntityResponseType> {
    return this.http.post<IHealthCareDependencyDevery>(this.resourceUrl, healthCareDependency, { observe: 'response' });
  }

  update(healthCareDependency: IHealthCareDependencyDevery): Observable<EntityResponseType> {
    return this.http.put<IHealthCareDependencyDevery>(
      `${this.resourceUrl}/${getHealthCareDependencyDeveryIdentifier(healthCareDependency) as number}`,
      healthCareDependency,
      { observe: 'response' }
    );
  }

  partialUpdate(healthCareDependency: IHealthCareDependencyDevery): Observable<EntityResponseType> {
    return this.http.patch<IHealthCareDependencyDevery>(
      `${this.resourceUrl}/${getHealthCareDependencyDeveryIdentifier(healthCareDependency) as number}`,
      healthCareDependency,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IHealthCareDependencyDevery>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IHealthCareDependencyDevery[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addHealthCareDependencyDeveryToCollectionIfMissing(
    healthCareDependencyCollection: IHealthCareDependencyDevery[],
    ...healthCareDependenciesToCheck: (IHealthCareDependencyDevery | null | undefined)[]
  ): IHealthCareDependencyDevery[] {
    const healthCareDependencies: IHealthCareDependencyDevery[] = healthCareDependenciesToCheck.filter(isPresent);
    if (healthCareDependencies.length > 0) {
      const healthCareDependencyCollectionIdentifiers = healthCareDependencyCollection.map(
        healthCareDependencyItem => getHealthCareDependencyDeveryIdentifier(healthCareDependencyItem)!
      );
      const healthCareDependenciesToAdd = healthCareDependencies.filter(healthCareDependencyItem => {
        const healthCareDependencyIdentifier = getHealthCareDependencyDeveryIdentifier(healthCareDependencyItem);
        if (healthCareDependencyIdentifier == null || healthCareDependencyCollectionIdentifiers.includes(healthCareDependencyIdentifier)) {
          return false;
        }
        healthCareDependencyCollectionIdentifiers.push(healthCareDependencyIdentifier);
        return true;
      });
      return [...healthCareDependenciesToAdd, ...healthCareDependencyCollection];
    }
    return healthCareDependencyCollection;
  }
}
