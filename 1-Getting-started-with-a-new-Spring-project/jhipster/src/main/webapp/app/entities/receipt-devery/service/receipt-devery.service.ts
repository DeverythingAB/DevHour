import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReceiptDevery, getReceiptDeveryIdentifier } from '../receipt-devery.model';

export type EntityResponseType = HttpResponse<IReceiptDevery>;
export type EntityArrayResponseType = HttpResponse<IReceiptDevery[]>;

@Injectable({ providedIn: 'root' })
export class ReceiptDeveryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/receipts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(receipt: IReceiptDevery): Observable<EntityResponseType> {
    return this.http.post<IReceiptDevery>(this.resourceUrl, receipt, { observe: 'response' });
  }

  update(receipt: IReceiptDevery): Observable<EntityResponseType> {
    return this.http.put<IReceiptDevery>(`${this.resourceUrl}/${getReceiptDeveryIdentifier(receipt) as number}`, receipt, {
      observe: 'response',
    });
  }

  partialUpdate(receipt: IReceiptDevery): Observable<EntityResponseType> {
    return this.http.patch<IReceiptDevery>(`${this.resourceUrl}/${getReceiptDeveryIdentifier(receipt) as number}`, receipt, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IReceiptDevery>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IReceiptDevery[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addReceiptDeveryToCollectionIfMissing(
    receiptCollection: IReceiptDevery[],
    ...receiptsToCheck: (IReceiptDevery | null | undefined)[]
  ): IReceiptDevery[] {
    const receipts: IReceiptDevery[] = receiptsToCheck.filter(isPresent);
    if (receipts.length > 0) {
      const receiptCollectionIdentifiers = receiptCollection.map(receiptItem => getReceiptDeveryIdentifier(receiptItem)!);
      const receiptsToAdd = receipts.filter(receiptItem => {
        const receiptIdentifier = getReceiptDeveryIdentifier(receiptItem);
        if (receiptIdentifier == null || receiptCollectionIdentifiers.includes(receiptIdentifier)) {
          return false;
        }
        receiptCollectionIdentifiers.push(receiptIdentifier);
        return true;
      });
      return [...receiptsToAdd, ...receiptCollection];
    }
    return receiptCollection;
  }
}
