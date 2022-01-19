import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPatientDevery, getPatientDeveryIdentifier } from '../patient-devery.model';

export type EntityResponseType = HttpResponse<IPatientDevery>;
export type EntityArrayResponseType = HttpResponse<IPatientDevery[]>;

@Injectable({ providedIn: 'root' })
export class PatientDeveryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/patients');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(patient: IPatientDevery): Observable<EntityResponseType> {
    return this.http.post<IPatientDevery>(this.resourceUrl, patient, { observe: 'response' });
  }

  update(patient: IPatientDevery): Observable<EntityResponseType> {
    return this.http.put<IPatientDevery>(`${this.resourceUrl}/${getPatientDeveryIdentifier(patient) as number}`, patient, {
      observe: 'response',
    });
  }

  partialUpdate(patient: IPatientDevery): Observable<EntityResponseType> {
    return this.http.patch<IPatientDevery>(`${this.resourceUrl}/${getPatientDeveryIdentifier(patient) as number}`, patient, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPatientDevery>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPatientDevery[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPatientDeveryToCollectionIfMissing(
    patientCollection: IPatientDevery[],
    ...patientsToCheck: (IPatientDevery | null | undefined)[]
  ): IPatientDevery[] {
    const patients: IPatientDevery[] = patientsToCheck.filter(isPresent);
    if (patients.length > 0) {
      const patientCollectionIdentifiers = patientCollection.map(patientItem => getPatientDeveryIdentifier(patientItem)!);
      const patientsToAdd = patients.filter(patientItem => {
        const patientIdentifier = getPatientDeveryIdentifier(patientItem);
        if (patientIdentifier == null || patientCollectionIdentifiers.includes(patientIdentifier)) {
          return false;
        }
        patientCollectionIdentifiers.push(patientIdentifier);
        return true;
      });
      return [...patientsToAdd, ...patientCollection];
    }
    return patientCollection;
  }
}
