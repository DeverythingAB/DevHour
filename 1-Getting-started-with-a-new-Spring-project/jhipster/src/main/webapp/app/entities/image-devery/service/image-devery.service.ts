import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IImageDevery, getImageDeveryIdentifier } from '../image-devery.model';

export type EntityResponseType = HttpResponse<IImageDevery>;
export type EntityArrayResponseType = HttpResponse<IImageDevery[]>;

@Injectable({ providedIn: 'root' })
export class ImageDeveryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/images');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(image: IImageDevery): Observable<EntityResponseType> {
    return this.http.post<IImageDevery>(this.resourceUrl, image, { observe: 'response' });
  }

  update(image: IImageDevery): Observable<EntityResponseType> {
    return this.http.put<IImageDevery>(`${this.resourceUrl}/${getImageDeveryIdentifier(image) as number}`, image, { observe: 'response' });
  }

  partialUpdate(image: IImageDevery): Observable<EntityResponseType> {
    return this.http.patch<IImageDevery>(`${this.resourceUrl}/${getImageDeveryIdentifier(image) as number}`, image, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IImageDevery>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IImageDevery[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addImageDeveryToCollectionIfMissing(
    imageCollection: IImageDevery[],
    ...imagesToCheck: (IImageDevery | null | undefined)[]
  ): IImageDevery[] {
    const images: IImageDevery[] = imagesToCheck.filter(isPresent);
    if (images.length > 0) {
      const imageCollectionIdentifiers = imageCollection.map(imageItem => getImageDeveryIdentifier(imageItem)!);
      const imagesToAdd = images.filter(imageItem => {
        const imageIdentifier = getImageDeveryIdentifier(imageItem);
        if (imageIdentifier == null || imageCollectionIdentifiers.includes(imageIdentifier)) {
          return false;
        }
        imageCollectionIdentifiers.push(imageIdentifier);
        return true;
      });
      return [...imagesToAdd, ...imageCollection];
    }
    return imageCollection;
  }
}
