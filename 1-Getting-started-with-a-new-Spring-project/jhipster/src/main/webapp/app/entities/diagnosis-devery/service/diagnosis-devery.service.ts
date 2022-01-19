import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDiagnosisDevery, getDiagnosisDeveryIdentifier } from '../diagnosis-devery.model';

export type EntityResponseType = HttpResponse<IDiagnosisDevery>;
export type EntityArrayResponseType = HttpResponse<IDiagnosisDevery[]>;

@Injectable({ providedIn: 'root' })
export class DiagnosisDeveryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/diagnoses');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(diagnosis: IDiagnosisDevery): Observable<EntityResponseType> {
    return this.http.post<IDiagnosisDevery>(this.resourceUrl, diagnosis, { observe: 'response' });
  }

  update(diagnosis: IDiagnosisDevery): Observable<EntityResponseType> {
    return this.http.put<IDiagnosisDevery>(`${this.resourceUrl}/${getDiagnosisDeveryIdentifier(diagnosis) as number}`, diagnosis, {
      observe: 'response',
    });
  }

  partialUpdate(diagnosis: IDiagnosisDevery): Observable<EntityResponseType> {
    return this.http.patch<IDiagnosisDevery>(`${this.resourceUrl}/${getDiagnosisDeveryIdentifier(diagnosis) as number}`, diagnosis, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDiagnosisDevery>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDiagnosisDevery[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDiagnosisDeveryToCollectionIfMissing(
    diagnosisCollection: IDiagnosisDevery[],
    ...diagnosesToCheck: (IDiagnosisDevery | null | undefined)[]
  ): IDiagnosisDevery[] {
    const diagnoses: IDiagnosisDevery[] = diagnosesToCheck.filter(isPresent);
    if (diagnoses.length > 0) {
      const diagnosisCollectionIdentifiers = diagnosisCollection.map(diagnosisItem => getDiagnosisDeveryIdentifier(diagnosisItem)!);
      const diagnosesToAdd = diagnoses.filter(diagnosisItem => {
        const diagnosisIdentifier = getDiagnosisDeveryIdentifier(diagnosisItem);
        if (diagnosisIdentifier == null || diagnosisCollectionIdentifiers.includes(diagnosisIdentifier)) {
          return false;
        }
        diagnosisCollectionIdentifiers.push(diagnosisIdentifier);
        return true;
      });
      return [...diagnosesToAdd, ...diagnosisCollection];
    }
    return diagnosisCollection;
  }
}
