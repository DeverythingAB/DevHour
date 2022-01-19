import { ILocationDevery } from 'app/entities/location-devery/location-devery.model';
import { IDiagnosisDevery } from 'app/entities/diagnosis-devery/diagnosis-devery.model';
import { IPatientDevery } from 'app/entities/patient-devery/patient-devery.model';

export interface IImageDevery {
  id?: number;
  imageContentType?: string;
  image?: string;
  uploaded?: boolean | null;
  location?: ILocationDevery | null;
  diagnosis?: IDiagnosisDevery | null;
  patient?: IPatientDevery | null;
}

export class ImageDevery implements IImageDevery {
  constructor(
    public id?: number,
    public imageContentType?: string,
    public image?: string,
    public uploaded?: boolean | null,
    public location?: ILocationDevery | null,
    public diagnosis?: IDiagnosisDevery | null,
    public patient?: IPatientDevery | null
  ) {
    this.uploaded = this.uploaded ?? false;
  }
}

export function getImageDeveryIdentifier(image: IImageDevery): number | undefined {
  return image.id;
}
