import { IImageDevery } from 'app/entities/image-devery/image-devery.model';

export interface IPatientDevery {
  id?: number;
  curp?: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  images?: IImageDevery[] | null;
}

export class PatientDevery implements IPatientDevery {
  constructor(
    public id?: number,
    public curp?: string,
    public firstName?: string | null,
    public lastName?: string | null,
    public email?: string | null,
    public phoneNumber?: string | null,
    public images?: IImageDevery[] | null
  ) {}
}

export function getPatientDeveryIdentifier(patient: IPatientDevery): number | undefined {
  return patient.id;
}
